"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Mail,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  ChevronDown,
  Eye,
} from "lucide-react";
import { ClientOrgItem } from "./AdminCRMView";
import { AdminCustomDropdown } from "./AdminCustomDropdown";
import { ImageUploadField } from "./ImageUploadField";

interface ClientDirectoryViewProps {
  clients: ClientOrgItem[];
  onUpdateClients: (updated: ClientOrgItem[]) => void;
  showToast: (msg: string) => void;
}

const CLIENT_STATUSES = [
  { value: "ACTIVE", label: "Active Partner", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  { value: "ONBOARDING", label: "Onboarding", badgeColor: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  { value: "PAUSED", label: "Paused", badgeColor: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  { value: "COMPLETED", label: "Completed", badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-200", dot: "bg-neutral-400" },
];

const FILTER_STATUS_OPTIONS = [
  { value: "ALL", label: "All Statuses" },
  ...CLIENT_STATUSES,
];

export default function ClientDirectoryView({
  clients,
  onUpdateClients,
  showToast,
}: ClientDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    industry: "",
    contactName: "",
    contactEmail: "",
    website: "",
    avatarUrl: "",
    status: "ACTIVE",
  });

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contactName && c.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        showToast("Gagal memperbarui status klien.");
        return;
      }

      onUpdateClients(
        clients.map((c) => (c.id === clientId ? { ...c, status: newStatus } : c))
      );
      showToast(`Status klien diubah menjadi ${newStatus}!`);
    } catch {
      showToast("Terjadi kendala jaringan.");
    }
  };

  const handleDelete = async (clientId: string) => {
    if (!confirm("Hapus klien ini dari direktori agensi?")) return;

    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("Gagal menghapus klien.");
        return;
      }

      onUpdateClients(clients.filter((c) => c.id !== clientId));
      showToast("Klien berhasil dihapus dari direktori.");
    } catch {
      showToast("Terjadi kendala jaringan saat menghapus.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.contactEmail.trim()) {
      setFormError("Nama perusahaan dan email kontak wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        industry: form.industry || undefined,
        contactName: form.contactName.trim() || undefined,
        contactEmail: form.contactEmail.trim().toLowerCase(),
        website: form.website.trim() || undefined,
        avatarUrl: form.avatarUrl || undefined,
        status: form.status,
      };

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal mendaftarkan klien.");
        setIsSubmitting(false);
        return;
      }

      const newClientItem: ClientOrgItem = {
        ...data.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projects: [],
        inquiries: [],
      };

      onUpdateClients([newClientItem, ...clients]);
      setIsNewModalOpen(false);
      setForm({
        name: "",
        industry: "",
        contactName: "",
        contactEmail: "",
        website: "",
        avatarUrl: "",
        status: "ACTIVE",
      });
      showToast("Klien baru berhasil ditambahkan ke direktori agensi!");
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
              placeholder="Search client brand or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#eaecf0] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <AdminCustomDropdown
            options={FILTER_STATUS_OPTIONS}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            variant="filter"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#a6f30d]" />
          <span>Add Client Brand</span>
        </button>
      </div>

      {/* Client Directory Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const statusCfg =
              CLIENT_STATUSES.find((s) => s.value === client.status) || CLIENT_STATUSES[0];

            return (
              <div
                key={client.id}
                className="p-6 rounded-3xl bg-white border border-[#eaecf0] shadow-2xs hover:shadow-md hover:border-black/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Brand Logo & Status Selector */}
                  <div className="flex items-start justify-between gap-3">
                    {client.avatarUrl ? (
                      <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-neutral-900 border border-[#eaecf0] shadow-2xs shrink-0">
                        <Image
                          src={client.avatarUrl}
                          alt={client.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-black text-[#a6f30d] font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                        {client.name.charAt(0)}
                      </div>
                    )}

                    <AdminCustomDropdown
                      options={CLIENT_STATUSES}
                      value={client.status}
                      onChange={(newStatus) => handleStatusChange(client.id, newStatus)}
                      variant="badge"
                      align="right"
                    />
                  </div>

                  {/* Brand Title & Industry */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1 font-['Agrandir']">
                      {client.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                      {client.industry || "Enterprise Brand"}
                    </p>
                  </div>

                  {/* Contact Info Card */}
                  <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#eaecf0] space-y-1.5 text-xs">
                    {client.contactName && (
                      <div className="font-semibold text-gray-900 text-xs">
                        {client.contactName}
                      </div>
                    )}
                    <a
                      href={`mailto:${client.contactEmail}`}
                      className="text-neutral-500 hover:text-black flex items-center gap-1.5 truncate text-[11px]"
                    >
                      <Mail className="w-3 h-3 shrink-0 text-neutral-400" />
                      <span className="truncate">{client.contactEmail}</span>
                    </a>
                  </div>

                  {/* Project Metrics */}
                  <div className="flex items-center justify-between text-xs pt-1 text-neutral-500">
                    <span>
                      <strong>{client.projects?.length || 0}</strong> Active Projects
                    </span>
                    <span>
                      <strong>{client.inquiries?.length || 0}</strong> Proposals
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#eaecf0] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <Link
                      href={`/portal?orgId=${client.id}`}
                      target="_blank"
                      className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f8f9fa] hover:bg-neutral-100 transition-colors"
                      title="Buka portal klien untuk organisasi ini"
                    >
                      <Eye className="w-3 h-3 text-[#a6f30d]" />
                      <span>Portal Klien</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(client.id)}
                    className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center text-neutral-400 bg-white rounded-3xl border border-[#eaecf0]">
            Tidak ada klien yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>

      {/* Add Client Brand Modal */}
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
                    Register Client Brand
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Tambahkan profil perusahaan klien baru ke direktori studio.
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

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blanqs AI Platform"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fintech, AI Platform, E-Commerce Luxury"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Brand Logo Upload */}
                <ImageUploadField
                  label="Logo Brand Klien / Avatar"
                  value={form.avatarUrl}
                  onChange={(url) => setForm({ ...form, avatarUrl: url })}
                  aspectRatio="square"
                  hint="Upload icon atau logo brand (PNG, JPG, SVG, WebP)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Lin (VP Product)"
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@company.com"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://company.com"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Partnership Status
                    </label>
                    <AdminCustomDropdown
                      options={CLIENT_STATUSES}
                      value={form.status}
                      onChange={(val) => setForm({ ...form, status: val })}
                      variant="input"
                    />
                  </div>
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
                    {isSubmitting ? "Registering..." : "Add Client Brand"}
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
