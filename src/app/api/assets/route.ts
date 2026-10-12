import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    const whereClause: any = {};
    if (orgId) {
      whereClause.organizationId = orgId;
    }

    const assets = await (prisma as any).clientAsset.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("[API_ASSETS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { organizationId, projectId, name, category, fileUrl, fileSize, fileType, uploadedBy } = body;

    if (!organizationId || !name || !fileUrl) {
      return NextResponse.json(
        { success: false, error: "Organization ID, name, and file URL are required." },
        { status: 400 }
      );
    }

    const newAsset = await (prisma as any).clientAsset.create({
      data: {
        organizationId,
        projectId: projectId || null,
        name,
        category: category || "BRAND_LOGO",
        fileUrl,
        fileSize: fileSize || "1.0 MB",
        fileType: fileType || "application/octet-stream",
        uploadedBy: uploadedBy || session.name || "Client",
      },
    });

    // Create Activity Log for Agency
    await prisma.activityLog.create({
      data: {
        action: "CLIENT_ASSET_UPLOADED",
        entityType: "ClientAsset",
        entityId: newAsset.id,
        actorName: uploadedBy || session.name || "Client",
        details: `Klien mengunggah aset baru: ${name} (${category})`,
        organizationId,
      },
    });

    return NextResponse.json({ success: true, data: newAsset });
  } catch (error) {
    console.error("[API_ASSETS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Asset ID is required." },
        { status: 400 }
      );
    }

    await (prisma as any).clientAsset.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error) {
    console.error("[API_ASSETS_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
