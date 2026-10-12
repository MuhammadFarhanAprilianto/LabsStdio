import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientPortalView, {
  PortalOrganization,
  PortalProject,
  PortalMilestone,
} from "@/components/portal/ClientPortalView";

interface ClientPortalPageProps {
  searchParams: Promise<{ projectId?: string; orgId?: string }>;
}

export default async function ClientPortalPage({ searchParams }: ClientPortalPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/portal");
  }

  const { projectId, orgId } = await searchParams;
  const isAdmin = session.role === "SUPER_ADMIN" || session.role === "PROJECT_MANAGER";

  // 1. Fetch all real client organizations
  const rawAllClients = await prisma.clientOrganization.findMany({
    where: {
      name: { not: "Labs Stdio Command Center" },
    },
    orderBy: { name: "asc" },
    include: {
      projects: {
        include: {
          milestones: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  const allClients: PortalOrganization[] = rawAllClients.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    website: c.website,
    industry: c.industry,
    contactName: c.contactName,
    contactEmail: c.contactEmail,
    avatarUrl: c.avatarUrl,
    projects: c.projects.map((p) => ({
      id: p.id,
      title: p.title,
      clientName: p.clientName,
      year: p.year,
      category: p.category,
      overview: p.overview,
      heroImage: p.heroImage,
      liveDemoUrl: p.liveDemoUrl,
      figmaUrl: p.figmaUrl,
      deliverables: p.deliverables,
      milestones: p.milestones.map((m) => ({
        id: m.id,
        projectId: m.projectId,
        order: m.order,
        title: m.title,
        description: m.description,
        deliverables: m.deliverables,
        targetDate: m.targetDate ? m.targetDate.toISOString() : null,
        status: m.status,
        approvedBy: m.approvedBy,
        approvedAt: m.approvedAt ? m.approvedAt.toISOString() : null,
        approvalNotes: m.approvalNotes,
      })),
    })),
  }));

  // 2. Resolve current target organization
  let currentOrg: PortalOrganization | null = null;
  let targetProject: PortalProject | null = null;

  if (orgId) {
    currentOrg = allClients.find((c) => c.id === orgId) || null;
  } else if (projectId) {
    for (const org of allClients) {
      const foundP = org.projects.find((p) => p.id === projectId);
      if (foundP) {
        currentOrg = org;
        targetProject = foundP;
        break;
      }
    }
  }

  // If not resolved yet by query params:
  if (!currentOrg) {
    if (!isAdmin && session.clientOrganizationId) {
      currentOrg = allClients.find((c) => c.id === session.clientOrganizationId) || null;
    } else {
      // Default to first real client organization
      currentOrg = allClients[0] || null;
    }
  }

  // Fallback if no client organization exists in DB
  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-[#07080b] text-white flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <h2 className="text-xl font-bold">Belum Ada Organisasi Klien Terdaftar</h2>
          <p className="text-xs text-neutral-400">Silakan daftarkan klien baru di Admin Dashboard.</p>
        </div>
      </div>
    );
  }

  if (!targetProject && currentOrg.projects.length > 0) {
    targetProject = currentOrg.projects[0];
  }

  // 3. Fetch initial assets, invoices, and scope requests for currentOrg
  const [rawAssets, rawInvoices, rawScopeRequests] = await Promise.all([
    (prisma as any).clientAsset.findMany({
      where: { organizationId: currentOrg.id },
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).invoice.findMany({
      where: { organizationId: currentOrg.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inquiry.findMany({
      where: { clientOrganizationId: currentOrg.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const initialAssets = rawAssets.map((a: any) => ({
    id: a.id,
    organizationId: a.organizationId,
    projectId: a.projectId,
    name: a.name,
    category: a.category,
    fileUrl: a.fileUrl,
    fileSize: a.fileSize,
    fileType: a.fileType,
    uploadedBy: a.uploadedBy,
    createdAt: a.createdAt.toISOString(),
  }));

  const initialInvoices = rawInvoices.map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    organizationId: inv.organizationId,
    projectId: inv.projectId,
    title: inv.title,
    amount: inv.amount,
    currency: inv.currency,
    status: inv.status,
    dueDate: inv.dueDate ? inv.dueDate.toISOString() : null,
    paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
    invoiceUrl: inv.invoiceUrl,
    createdAt: inv.createdAt.toISOString(),
  }));

  const initialScopeRequests = rawScopeRequests.map((req) => ({
    id: req.id,
    title: req.productName,
    description: req.projectDetails || "",
    status: req.status,
    leadScore: req.leadScore,
    estimatedWeeks: req.estimatedWeeks,
    createdAt: req.createdAt.toISOString(),
    requesterName: req.fullName,
    requesterEmail: req.email,
  }));

  return (
    <ClientPortalView
      isAdmin={isAdmin}
      adminName={session.name}
      adminEmail={session.email}
      currentOrg={currentOrg}
      allClients={allClients}
      initialProject={targetProject}
      initialAssets={initialAssets}
      initialInvoices={initialInvoices}
      initialScopeRequests={initialScopeRequests}
    />
  );
}
