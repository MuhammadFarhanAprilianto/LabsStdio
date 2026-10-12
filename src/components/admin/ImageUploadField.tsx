"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Image as ImageIcon, Check } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  aspectRatio?: "video" | "square" | "wide";
  hint?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  required = false,
  aspectRatio = "video",
  hint = "PNG, JPG, WebP hingga 5MB",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengupload gambar");
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupload gambar";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[21/9]";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-red-500 hover:text-red-700 font-semibold cursor-pointer"
          >
            Hapus Gambar
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {value ? (
        /* Preview Mode */
        <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-[#eaecf0] bg-neutral-900 group shadow-2xs`}>
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-md hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Ganti Gambar</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer"
              title="Hapus"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Gambar Tersimpan</span>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Box */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full ${aspectClass} max-h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer ${
            dragOver
              ? "border-[#a6f30d] bg-[#a6f30d]/5"
              : "border-[#eaecf0] bg-[#fafbfc] hover:border-black/30 hover:bg-[#f4f5f8]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-black animate-spin" />
              <span className="text-xs font-semibold text-gray-700">Mengupload gambar ke server...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#eaecf0] shadow-2xs flex items-center justify-center text-neutral-500 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5 text-gray-700" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-900">
                  Klik untuk upload <span className="font-normal text-neutral-400">atau drag & drop</span>
                </p>
                <p className="text-[10px] text-neutral-400">{hint}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
