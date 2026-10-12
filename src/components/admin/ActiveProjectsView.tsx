"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Building,
  Calendar,
  X,
  AlertCircle,
  Eye,
  Edit3,
  FileCheck,
} from "lucide-react";
import { ProjectItem, MilestoneItem, ClientOrgItem } from "./AdminCRMView";
import { AdminCustomDropdown } from "./AdminCustomDropdown";
import { ImageUploadField } from "./ImageUploadField";

interface ActiveProjectsViewProps {
  projects: ProjectItem[];
  clients?: ClientOrgItem[];
  onUpdateProjects: (updated: ProjectItem[]) => void;
  showToast: (msg: string) => void;
}

const MILESTONE_STATUSES = [
  { value: "PLANNED", label: "Planned", badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-200", dot: "bg-neutral-400" },
  { value: "IN_PROGRESS", label: "In Progress", badgeColor: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  { value: "UNDER_REVIEW", label: "Under Review", badgeColor: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  { value: "APPROVED", label: "Approved", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
];

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "All Categories" },
  { value: "SaaS & AI Infrastructure", label: "SaaS & AI Infrastructure" },
  { value: "Web Architecture & Next.js", label: "Web Architecture & Next.js" },
  { value: "Brand Identity & Digital Product", label: "Brand Identity & Digital Product" },
];

export default function ActiveProjectsView({
  projects,
  clients = [],
  onUpdateProjects,
  showToast,
}: ActiveProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [updatingMilestoneId, setUpdatingMilestoneId] = useState<string | null>(null);

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    clientName: "",
    organizationId: "",
    year: "2026",
    category: "SaaS & AI Infrastructure",
    overview: "",
    deliverables: "",
    heroImage: "",
    liveDemoUrl: "",
    figmaUrl: "",
  });

  // Edit Milestone Modal State
  const [editingMilestone, setEditingMilestone] = useState<{
    projectId: string;
    milestone: MilestoneItem;
  } | null>(null);
  const [isSavingMilestone, setIsSavingMilestone] = useState(false);
  const [milestoneEditForm, setMilestoneEditForm] = useState({
    title: "",
    description: "",
    deliverables: "",
    approvalNotes: "",
    status: "PLANNED",
  });

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Client Options for Binding
  const clientOptions = [
    { value: "MANUAL", label: "+ Input Nama Klien Bebas" },
    ...clients.map((c) => ({
      value: c.id,
      label: `${c.name} (${c.contactEmail})`,
    })),
  ];

  // Quick milestone status change
  const handleMilestoneStatusChange = async (
    projectId: string,
    milestoneId: string,
    newStatus: string
  ) => {
    setUpdatingMilestoneId(milestoneId);
    try {
      const res = await fetch(`/api/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        showToast("Gagal memperbarui status milestone.");
        return;
      }

      const updatedProjects = projects.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          milestones: proj.milestones?.map((m) =>
            m.id === milestoneId ? { ...m, status: newStatus } : m
          ),
        };
      });

      onUpdateProjects(updatedProjects);
      showToast(`Status sprint diperbarui ke ${newStatus} & tersinkron ke portal klien!`);
    } catch (err) {
      console.error("Error updating milestone:", err);
      showToast("Terjadi kendala saat update milestone.");
    } finally {
      setUpdatingMilestoneId(null);
    }
  };

  // Save detailed milestone deliverables & approval notes
  const handleSaveMilestoneDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;

    setIsSavingMilestone(true);
    try {
      const deliverablesArr = milestoneEditForm.deliverables
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      const res = await fetch(`/api/milestones/${editingMilestone.milestone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: milestoneEditForm.title,
          description: milestoneEditForm.description || null,
          deliverables: deliverablesArr,
          approvalNotes: milestoneEditForm.approvalNotes || null,
          status: milestoneEditForm.status,
        }),
      });

      if (!res.ok) {
        showToast("Gagal memperbarui detail milestone.");
        setIsSavingMilestone(false);
        return;
      }

      const updatedProjects = projects.map((proj) => {
        if (proj.id !== editingMilestone.projectId) return proj;
        return {
          ...proj,
          milestones: proj.milestones?.map((m) =>
            m.id === editingMilestone.milestone.id
              ? {
                  ...m,
                  title: milestoneEditForm.title,
                  description: milestoneEditForm.description || null,
                  deliverables: JSON.stringify(deliverablesArr),
                  approvalNotes: milestoneEditForm.approvalNotes || null,
                  status: milestoneEditForm.status,
                }
              : m
          ),
        };
      });

      onUpdateProjects(updatedProjects);
      setEditingMilestone(null);
      showToast("Sprint milestone & catatan review berhasil disinkronkan ke Portal Klien!");
    } catch {
      showToast("Terjadi kendala jaringan.");
    } finally {
      setIsSavingMilestone(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!projectForm.title.trim() || !projectForm.clientName.trim()) {
      setFormError("Project Title dan Client Name wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const deliverablesArray = projectForm.deliverables
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        title: projectForm.title.trim(),
        clientName: projectForm.clientName.trim(),
        organizationId: projectForm.organizationId || undefined,
        year: projectForm.year,
        category: projectForm.category,
        overview: projectForm.overview || projectForm.title,
        heroImage: projectForm.heroImage || "/images/after_ui.webp",
        deliverables: deliverablesArray,
        metrics: [{ label: "Client Sign-off", value: "Kickoff", desc: "Project initiated" }],
        liveDemoUrl: projectForm.liveDemoUrl || undefined,
        figmaUrl: projectForm.figmaUrl || undefined,
        featured: false,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal membuat project.");
        setIsSubmitting(false);
        return;
      }

      const newProjItem: ProjectItem = {
        ...data.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliverables: JSON.stringify(deliverablesArray),
        metrics: JSON.stringify([]),
        milestones: [
          {
            id: `ms-${Date.now()}-1`,
            projectId: data.data.id,
            title: "Sprint 01: Product Discovery & Token Architecture",
            order: 1,
            description: "Initial discovery, design tokens, architecture baseline.",
            deliverables: JSON.stringify(["Architecture Doc", "Wireframe Specs"]),
            targetDate: null,
            status: "IN_PROGRESS",
            approvedBy: null,
            approvedAt: null,
            approvalNotes: null,
          },
          {
            id: `ms-${Date.now()}-2`,
            projectId: data.data.id,
            title: "Sprint 02: High-Fidelity UI/UX & Design Tokens",
            order: 2,
            description: "Visual design language, micro-interactions, and component library.",
            deliverables: JSON.stringify(["Figma Component Library", "Design Specs"]),
            targetDate: null,
            status: "PLANNED",
            approvedBy: null,
            approvedAt: null,
            approvalNotes: null,
          },
        ],
      };

      onUpdateProjects([newProjItem, ...projects]);
      setIsNewProjectModalOpen(false);
      setProjectForm({
        title: "",
        clientName: "",
        organizationId: "",
        year: "2026",
        category: "SaaS & AI Infrastructure",
        overview: "",
        deliverables: "",
        heroImage: "",
        liveDemoUrl: "",
        figmaUrl: "",
      });
      showToast("Active Project baru berhasil dibuat & terhubung ke Klien!");
    } catch (err) {
      console.error(err);
      setFormError("Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#f4f5f8] p-6 space-y-4">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#eaecf0] shadow-2xs shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search active client project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#eaecf0] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <AdminCustomDropdown
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            variant="filter"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#a6f30d]" />
          <span>New Active Project</span>
        </button>
      </div>

      {/* Projects List Container */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-5 [scrollbar-width:thin]">
        {filteredProjects.map((project) => {
          const totalMilestones = project.milestones?.length || 0;
          const completedCount =
            project.milestones?.filter((m) => m.status === "APPROVED").length || 0;
          const inProgressCount =
            project.milestones?.filter((m) => m.status === "IN_PROGRESS").length || 0;
          const progressPercentage =
            totalMilestones > 0
              ? Math.round((completedCount / totalMilestones) * 100)
              : 0;

          // Parse deliverables
          let deliverablesList: string[] = [];
          try {
            deliverablesList = JSON.parse(project.deliverables);
          } catch {
            deliverablesList = [];
          }

          return (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-2xs space-y-5 hover:border-black/20 transition-all"
            >
              {/* Project Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-[280px]">
                  {project.heroImage && (
                    <div className="relative w-24 h-16 rounded-2xl overflow-hidden bg-neutral-900 border border-[#eaecf0] shrink-0 shadow-2xs">
                      <Image
                        src={project.heroImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#a6f30d]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                        <Building className="w-3 h-3" />
                        <span>{project.organization?.name || project.clientName}</span>
                      </span>
                      <span className="text-xs font-medium text-neutral-400">
                        {project.year} • {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-['Agrandir']">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
                      {project.overview}
                    </p>
                  </div>
                </div>

                {/* Progress Metric Badge & Client Portal Link */}
                <div className="flex items-center gap-3">
                  <Link
                    href={`/portal?projectId=${project.id}${
                      project.organizationId ? `&orgId=${project.organizationId}` : ""
                    }`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-[#fafbfc] border border-[#eaecf0] hover:border-black/40 hover:bg-white text-xs font-bold text-gray-900 transition-all flex items-center gap-1.5 shadow-2xs group cursor-pointer"
                    title="Buka portal klien untuk proyek ini (Admin Ghost Mode)"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#a6f30d] group-hover:scale-110 transition-transform" />
                    <span>Portal Klien</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-black" />
                  </Link>

                  <div className="text-right space-y-0.5 pl-3 border-l border-[#eaecf0]">
                    <div className="text-2xl font-bold font-['Questrial'] text-gray-900">
                      {progressPercentage}%
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium block">
                      {completedCount} of {totalMilestones} Sprints
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-black transition-all duration-700"
                  style={{ width: `${Math.max(5, progressPercentage)}%` }}
                />
              </div>

              {/* Sprint Milestones Interactive Board */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Sprint Deliverables & Client Milestones</span>
                  <span className="text-[11px] font-normal text-neutral-500 lowercase">
                    (klik status atau ikon edit untuk sinkronisasi ke portal klien)
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {project.milestones && project.milestones.length > 0 ? (
                    project.milestones.map((m, idx) => {
                      return (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-2xl border border-[#eaecf0] bg-[#fafbfc] space-y-2.5 flex flex-col justify-between hover:border-black/20 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-neutral-400">
                                Sprint #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {m.status === "APPROVED" && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMilestone({ projectId: project.id, milestone: m });
                                    let delivText = "";
                                    try {
                                      const parsed = JSON.parse(m.deliverables || "[]");
                                      delivText = Array.isArray(parsed) ? parsed.join(", ") : m.deliverables || "";
                                    } catch {
                                      delivText = m.deliverables || "";
                                    }
                                    setMilestoneEditForm({
                                      title: m.title,
                                      description: m.description || "",
                                      deliverables: delivText,
                                      approvalNotes: m.approvalNotes || "",
                                      status: m.status,
                                    });
                                  }}
                                  className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-white border border-transparent hover:border-[#eaecf0] transition-colors cursor-pointer"
                                  title="Edit Deliverable & Catatan Review"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <h5 className="text-xs font-bold text-gray-900 line-clamp-2">
                              {m.title}
                            </h5>

                            {m.status === "UNDER_REVIEW" && (
                              <span className="inline-block px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[9px] font-bold animate-pulse">
                                Awaiting Client Sign-Off
                              </span>
                            )}
                          </div>

                          {/* Status Dropdown Pill */}
                          <div className="pt-2 border-t border-[#eaecf0]/60 flex items-center justify-between">
                            <AdminCustomDropdown
                              options={MILESTONE_STATUSES}
                              value={m.status}
                              disabled={updatingMilestoneId === m.id}
                              onChange={(newStatus) =>
                                handleMilestoneStatusChange(
                                  project.id,
                                  m.id,
                                  newStatus
                                )
                              }
                              variant="badge"
                              align="left"
                            />

                            {m.approvedBy && (
                              <span
                                className="text-[9px] text-neutral-400 truncate max-w-[80px]"
                                title={`Approved by ${m.approvedBy}`}
                              >
                                ✓ {m.approvedBy.split(" ")[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full p-4 rounded-xl border border-dashed border-[#eaecf0] text-center text-xs text-neutral-400">
                      No milestones recorded for this project yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Deliverables & Live Links */}
              <div className="pt-4 border-t border-[#eaecf0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-neutral-400 mr-1">
                    Deliverables:
                  </span>
                  {deliverablesList.map((d, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#f8f9fa] border border-[#eaecf0] text-neutral-600 font-medium text-[11px]"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-black hover:underline"
                    >
                      <span>Live Preview</span>
                      <ExternalLink className="w-3 h-3 text-[#a6f30d]" />
                    </a>
                  )}
                  {project.figmaUrl && (
                    <a
                      href={project.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black hover:underline"
                    >
                      <span>Figma Specs</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Milestone Details Modal */}
      <AnimatePresence>
        {editingMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#eaecf0] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#eaecf0] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-['Agrandir']">
                    Sprint Milestone & Review Notes
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Data ini akan disinkronkan secara langsung ke Portal Klien
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMilestoneDetails} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Sprint Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={milestoneEditForm.title}
                    onChange={(e) =>
                      setMilestoneEditForm({ ...milestoneEditForm, title: e.target.value })
                    }
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Milestone Status *
                  </label>
                  <AdminCustomDropdown
                    options={MILESTONE_STATUSES}
                    value={milestoneEditForm.status}
                    onChange={(newStatus) =>
                      setMilestoneEditForm({ ...milestoneEditForm, status: newStatus })
                    }
                    variant="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Sprint Scope & Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsi objektif dan deliverable sprint..."
                    value={milestoneEditForm.description}
                    onChange={(e) =>
                      setMilestoneEditForm({
                        ...milestoneEditForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Deliverables & Staging Links (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Figma Prototype, Vercel Staging Deployment"
                    value={milestoneEditForm.deliverables}
                    onChange={(e) =>
                      setMilestoneEditForm({
                        ...milestoneEditForm,
                        deliverables: e.target.value,
                      })
                    }
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Catatan Review untuk Klien (Approval Notes)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Silakan periksa hasil QA staging sebelum memberikan sign-off"
                    value={milestoneEditForm.approvalNotes}
                    onChange={(e) =>
                      setMilestoneEditForm({
                        ...milestoneEditForm,
                        approvalNotes: e.target.value,
                      })
                    }
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-gray-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingMilestone}
                    className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#a6f30d]" />
                    <span>{isSavingMilestone ? "Menyimpan..." : "Simpan & Sinkronkan"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#eaecf0] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#eaecf0] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-['Agrandir']">
                    Kickoff New Active Project
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Hubungkan proyek langsung ke Organisasi Klien agar otomatis muncul di Client Portal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-4 overflow-y-auto">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {formError}
                  </div>
                )}

                {/* Client Organization Binding Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Hubungkan ke Brand Klien Terdaftar *
                  </label>
                  <AdminCustomDropdown
                    options={clientOptions}
                    value={projectForm.organizationId || "MANUAL"}
                    onChange={(val) => {
                      if (val === "MANUAL") {
                        setProjectForm({ ...projectForm, organizationId: "", clientName: "" });
                      } else {
                        const found = clients.find((c) => c.id === val);
                        setProjectForm({
                          ...projectForm,
                          organizationId: val,
                          clientName: found ? found.name : "",
                        });
                      }
                    }}
                    variant="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Client / Brand Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme AI Corp"
                      value={projectForm.clientName}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, clientName: e.target.value })
                      }
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.year}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, year: e.target.value })
                      }
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen Enterprise E-Commerce Platform"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Image Upload Field */}
                <ImageUploadField
                  label="Cover / Preview Visual Proyek"
                  value={projectForm.heroImage}
                  onChange={(url) => setProjectForm({ ...projectForm, heroImage: url })}
                  hint="Upload visual screenshot atau mockup proyek"
                />

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Category *
                  </label>
                  <AdminCustomDropdown
                    options={CATEGORY_OPTIONS.filter((c) => c.value !== "ALL")}
                    value={projectForm.category}
                    onChange={(cat) => setProjectForm({ ...projectForm, category: cat })}
                    variant="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Deliverables (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UI/UX Architecture, Next.js WebGL, Design System"
                    value={projectForm.deliverables}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, deliverables: e.target.value })
                    }
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Live Preview URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://preview.agency.com"
                      value={projectForm.liveDemoUrl}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })
                      }
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Figma Workspace URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://figma.com/@project"
                      value={projectForm.figmaUrl}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, figmaUrl: e.target.value })
                      }
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-gray-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#a6f30d]" />
                    <span>{isSubmitting ? "Menyimpan Proyek..." : "Kickoff Proyek"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
