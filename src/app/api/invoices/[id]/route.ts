import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { applySecurityShield, shieldError } from "@/lib/security";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const shield = await applySecurityShield(request, {
      maxBodyBytes: 128 * 1024,
      rateLimitKey: "invoice_patch",
      rateLimitMax: 30,
    });
    if (!shield.success) return shield.response!;

    const { id } = await params;
    const { status, paymentMethod } = shield.data || {};

    const updated = await prisma.$transaction(async (tx) => {
      const inv = await (tx as any).invoice.update({
        where: { id },
        data: {
          status: status || "PAID",
          paidAt: status === "PAID" ? new Date() : null,
        },
      });

      await tx.activityLog.create({
        data: {
          action: "INVOICE_STATUS_UPDATED",
          entityType: "Invoice",
          entityId: id,
          actorName: session.name || "Client",
          details: `Status invoice ${inv.invoiceNumber} diperbarui menjadi ${inv.status}${paymentMethod ? ` via ${paymentMethod}` : ""}`,
          organizationId: inv.organizationId,
        },
      });

      return inv;
    });

    if (updated.status === "PAID") {
      // Trigger notification dispatcher
      import("@/lib/integrations/dispatcher").then(async ({ dispatchNotification }) => {
        const org = await prisma.clientOrganization.findUnique({
          where: { id: updated.organizationId },
        });
        dispatchNotification({
          type: "INVOICE_PAID",
          data: {
            invoiceId: updated.id,
            invoiceNumber: updated.invoiceNumber,
            orgName: org?.name || "Client Partner",
            amount: updated.amount,
            currency: updated.currency,
            paidAt: updated.paidAt ? updated.paidAt.toISOString() : new Date().toISOString(),
            payerName: session.name || "Client",
            paymentMethod: paymentMethod || "International Gateway",
          },
        }).catch((e) => console.error("[DISPATCH_ERROR]", e));
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return shieldError(error, "Failed to update invoice");
  }
}
