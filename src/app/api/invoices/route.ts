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

    const invoices = await (prisma as any).invoice.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    console.error("[API_INVOICES_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
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
    const { organizationId, projectId, title, amount, currency, status, dueDate, invoiceNumber } = body;

    if (!organizationId || !title || !amount) {
      return NextResponse.json(
        { success: false, error: "Organization ID, title, and amount are required." },
        { status: 400 }
      );
    }

    const generatedNumber = invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newInvoice = await (prisma as any).invoice.create({
      data: {
        invoiceNumber: generatedNumber,
        organizationId,
        projectId: projectId || null,
        title,
        amount: Number(amount),
        currency: currency || "USD",
        status: status || "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: newInvoice });
  } catch (error) {
    console.error("[API_INVOICES_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
