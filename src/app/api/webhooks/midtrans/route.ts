import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { dispatchNotification } from "@/lib/integrations/dispatcher";

// Inbound Webhook / Notification Handler for Midtrans (Indonesia Domestic Gateway)
// Handles QRIS, Virtual Accounts (BCA, Mandiri, BRI, BNI), GoPay, ShopeePay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id in notification" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();

    // 1. Cryptographic Signature Verification (SHA512)
    // Formula resmi Midtrans: SHA512(order_id + status_code + gross_amount + ServerKey)
    if (serverKey && signature_key) {
      const payloadToHash = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const expectedSignature = crypto.createHash("sha512").update(payloadToHash).digest("hex");

      if (signature_key !== expectedSignature) {
        console.warn("[MIDTRANS_SECURITY_WARNING] Signature key mismatch rejected");
        return NextResponse.json({ error: "Invalid signature key" }, { status: 401 });
      }
    }

    // 2. Determine Settlement Status
    const isPaid =
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept");

    const isPending = transaction_status === "pending";
    const isFailed =
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire";

    // 3. Find invoice in database
    const invoice = await (prisma as any).invoice.findFirst({
      where: {
        OR: [
          { invoiceNumber: order_id },
          { id: order_id },
        ],
      },
    });

    if (!invoice) {
      console.warn("[MIDTRANS_INVOICE_NOT_FOUND]", { order_id });
      return NextResponse.json({
        success: true,
        message: "Notification acknowledged, but no matching invoice found in database.",
      });
    }

    // 4. Update Invoice & Dispatch Events
    if (isPaid) {
      const updatedInvoice = await prisma.$transaction(async (tx) => {
        const updated = await (tx as any).invoice.update({
          where: { id: invoice.id },
          data: {
            status: "PAID",
            paidAt: new Date(),
          },
        });

        await tx.activityLog.create({
          data: {
            action: "MIDTRANS_PAYMENT_SETTLED",
            entityType: "Invoice",
            entityId: invoice.id,
            actorName: `Midtrans Gateway (${payment_type || "QRIS/VA"})`,
            details: `Invoice ${invoice.invoiceNumber} lunas via Midtrans (${payment_type || "Instant"}). Jumlah: ${invoice.currency} ${invoice.amount}`,
            organizationId: invoice.organizationId,
          },
        });

        return updated;
      });

      const org = await prisma.clientOrganization.findUnique({
        where: { id: invoice.organizationId },
      });

      // Trigger Asynchronous Realtime Dispatcher (Telegram + Discord + Email)
      await dispatchNotification({
        type: "INVOICE_PAID",
        data: {
          invoiceId: updatedInvoice.id,
          invoiceNumber: updatedInvoice.invoiceNumber,
          orgName: org?.name || "Client Partner",
          amount: updatedInvoice.amount,
          currency: updatedInvoice.currency,
          paidAt: updatedInvoice.paidAt.toISOString(),
          payerName: `Verified Client (${payment_type || "Midtrans QRIS/VA"})`,
        },
      }).catch((e) => console.error("[DISPATCH_ERROR]", e));

      return NextResponse.json({
        success: true,
        message: "Midtrans settlement processed. Invoice status updated to PAID.",
        invoiceNumber: updatedInvoice.invoiceNumber,
      });
    } else if (isFailed) {
      await (prisma as any).invoice.update({
        where: { id: invoice.id },
        data: { status: "OVERDUE" },
      });

      return NextResponse.json({
        success: true,
        message: `Midtrans transaction status '${transaction_status}' updated.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Midtrans notification status '${transaction_status}' acknowledged.`,
    });
  } catch (error: any) {
    console.error("[MIDTRANS_WEBHOOK_EXCEPTION]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Midtrans webhook error" },
      { status: 500 }
    );
  }
}
