import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminCRMView, {
  InquiryItem,
  ProjectItem,
  PostItem,
  ClientOrgItem,
  ActivityLogItem,
} from "@/components/admin/AdminCRMView";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "PROJECT_MANAGER")) {
    redirect("/login?redirect=/admin");
  }

  // 1. Fetch Inquiries
  const rawInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const inquiries: InquiryItem[] = rawInquiries.map((inq) => ({
    ...inq,
    createdAt: inq.createdAt.toISOString(),
    updatedAt: inq.updatedAt.toISOString(),
  }));

  // 2. Fetch Projects (Portfolio & Active Sprints)
  const rawProjects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      organization: { select: { id: true, name: true, slug: true } },
      milestones: { orderBy: { order: "asc" } },
    },
  });

  const projects: ProjectItem[] = rawProjects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    milestones: p.milestones.map((m) => ({
      ...m,
      targetDate: m.targetDate ? m.targetDate.toISOString() : null,
      approvedAt: m.approvedAt ? m.approvedAt.toISOString() : null,
    })),
  }));

  // 3. Fetch Posts (Journal CMS)
  const rawPosts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const posts: PostItem[] = rawPosts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  // 4. Fetch Client Organizations (Clients CRM)
  const rawClients = await prisma.clientOrganization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      projects: { select: { id: true, title: true, year: true } },
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

  const clients: ClientOrgItem[] = rawClients.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  // 5. Fetch Activity Logs
  const rawLogs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const activityLogs: ActivityLogItem[] = rawLogs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <AdminCRMView
      initialInquiries={inquiries}
      initialProjects={projects}
      initialPosts={posts}
      initialClients={clients}
      initialLogs={activityLogs}
      userRole={session.role}
      userName={session.name}
      userEmail={session.email}
    />
  );
}
