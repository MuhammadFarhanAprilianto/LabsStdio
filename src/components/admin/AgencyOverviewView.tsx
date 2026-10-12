"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  FolderKanban,
  FileText,
  Users,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  ArrowRight,
} from "lucide-react";
import { InquiryItem, ProjectItem, PostItem, ClientOrgItem, ActivityLogItem } from "./AdminCRMView";

interface AgencyOverviewViewProps {
  inquiries: InquiryItem[];
  projects: ProjectItem[];
  posts: PostItem[];
  clients: ClientOrgItem[];
  logs: ActivityLogItem[];
  onNavigateMenu: (menu: "leads" | "projects" | "case_studies" | "articles" | "clients") => void;
  onOpenNewInquiry: () => void;
}

const formatPrice = (val: number): string => {
  if (typeof val !== "number" || isNaN(val)) return "0";
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function AgencyOverviewView({
  inquiries,
  projects,
  posts,
  clients,
  logs,
  onNavigateMenu,
  onOpenNewInquiry,
}: AgencyOverviewViewProps) {
  // Financial Calculations
  const activePipelineValue = inquiries
    .filter((i) => i.status !== "LOST" && i.status !== "WON")
    .reduce((acc, curr) => acc + curr.estimatedPriceMin, 0);

  const closedWonValue = inquiries
    .filter((i) => i.status === "WON")
    .reduce((acc, curr) => acc + curr.estimatedPriceMax, 0);

  const totalContractValuation = closedWonValue + activePipelineValue;

  const totalViews = posts.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  // Service distribution
  const serviceBreakdown = [
    {
      name: "Web Applications & Platforms",
      count: inquiries.filter((i) => i.productType === "web-app").length,
      color: "bg-blue-500",
      pct: 45,
    },
    {
      name: "Mobile & Cross-Platform",
      count: inquiries.filter((i) => i.productType === "mobile-app").length,
      color: "bg-purple-500",
      pct: 25,
    },
    {
      name: "AI & Intelligent Automation",
      count: inquiries.filter((i) => i.productType === "ai-system").length,
      color: "bg-[#a6f30d]",
      pct: 20,
    },
    {
      name: "Brand & UI/UX Product Design",
      count: inquiries.filter((i) => i.productType === "ui-ux-design").length,
      color: "bg-amber-500",
      pct: 10,
    },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 [scrollbar-width:thin]">
      {/* Top Welcome & Agency OS Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-br from-[#121316] via-[#1a1c22] to-black text-white relative overflow-hidden shadow-xl border border-neutral-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#a6f30d]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#d4f938] text-[11px] font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#a6f30d]" />
            <span>Labs Stdio Creative Operating System</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight font-['Questrial']">
            Agency Performance & Portfolio Analytics
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Ringkasan menyeluruh kesehatan bisnis agensi, konversi proposal klien, status sprint aktif, dan publikasi portofolio kreatif Labs Stdio.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewInquiry}
            className="px-4 py-2.5 rounded-xl bg-[#a6f30d] text-black font-bold text-xs hover:bg-[#bbf638] transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <Flame className="w-4 h-4" />
            <span>New Client Brief</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateMenu("projects")}
            className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all border border-white/15 cursor-pointer flex items-center gap-2"
          >
            <span>View Active Sprints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Value */}
        <div className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Active Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Questrial'] text-gray-900">
            ${formatPrice(activePipelineValue)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span>+12.4%</span>
            <span className="text-neutral-400 font-normal">from active client inquiries</span>
          </div>
        </div>

        {/* Card 2: Signed Contracts */}
        <div className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Signed Projects Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Questrial'] text-gray-900">
            ${formatPrice(closedWonValue)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span>+100%</span>
            <span className="text-neutral-400 font-normal">confirmed project kickoff</span>
          </div>
        </div>

        {/* Card 3: Active Client Projects */}
        <div className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Active Projects & Sprints</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Questrial'] text-gray-900">
            {projects.length} Projects
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{clients.length} Partner Brands</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">100% on schedule</span>
          </div>
        </div>

        {/* Card 4: Thought Leadership Readership */}
        <div className="p-5 rounded-2xl bg-white border border-[#eaecf0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Journal Readers & Views</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-['Questrial'] text-gray-900">
            {totalViews.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            <span>{posts.length} Published Articles</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">+18% reach</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Service Capacity & Active Client Projects Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Lines & Demand */}
        <div className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-['Agrandir']">
                Agency Service Breakdown
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Distribusi permintaan deliverable klien
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-neutral-100 rounded-lg text-neutral-600">
              {inquiries.length} Inquiries
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {serviceBreakdown.map((s, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800">{s.name}</span>
                  <span className="font-bold text-neutral-500">{s.count} Briefs</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${Math.max(15, (s.count / Math.max(1, inquiries.length)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#eaecf0]">
            <button
              type="button"
              onClick={() => onNavigateMenu("leads")}
              className="w-full py-2 rounded-xl text-xs font-bold text-center text-gray-900 bg-[#f8f9fa] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Kelola Inquiries di Pipeline →
            </button>
          </div>
        </div>

        {/* Active Client Deliveries */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-['Agrandir']">
                Active Project Sprints & Client Milestones
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Proyek klien yang sedang berjalan di studio
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateMenu("projects")}
              className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {projects.slice(0, 3).map((proj) => {
              const totalMilestones = proj.milestones?.length || 0;
              const completedMilestones =
                proj.milestones?.filter((m) => m.status === "APPROVED").length || 0;
              const progressPct =
                totalMilestones > 0
                  ? Math.round((completedMilestones / totalMilestones) * 100)
                  : 50;

              return (
                <div
                  key={proj.id}
                  className="p-4 rounded-2xl border border-[#eaecf0] hover:border-black/30 hover:bg-[#fafbfc] transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{proj.clientName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                          {proj.year}
                        </span>
                      </div>
                      <h4 className="text-xs text-neutral-600 mt-0.5 font-medium line-clamp-1">
                        {proj.title}
                      </h4>
                    </div>

                    <span className="text-xs font-mono font-bold text-gray-900 px-2 py-1 rounded-lg bg-neutral-100">
                      {progressPct}% Done
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-black transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>
                      {completedMilestones} of {totalMilestones} Sprints Completed
                    </span>
                    <span className="text-neutral-500 font-semibold">{proj.category}</span>
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="p-8 text-center text-xs text-neutral-400 border border-dashed rounded-2xl">
                Belum ada active projects. Anda dapat mengonversi lead dari pipeline atau menambahkannya di menu Active Projects.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Client Directory & Case Studies CMS Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Brands Directory */}
        <div className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-600" />
              <h3 className="text-sm font-bold text-gray-900 font-['Agrandir']">
                Partner Brands & Clients
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateMenu("clients")}
              className="text-xs font-bold text-black hover:underline cursor-pointer"
            >
              Open Directory →
            </button>
          </div>

          <div className="divide-y divide-[#eaecf0]">
            {clients.slice(0, 3).map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-black text-[#a6f30d] font-bold text-xs flex items-center justify-center shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{c.name}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{c.contactEmail}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Thought Leadership & Publications */}
        <div className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-600" />
              <h3 className="text-sm font-bold text-gray-900 font-['Agrandir']">
                Latest Journal Publications
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateMenu("articles")}
              className="text-xs font-bold text-black hover:underline cursor-pointer"
            >
              Manage CMS →
            </button>
          </div>

          <div className="divide-y divide-[#eaecf0]">
            {posts.slice(0, 3).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{p.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {p.readTime} • {p.viewCount} views
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
