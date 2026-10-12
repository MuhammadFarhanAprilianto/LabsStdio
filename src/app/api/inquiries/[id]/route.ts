import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = [
  "NEW",
  "CONTACTED",
  "DISCOVERY_CALL",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
] as const;

const VALID_LEAD_SCORES = [
  "STANDARD",
  "HIGH_PRIORITY",
  "ENTERPRISE_WHALE",
] as const;

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "PROJECT_MANAGER")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { id } = await props.params;
    const body = await request.json();
    const { status, notes, leadScore } = body;

    const dataToUpdate: Record<string, unknown> = {};

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
          },
          { status: 400 }
        );
      }
      dataToUpdate.status = status;
    }

    if (notes !== undefined) {
      dataToUpdate.notes = typeof notes === "string" ? notes : null;
    }

    if (leadScore !== undefined) {
      if (!VALID_LEAD_SCORES.includes(leadScore)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid lead score. Must be one of: ${VALID_LEAD_SCORES.join(", ")}`,
          },
          { status: 400 }
        );
      }
      dataToUpdate.leadScore = leadScore;
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Lead status updated successfully.",
      data: updatedInquiry,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update inquiry.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Super Admin role required." },
        { status: 403 }
      );
    }

    const { id } = await props.params;

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete inquiry.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
