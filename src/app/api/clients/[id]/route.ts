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
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.website !== undefined) dataToUpdate.website = body.website;
    if (body.industry !== undefined) dataToUpdate.industry = body.industry;
    if (body.contactName !== undefined) dataToUpdate.contactName = body.contactName;
    if (body.contactEmail !== undefined) dataToUpdate.contactEmail = body.contactEmail.toLowerCase();
    if (body.status !== undefined) dataToUpdate.status = body.status;

    const updated = await prisma.clientOrganization.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API_CLIENT_PATCH_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update client organization." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.clientOrganization.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Client organization deleted successfully." });
  } catch (error) {
    console.error("[API_CLIENT_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to delete client organization." }, { status: 500 });
  }
}
