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
    if (body.excerpt !== undefined) dataToUpdate.excerpt = body.excerpt;
    if (body.content !== undefined) dataToUpdate.content = body.content;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.featured !== undefined) dataToUpdate.featured = Boolean(body.featured);
    if (body.readTime !== undefined) dataToUpdate.readTime = body.readTime;
    if (body.authorName !== undefined) dataToUpdate.authorName = body.authorName;

    const updated = await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    });

    try {
      revalidatePath("/journal");
      revalidatePath("/admin");
    } catch {
      // Safe fallback
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API_POST_PATCH_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });

    try {
      revalidatePath("/journal");
      revalidatePath("/admin");
    } catch {
      // Safe fallback
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.error("[API_POST_DELETE_ERROR]", error);
    return NextResponse.json({ success: false, error: "Failed to delete post." }, { status: 500 });
  }
}
