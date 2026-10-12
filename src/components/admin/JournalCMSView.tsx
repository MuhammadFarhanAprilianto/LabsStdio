"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  Search,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { PostItem } from "./AdminCRMView";
import { AdminCustomDropdown } from "./AdminCustomDropdown";
import { ImageUploadField } from "./ImageUploadField";

interface JournalCMSViewProps {
  posts: PostItem[];
  onUpdatePosts: (updated: PostItem[]) => void;
  showToast: (msg: string) => void;
}

const TOPIC_OPTIONS = [
  { value: "ALL", label: "All Topics" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Web Development", label: "Web Development" },
  { value: "SaaS", label: "SaaS & Infrastructure" },
  { value: "Website Design", label: "Website Design" },
];

const POST_STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Published", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  { value: "DRAFT", label: "Draft", badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-200", dot: "bg-neutral-400" },
];

export default function JournalCMSView({
  posts,
  onUpdatePosts,
  showToast,
}: JournalCMSViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "UI/UX Design",
    readTime: "5 min read",
    authorName: "",
    authorRole: "",
    status: "PUBLISHED",
  });

  const filteredPosts = posts.filter((p) => {
    let cats: string[] = [];
    try {
      cats = JSON.parse(p.categories);
    } catch {
      cats = [];
    }

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || cats.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleToggleStatus = async (postId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        showToast("Gagal memperbarui status artikel.");
        return;
      }

      onUpdatePosts(
        posts.map((p) => (p.id === postId ? { ...p, status: nextStatus } : p))
      );
      showToast(
        nextStatus === "PUBLISHED"
          ? "Artikel telah Diterbitkan (Published)!"
          : "Artikel diubah menjadi Draft."
      );
    } catch {
      showToast("Terjadi kendala jaringan.");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Hapus artikel ini secara permanen dari Journal?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        showToast("Gagal menghapus artikel.");
        return;
      }

      onUpdatePosts(posts.filter((p) => p.id !== postId));
      showToast("Artikel berhasil dihapus.");
    } catch {
      showToast("Terjadi kendala jaringan saat menghapus.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.excerpt.trim()) {
      setFormError("Title dan Excerpt artikel wajib diisi.");
      return;
    }

    if (!form.image) {
      setFormError("Silakan upload gambar Cover Artikel terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content || form.excerpt,
        image: form.image || "/images/BestDesign.webp",
        categories: [form.category],
        readTime: form.readTime || "5 min read",
        authorName: form.authorName || "Labs Stdio",
        authorRole: form.authorRole || "Product Studio Team",
        status: form.status,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Gagal menyimpan artikel.");
        setIsSubmitting(false);
        return;
      }

      const newPostItem: PostItem = {
        ...data.data,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categories: JSON.stringify([form.category]),
      };

      onUpdatePosts([newPostItem, ...posts]);
      setIsNewModalOpen(false);
      setForm({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        category: "UI/UX Design",
        readTime: "5 min read",
        authorName: "",
        authorRole: "",
        status: "PUBLISHED",
      });
      showToast("Artikel baru berhasil dipublikasikan ke Journal CMS!");
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
              placeholder="Search journal articles & insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f9fa] border border-[#eaecf0] rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <AdminCustomDropdown
            options={TOPIC_OPTIONS}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            variant="filter"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#a6f30d]" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Articles Table & List */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border border-[#eaecf0] bg-white shadow-2xs overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="sticky top-0 z-10 bg-[#f8f9fa] border-b border-[#eaecf0] text-neutral-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-5">Article Title</th>
              <th className="py-3 px-4">Topics</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Read Time</th>
              <th className="py-3 px-4 text-center">Views</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0] text-gray-700">
            {filteredPosts.map((post) => {
              let categoriesList: string[] = [];
              try {
                categoriesList = JSON.parse(post.categories);
              } catch {
                categoriesList = [];
              }

              return (
                <tr key={post.id} className="hover:bg-[#fafbfc] transition-colors">
                  {/* Article Title & Cover Preview */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 relative overflow-hidden shrink-0">
                        <Image
                          src={post.image || "/images/BestDesign.webp"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 line-clamp-1 text-xs">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Categories */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {categoriesList.map((cat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-semibold"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 text-xs">{post.authorName}</div>
                    <div className="text-[10px] text-neutral-400">{post.authorRole}</div>
                  </td>

                  {/* Read Time */}
                  <td className="py-4 px-4 text-neutral-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{post.readTime}</span>
                    </div>
                  </td>

                  {/* Views */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 font-mono font-bold text-gray-800">
                      <Eye className="w-3 h-3 text-neutral-400" />
                      <span>{post.viewCount.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Status Dropdown Pill */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <AdminCustomDropdown
                      options={POST_STATUS_OPTIONS}
                      value={post.status}
                      onChange={(newStatus) => handleToggleStatus(post.id, post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT")}
                      variant="badge"
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400">
                  Tidak ada artikel yang sesuai dengan kriteria pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Write New Article Modal */}
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
                    Write New Journal Article
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Buat publikasi pemikiran atau wawasan industri baru untuk agensi.
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
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js 16 & Turbopack: Building Ultra-Fast Web Applications"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Article Cover Image Upload */}
                <ImageUploadField
                  label="Cover Artikel / Thumbnail"
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                  required
                  hint="Upload banner thumbnail artikel (PNG, JPG, WebP)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Category Topic *
                    </label>
                    <AdminCustomDropdown
                      options={TOPIC_OPTIONS.filter((t) => t.value !== "ALL")}
                      value={form.category}
                      onChange={(val) => setForm({ ...form, category: val })}
                      variant="input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 min read"
                      value={form.readTime}
                      onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Author Role
                    </label>
                    <input
                      type="text"
                      value={form.authorRole}
                      onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                      className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Excerpt / Ringkasan Singkat *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ringkasan 1-2 kalimat untuk preview pembaca..."
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Full Content (Markdown / Text)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tulis artikel lengkap di sini..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full bg-[#fafbfc] border border-[#eaecf0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
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
                    {isSubmitting ? "Publishing..." : "Publish Article"}
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
