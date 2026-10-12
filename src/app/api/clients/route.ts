import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.clientOrganization.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        projects: {
          select: { id: true, title: true, year: true },
        },
        inquiries: {
          select: {
            id: true,
            productName: true,
            estimatedPriceMin: true,
            estimatedPriceMax: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error("[API_CLIENTS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      website = "",
      industry = "",
      contactName = "",
      contactEmail,
      avatarUrl = "",
      status = "ACTIVE",
    } = body;

    if (!name || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Company name and contact email are required." },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const client = await prisma.clientOrganization.create({
      data: {
        name,
        slug,
        website: website || null,
        industry: industry || null,
        contactName: contactName || null,
        contactEmail: contactEmail.toLowerCase(),
        avatarUrl: avatarUrl || null,
        status,
      },
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error) {
    console.error("[API_CLIENTS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to register client organization." },
      { status: 500 }
    );
  }
}
