import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    const whereClause: any = {};
    if (orgId) {
      whereClause.clientOrganizationId = orgId;
    }

    const scopeRequests = await prisma.inquiry.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: scopeRequests });
  } catch (error) {
    console.error("[API_SCOPE_REQUESTS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scope requests" },
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
    const {
      organizationId,
      title,
      description,
      priority,
      estimatedWeeks,
      targetSprint,
      requesterName,
      requesterEmail,
    } = body;

    if (!organizationId || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Organization ID, title, and description are required." },
        { status: 400 }
      );
    }

    // Get organization info
    const org = await prisma.clientOrganization.findUnique({
      where: { id: organizationId },
    });

    const newRequest = await prisma.inquiry.create({
      data: {
        fullName: requesterName || org?.contactName || session.name || "Client",
        email: requesterEmail || org?.contactEmail || session.email,
        company: org?.name || "Client Partner",
        projectDetails: description,
        productType: "scope-addon",
        productName: title,
        selectedFeatures: JSON.stringify([priority || "STANDARD", targetSprint || "Next Sprint"]),
        velocity: priority === "URGENT" ? "express" : "standard",
        estimatedPriceMin: priority === "URGENT" ? 8000 : 4000,
        estimatedPriceMax: priority === "URGENT" ? 15000 : 8000,
        estimatedWeeks: Number(estimatedWeeks) || 2,
        leadScore: priority === "URGENT" ? "ENTERPRISE_WHALE" : "HIGH_PRIORITY",
        status: "NEW",
        aiSummary: `Permintaan penambahan fitur (${title}) diajukan via Client Portal oleh ${org?.name || 'Klien'}. Prioritas: ${priority || 'STANDARD'}.`,
        clientOrganizationId: organizationId,
      },
    });

    // Create Activity Log
    await prisma.activityLog.create({
      data: {
        action: "SCOPE_REQUEST_SUBMITTED",
        entityType: "Inquiry",
        entityId: newRequest.id,
        actorName: requesterName || org?.contactName || session.name || "Client",
        details: `Permintaan penambahan scope baru: "${title}" (${priority || 'STANDARD'})`,
        organizationId,
      },
    });

    // Trigger asynchronous notification dispatcher (Telegram, Discord)
    import("@/lib/integrations/dispatcher").then(({ dispatchNotification }) => {
      dispatchNotification({
        type: "SCOPE_REQUEST",
        data: {
          requestId: newRequest.id,
          organizationId,
          orgName: org?.name || "Client Partner",
          title,
          category: "Scope Add-on",
          priority: priority || "NORMAL",
          estimatedWeeks: Number(estimatedWeeks) || 2,
          requesterName: requesterName || org?.contactName || session.name || "Client",
        },
      }).catch((e) => console.error("[DISPATCH_ERROR]", e));
    });

    return NextResponse.json({ success: true, data: newRequest });
  } catch (error) {
    console.error("[API_SCOPE_REQUESTS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit scope request" },
      { status: 500 }
    );
  }
}
