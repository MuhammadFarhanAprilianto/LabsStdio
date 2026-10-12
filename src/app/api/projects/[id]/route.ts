import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.clientName !== undefined) dataToUpdate.clientName = body.clientName;
    if (body.category !== undefined) dataToUpdate.category = body.category;
    if (body.overview !== undefined) dataToUpdate.overview = body.overview;
    if (body.featured !== undefined) dataToUpdate.featured = Boolean(body.featured);
    if (body.sortOrder !== undefined) dataToUpdate.sortOrder = Number(body.sortOrder);
    if (body.heroImage !== undefined) dataToUpdate.heroImage = body.heroImage;
    if (body.liveDemoUrl !== undefined) dataToUpdate.liveDemoUrl = body.liveDemoUrl;
    if (body.figmaUrl !== undefined) dataToUpdate.figmaUrl = body.figmaUrl;

    const updated = await prisma.project.update({
      where: { id },
      data: dataToUpdate,
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin");
    } catch {
      // Safe fallback
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API_PROJECT_PATCH_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update project." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });

    try {
      revalidatePath("/");
      revalidatePath("/admin");
    } catch {
      // Safe fallback
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    console.error("[API_PROJECT_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to delete project." }, { status: 500 });
  }
}
