"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Star,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  Eye,
  X,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
} from "lucide-react";
import { ProjectItem } from "./AdminCRMView";
import { AdminCustomDropdown } from "./AdminCustomDropdown";
import { ImageUploadField } from "./ImageUploadField";

interface PortfolioCMSViewProps {
  projects: ProjectItem[];
  onUpdateProjects: (updated: ProjectItem[]) => void;
  showToast: (msg: string) => void;
}

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "All Categories" },
  { value: "SaaS & AI Infrastructure", label: "SaaS & AI Infrastructure" },
  { value: "Web Architecture & Next.js", label: "Web Architecture & Next.js" },
  { value: "Brand Identity & Digital Product", label: "Brand Identity & Digital Product" },
];

export default function PortfolioCMSView({
  projects,
  onUpdateProjects,
  showToast,
}: PortfolioCMSViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    clientName: "",
    year: "2026",
    category: "SaaS & AI Infrastructure",
    overview: "",
    challenge: "",
    solution: "",
    heroImage: "",
    deliverables: "",
    metricsLabel: "",
    metricsValue: "",
    metricsDesc: "",
    liveDemoUrl: "",
    figmaUrl: "",
    featured: true,
  });

  const filteredProjects = projects.filter(
    (p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  const handleToggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!res.ok) {
        showToast("Gagal memperbarui status featured.");
        return;
      }

      const updated = projects.map((p) =>
        p.id === projectId ? { ...p, featured: !currentFeatured } : p
      );
      onUpdateProjects(updated);
      showToast(
        !currentFeatured
          ? "Case study ditandai sebagai Featured di Homepage!"
          : "Status featured dicabut."
      );
    } catch {
      showToast("Terjadi kendala jaringan.");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus case study ini dari portofolio?")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("Gagal menghapus case study.");
        return;
      }

      onUpdateProjects(projects.filter((p) => p.id !== projectId));
      showToast("Case study berhasil dihapus.");
    } catch {
      showToast("Terjadi kendala jaringan saat menghapus.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.clientName.trim()) {
      setFormError("Title dan Client Name wajib diisi.");
      return;
    }

    if (!form.heroImage) {
      setFormError("Silakan upload gambar Hero Showcase terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const deliverablesArr = form.deliverables
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      const metricsArr = [
        {
          label: form.metricsLabel || "Performance Surge",
          value: form.metricsValue || "+200%",
          desc: form.metricsDesc || "Post-launch metric",
        },
      ];

      const payload = {
        title: form.title.trim(),
        clientName: form.clientName.trim(),
        year: form.year,
        category: form.category,
        overview: form.overview || form.title,
        challenge: form.challenge,
        solution: form.solution,
        heroImage: form.heroImage || "/images/after_ui.webp",
        deliverables: deliverablesArr,
        metrics: metricsArr,
        liveDemoUrl: form.liveDemoUrl || undefined,
        figmaUrl: form.figmaUrl || undefined,
        featured: form.featured,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan case study.");
        setIsSubmitting(false);
        return;
      }

      const createdItem: ProjectItem = {
        ...data.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deliverables: JSON.stringify(deliverablesArr),
        metrics: JSON.stringify(metricsArr),
      };

      onUpdateProjects([createdItem, ...projects]);
      setIsNewModalOpen(false);
      setForm({
        title: "",
        clientName: "",
        year: "2026",
        category: "SaaS & AI Infrastructure",
        overview: "",
        challenge: "",
        solution: "",
        heroImage: "",
        deliverables: "",
        metricsLabel: "",
        metricsValue: "",
        metricsDesc: "",
        liveDemoUrl: "",
        figmaUrl: "",
        featured: true,
      });
      showToast("Case study baru berhasil dipublikasikan ke Portofolio CMS!");
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
              placeholder="Search case studies & work..."
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

          <div className="flex items-center gap-1 p-1 bg-[#f8f9fa] border border-[#eaecf0] rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white shadow-2xs text-gray-900 font-bold" : "text-neutral-400 hover:text-gray-900"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-white shadow-2xs text-gray-900 font-bold" : "text-neutral-400 hover:text-gray-900"
              }`}
              title="Table view"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#a6f30d]" />
          <span>New Case Study</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin]">
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => {
              let deliverables: string[] = [];
              try {
                deliverables = JSON.parse(project.deliverables);
              } catch {
                deliverables = [];
              }

              return (
                <div
                  key={project.id}
                  className="rounded-3xl bg-white border border-[#eaecf0] overflow-hidden shadow-2xs hover:shadow-md hover:border-black/20 transition-all flex flex-col group"
                >
                  {/* Hero Cover Image Preview */}
                  <div className="relative h-44 bg-neutral-900 overflow-hidden">
                    <Image
                      src={project.heroImage || "/images/after_ui.webp"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Featured Star Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project.id, project.featured)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                        project.featured
                          ? "bg-[#a6f30d] text-black shadow-md"
                          : "bg-black/40 text-white/60 hover:text-white"
                      }`}
                      title={project.featured ? "Featured on Home" : "Set as Featured"}
                    >
                      <Star className={`w-3.5 h-3.5 ${project.featured ? "fill-black" : ""}`} />
                    </button>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-bold text-[#d4f938] uppercase tracking-wider block">
                        {project.clientName}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                        {project.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {project.overview}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {deliverables.slice(0, 3).map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-medium"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {project.liveDemoUrl && (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-500 hover:text-black font-semibold flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete case study"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-2xl border border-[#eaecf0] bg-white shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-[#f8f9fa] border-b border-[#eaecf0] text-neutral-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Title / Client</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaecf0] text-gray-700">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{proj.title}</div>
                      <div className="text-[11px] text-neutral-400">{proj.clientName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600">{proj.category}</td>
                    <td className="py-3.5 px-4">{proj.year}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(proj.id, proj.featured)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          proj.featured ? "text-amber-500 bg-amber-50" : "text-neutral-300 hover:text-neutral-500"
                        }`}
                      >
                        <Star className={`w-4 h-4 ${proj.featured ? "fill-amber-500" : ""}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(proj.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center text-neutral-400 bg-white rounded-3xl border border-[#eaecf0]">
            Tidak ada case study yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>

      {/* New Case Study Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white rounded-3xl border border-[#eaecf0] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="px-6 py-5 border-b border-[#eaecf0] bg-[#fafbfc] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-['Agrandir']">
                    Add New Showcase Case Study
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Publikasikan hasil karya atau studi kasus baru ke website portofolio Labs Stdio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Client / Brand *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Blanqs AI Platform"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Year *</label>
                    <input
                      type="text"
                      required
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Case Study Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reimagining Venture-Grade Analytics for 100K+ Users"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Hero Showcase Cover Upload */}
                <ImageUploadField
                  label="Hero Showcase Cover"
                  value={form.heroImage}
                  onChange={(url) => setForm({ ...form, heroImage: url })}
                  required
                  hint="Upload visual utama showcase portofolio (PNG, JPG, WebP)"
                />

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Category *</label>
                  <AdminCustomDropdown
                    options={CATEGORY_OPTIONS.filter((c) => c.value !== "ALL")}
                    value={form.category}
                    onChange={(cat) => setForm({ ...form, category: cat })}
                    variant="input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Project Overview / Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan objektif dan dampak proyek..."
                    value={form.overview}
                    onChange={(e) => setForm({ ...form, overview: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Deliverables (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Product UI/UX Architecture, Next.js WebGL, Design System"
                    value={form.deliverables}
                    onChange={(e) => setForm({ ...form, deliverables: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Live Production URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={form.liveDemoUrl}
                      onChange={(e) => setForm({ ...form, liveDemoUrl: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Figma Specs URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://figma.com/@project"
                      value={form.figmaUrl}
                      onChange={(e) => setForm({ ...form, figmaUrl: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-[#eaecf0] text-black focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="featured-check" className="text-xs font-semibold text-gray-800 cursor-pointer">
                    Tampilkan sebagai Featured Showcase di Homepage
                  </label>
                </div>

                <div className="pt-4 border-t border-[#eaecf0] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#eaecf0] text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Case Study"}
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
