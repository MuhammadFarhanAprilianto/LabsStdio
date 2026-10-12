import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Allow images, documents, and media
    const allowedTypes = [
      "image/",
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/json",
      "application/msword",
      "application/vnd.openxmlformats-officedocument",
      "text/",
    ];
    const isAllowed = allowedTypes.some((t) => file.type.startsWith(t) || file.type === t);

    if (!isAllowed && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Harap unggah gambar, PDF, dokumen, atau ZIP." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Clean filename
    const ext = path.extname(file.name) || ".webp";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueName = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
    });
  } catch (error) {
    console.error("Error in file upload:", error);
    return NextResponse.json(
      { error: "Internal server error while saving uploaded file" },
      { status: 500 }
    );
  }
}
