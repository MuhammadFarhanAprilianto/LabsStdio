import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        organization: true,
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    const parsedProjects = projects.map((proj) => ({
      ...proj,
      deliverables: (() => {
        try {
          return JSON.parse(proj.deliverables);
        } catch {
          return [];
        }
      })(),
      metrics: (() => {
        try {
          return JSON.parse(proj.metrics);
        } catch {
          return [];
        }
      })(),
      techStack: (() => {
        try {
          return proj.techStack ? JSON.parse(proj.techStack) : [];
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json(
      {
        success: true,
        count: parsedProjects.length,
        data: parsedProjects,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[API_PROJECTS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      clientName,
      year = "2026",
      category,
      overview,
      challenge = "",
      solution = "",
      heroImage = "/images/after_ui.webp",
      deliverables = [],
      metrics = [],
      techStack = [],
      liveDemoUrl = "",
      figmaUrl = "",
      featured = false,
      organizationId = null,
    } = body;

    if (!title || !clientName || !category) {
      return NextResponse.json(
        { success: false, error: "Title, client name, and category are required." },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString().slice(-4);

    const project = await prisma.project.create({
      data: {
        slug,
        title,
        clientName,
        year: String(year),
        category,
        overview: overview || title,
        challenge,
        solution,
        heroImage,
        deliverables:
          typeof deliverables === "string"
            ? deliverables
            : JSON.stringify(deliverables),
        metrics:
          typeof metrics === "string" ? metrics : JSON.stringify(metrics),
        techStack:
          typeof techStack === "string"
            ? techStack
            : JSON.stringify(techStack),
        liveDemoUrl: liveDemoUrl || null,
        figmaUrl: figmaUrl || null,
        featured: Boolean(featured),
        organizationId: organizationId || null,
      },
      include: {
        organization: true,
        milestones: true,
      },
    });

    // On-Demand Tag / Path Invalidation
    try {
      revalidatePath("/");
      revalidatePath("/admin");
    } catch {
      // Safe fallback in non-request context
    }

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("[API_PROJECTS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project." },
      { status: 500 }
    );
  }
}

