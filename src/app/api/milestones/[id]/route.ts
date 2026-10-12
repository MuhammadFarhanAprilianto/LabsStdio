import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.deliverables !== undefined) {
      dataToUpdate.deliverables =
        typeof body.deliverables === "string"
          ? body.deliverables
          : JSON.stringify(body.deliverables);
    }
    if (body.targetDate !== undefined) {
      dataToUpdate.targetDate = body.targetDate ? new Date(body.targetDate) : null;
    }
    if (body.approvedBy !== undefined) dataToUpdate.approvedBy = body.approvedBy;
    if (body.approvalNotes !== undefined) dataToUpdate.approvalNotes = body.approvalNotes;
    if (body.status === "APPROVED" && !body.approvedAt) {
      dataToUpdate.approvedAt = new Date();
    }

    const updated = await prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.update({
        where: { id },
        data: dataToUpdate,
        include: {
          project: {
            select: { id: true, title: true, organizationId: true, clientName: true },
          },
        },
      });

      await tx.activityLog.create({
        data: {
          action: `MILESTONE_${dataToUpdate.status || "UPDATED"}`,
          entityType: "Milestone",
          entityId: id,
          actorName: body.actorName || "Admin Studio",
          details: JSON.stringify({
            title: milestone.title,
            status: milestone.status,
            projectTitle: milestone.project.title,
            notes: milestone.approvalNotes,
          }),
          organizationId: milestone.project.organizationId || null,
        },
      });

      return milestone;
    });

    if (updated.status === "APPROVED") {
      import("@/lib/integrations/dispatcher").then(({ dispatchNotification }) => {
        dispatchNotification({
          type: "MILESTONE_APPROVED",
          data: {
            milestoneId: updated.id,
            milestoneTitle: updated.title,
            projectTitle: updated.project.title,
            orgName: updated.project.clientName || "Client Partner",
            approvedBy: updated.approvedBy || "Client",
            approvalNotes: updated.approvalNotes,
          },
        }).catch((e) => console.error("[DISPATCH_ERROR]", e));
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API_MILESTONE_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update milestone status." },
      { status: 500 }
    );
  }
}
