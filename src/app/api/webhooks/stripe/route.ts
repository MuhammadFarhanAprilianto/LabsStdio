import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { dispatchNotification } from "@/lib/integrations/dispatcher";

// Inbound Webhook Handler for Payment Gateways (Stripe / Midtrans Standard)
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") || "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

    let event: any;

    // Cryptographic Signature Verification
    if (webhookSecret && signature) {
      try {
        const parts = signature.split(",");
        const timestampPart = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
        const signaturePart = parts.find((p) => p.startsWith("v1="))?.replace("v1=", "");

        if (!timestampPart || !signaturePart) {
          return NextResponse.json({ error: "Invalid signature header formatting" }, { status: 400 });
        }

        const signedPayload = `${timestampPart}.${rawBody}`;
        const expectedSignature = crypto
          .createHmac("sha256", webhookSecret)
          .update(signedPayload, "utf8")
          .digest("hex");

        if (crypto.timingSafeEqual(Buffer.from(signaturePart), Buffer.from(expectedSignature)) === false) {
          console.warn("[WEBHOOK_SECURITY_WARNING] Signature mismatch rejected");
          return NextResponse.json({ error: "Invalid cryptographic webhook signature" }, { status: 401 });
        }

        event = JSON.parse(rawBody);
      } catch (err: any) {
        console.error("[WEBHOOK_VERIFY_ERROR]", err);
        return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
      }
    } else {
      // Simulation / Test mode (When secret not configured in .env yet)
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    const eventType = event.type || "checkout.session.completed";
    const eventData = event.data?.object || event;

    // Handle payment completed events
    if (
      eventType === "checkout.session.completed" ||
      eventType === "invoice.payment_succeeded" ||
      eventType === "payment_intent.succeeded"
    ) {
      const invoiceNumber =
        eventData.metadata?.invoiceNumber ||
        eventData.invoice_number ||
        eventData.invoiceNumber;
      
      const invoiceId = eventData.metadata?.invoiceId || eventData.invoiceId;

      // Find invoice in database
      const invoice = await (prisma as any).invoice.findFirst({
        where: {
          OR: [
            ...(invoiceId ? [{ id: invoiceId }] : []),
            ...(invoiceNumber ? [{ invoiceNumber: invoiceNumber }] : []),
          ],
        },
      });

      if (invoice) {
        // ACID Atomic Transaction: Mark invoice as PAID and record activity log simultaneously
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
              action: "STRIPE_WEBHOOK_PAYMENT_SETTLED",
              entityType: "Invoice",
              entityId: invoice.id,
              actorName: "Stripe Payment Gateway",
              details: `Invoice ${invoice.invoiceNumber} otomatis lunas via Webhook Settlement (${eventType}). Jumlah: ${invoice.currency} ${invoice.amount}`,
              organizationId: invoice.organizationId,
            },
          });

          return updated;
        });

        const org = await prisma.clientOrganization.findUnique({
          where: { id: invoice.organizationId },
        });

        // Trigger Realtime Notification Dispatcher
        await dispatchNotification({
          type: "INVOICE_PAID",
          data: {
            invoiceId: updatedInvoice.id,
            invoiceNumber: updatedInvoice.invoiceNumber,
            orgName: org?.name || "Client Partner",
            amount: updatedInvoice.amount,
            currency: updatedInvoice.currency,
            paidAt: updatedInvoice.paidAt.toISOString(),
            payerName: eventData.customer_details?.name || "Verified Client",
          },
        }).catch((e) => console.error("[DISPATCH_ERROR]", e));

        return NextResponse.json({
          success: true,
          message: "Payment verified and invoice settled successfully.",
          invoiceNumber: updatedInvoice.invoiceNumber,
        });
      } else {
        console.warn("[WEBHOOK_INVOICE_NOT_FOUND]", { invoiceNumber, invoiceId });
        return NextResponse.json({
          success: true,
          message: "Webhook processed, but no matching invoice found.",
        });
      }
    }

    return NextResponse.json({ success: true, message: `Webhook event ${eventType} acknowledged.` });
  } catch (error: any) {
    console.error("[INBOUND_WEBHOOK_EXCEPTION]", error);
    return NextResponse.json({ error: error?.message || "Internal webhook server error" }, { status: 500 });
  }
}
