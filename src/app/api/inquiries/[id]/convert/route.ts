import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
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

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found." },
        { status: 404 }
      );
    }

    // 1. Find or create Client Organization
    const companyName = inquiry.company || `${inquiry.fullName}'s Organization`;
    const baseSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const orgSlug = `${baseSlug}-${randomSuffix}`;

    let organization = await prisma.clientOrganization.findUnique({
      where: { contactEmail: inquiry.email.toLowerCase() },
    });

    if (!organization) {
      organization = await prisma.clientOrganization.create({
        data: {
          name: companyName,
          slug: orgSlug,
          contactName: inquiry.fullName,
          contactEmail: inquiry.email.toLowerCase(),
          status: "ACTIVE",
        },
      });
    }

    // 2. Create Active Project linked to this organization
    const projectTitle = `${inquiry.productName} for ${inquiry.company || inquiry.fullName}`;
    const projectSlug = `${baseSlug}-project-${randomSuffix}`;

    const project = await prisma.project.create({
      data: {
        title: projectTitle,
        slug: projectSlug,
        clientName: inquiry.company || inquiry.fullName,
        year: "2026",
        category: inquiry.productType || "Digital Architecture",
        overview: inquiry.projectDetails || "Enterprise digital project commissioned via Labs Stdio CRM.",
        challenge: "Delivering venture-grade digital architecture within targeted sprint velocity.",
        solution: "Engineered with Next.js modern web standards and high-fidelity interaction design.",
        heroImage: "/images/hero-sample.webp",
        deliverables: inquiry.selectedFeatures || "[]",
        metrics: JSON.stringify([{ label: "Sprint Target", value: `~${inquiry.estimatedWeeks} Wks`, desc: "Velocity" }]),
        organizationId: organization.id,
      },
    });

    // 3. Create default sprint milestones for Client Portal collaboration
    await prisma.milestone.createMany({
      data: [
        {
          projectId: project.id,
          title: "Sprint 01: Product Discovery & Token Architecture",
          order: 1,
          description: "Technical kickoff, design token alignment, and system scoping.",
          status: "IN_PROGRESS",
        },
        {
          projectId: project.id,
          title: "Sprint 02: High-Fidelity UI & Core Engineering",
          order: 2,
          description: "Full component assembly, micro-interactions, and database integration.",
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Sprint 03: Performance Optimization & Staging QA",
          order: 3,
          description: "Lighthouse audit, cross-browser validation, and security sign-off.",
          status: "PENDING",
        },
      ],
    });

    // 4. Update Inquiry to WON and link organization
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: {
        status: "WON",
        clientOrganizationId: organization.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead successfully converted to an Active Client Project!",
      data: {
        inquiry: updatedInquiry,
        organization,
        project,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to convert lead.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
