"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Images,
  Info,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  deleteHeroSlide,
  reorderHeroSlide,
  toggleHeroSlideActive,
  upsertHeroSlide,
} from "@/actions/hero.actions";
import { useLockBodyScroll } from "@/components/common/SmoothScroller";
import type { HeroSlideRow } from "@/types/database.types";

interface HeroSlidesManagerTabProps {
  slides: HeroSlideRow[];
}

export function HeroSlidesManagerTab({ slides }: HeroSlidesManagerTabProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<HeroSlideRow> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useLockBodyScroll(Boolean(editing));

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  const updateSelectedFile = (file: File | null) => {
    setSelectedFile(file);
    setPreviewObjectUrl(file ? URL.createObjectURL(file) : null);
  };

  const activePreviewUrl = previewObjectUrl ?? (editing?.image_url || null);
  const activeCount = slides.filter((s) => s.is_active).length;

  const openNewModal = () => {
    updateSelectedFile(null);
    setFeedback(null);
    setEditing({
      id: "",
      title: "",
      category: "HIMATIKA",
      image_url: "",
      order_index: slides.length + 1,
      is_active: true,
    });
  };

  const openEditModal = (slide: HeroSlideRow) => {
    updateSelectedFile(null);
    setFeedback(null);
    setEditing(slide);
  };

  const closeModal = () => {
    updateSelectedFile(null);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("id", editing.id ?? "");
    const activeCheckbox = form.elements.namedItem(
      "is_active"
    ) as HTMLInputElement | null;
    formData.set("is_active", String(Boolean(activeCheckbox?.checked)));

    if (selectedFile) {
      formData.set("image_file", selectedFile);
    } else {
      formData.delete("image_file");
    }

    setSubmitting(true);
    setFeedback(null);
    const res = await upsertHeroSlide(formData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      closeModal();
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const handleToggleActive = async (slide: HeroSlideRow) => {
    setBusyId(slide.id);
    setFeedback(null);
    const res = await toggleHeroSlideActive(slide.id, !slide.is_active);
    setBusyId(null);

    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const handleReorder = async (slide: HeroSlideRow, direction: "up" | "down") => {
    setBusyId(slide.id);
    setFeedback(null);
    const res = await reorderHeroSlide(slide.id, direction);
    setBusyId(null);

    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const handleDelete = async (slide: HeroSlideRow) => {
    if (
      !window.confirm(
        `Hapus slide "${slide.title}"? Foto unggahan di penyimpanan juga akan dibersihkan.`
      )
    ) {
      return;
    }

    setBusyId(slide.id);
    setFeedback(null);
    const res = await deleteHeroSlide(slide.id);
    setBusyId(null);

    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 bg-surface border border-hairline flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-blue-400 uppercase tracking-wider">
            <Images className="w-3.5 h-3.5" />
            <span>SLIDER LATAR BERANDA • {activeCount} AKTIF</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-main">
            SLIDER LATAR BERANDA
          </h2>
          <p className="font-sans text-xs sm:text-sm text-secondary max-w-2xl">
            Foto tampil penuh berwarna (full-color) sebagai latar belakang utama di halaman beranda dan berganti otomatis setiap 5,5 detik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main transition-colors"
          >
            <span>LIHAT BERANDA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>TAMBAH SLIDE</span>
          </button>
        </div>
      </div>

      {/* Fallback Notice when zero slides are active */}
      {activeCount === 0 && (
        <div className="p-4 border border-blue-500/40 bg-blue-500/10 flex items-start gap-3 font-sans text-xs sm:text-sm text-blue-200">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p>
            Saat ini belum ada slide berstatus <strong>AKTIF</strong>. Halaman beranda otomatis menampilkan 4 slide bawaan HIMATIKA sampai ada minimal 1 slide yang diaktifkan.
          </p>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 border flex items-center justify-between gap-3 font-mono text-xs ${
            feedback.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Tutup notifikasi"
            className="p-1 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Slide Card Grid */}
      {slides.length === 0 ? (
        <div className="p-10 border border-hairline bg-surface text-center space-y-2">
          <p className="font-mono text-xs text-secondary uppercase">
            BELUM ADA SLIDE TERSIMPAN
          </p>
          <p className="font-sans text-xs text-muted">
            Klik tombol &quot;+ TAMBAH SLIDE&quot; untuk menambahkan foto latar beranda baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slides.map((slide, index) => {
            const isBusy = busyId === slide.id;
            const orderBadge = `#${String(index + 1).padStart(2, "0")}`;

            return (
              <div
                key={slide.id}
                className={`border border-hairline bg-surface flex flex-col justify-between transition-colors ${
                  slide.is_active ? "" : "opacity-75"
                }`}
              >
                {/* 16:9 Preview */}
                <div className="relative aspect-video w-full bg-black border-b border-hairline overflow-hidden">
                  <Image
                    src={slide.image_url}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                    className="object-cover object-center"
                  />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="px-2 py-1 border border-white/20 bg-black/75 text-white tracking-wider">
                      {orderBadge} • URUTAN {slide.order_index}
                    </span>
                    <span
                      className={`px-2 py-1 border tracking-wider ${
                        slide.is_active
                          ? "border-emerald-400/50 bg-emerald-950/85 text-emerald-300"
                          : "border-zinc-500/40 bg-zinc-900/85 text-zinc-300"
                      }`}
                    >
                      {slide.is_active ? "AKTIF" : "NONAKTIF"}
                    </span>
                  </div>
                </div>

                {/* Details + Actions */}
                <div className="p-4 flex flex-col gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] text-blue-400 uppercase tracking-wider block">
                      {slide.category}
                    </span>
                    <h3 className="font-display text-xl uppercase tracking-tight text-main leading-tight">
                      {slide.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-hairline font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isBusy || index === 0}
                        onClick={() => handleReorder(slide, "up")}
                        aria-label={`Naikkan urutan ${slide.title}`}
                        title="Naikkan urutan"
                        className="p-2 border border-hairline bg-canvas text-secondary hover:text-main hover:border-blue-500/50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || index === slides.length - 1}
                        onClick={() => handleReorder(slide, "down")}
                        aria-label={`Turunkan urutan ${slide.title}`}
                        title="Turunkan urutan"
                        className="p-2 border border-hairline bg-canvas text-secondary hover:text-main hover:border-blue-500/50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggleActive(slide)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-2 border transition-colors cursor-pointer disabled:opacity-50 ${
                          slide.is_active
                            ? "border-hairline bg-canvas text-secondary hover:border-amber-500/50 hover:text-amber-300"
                            : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : slide.is_active ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                        <span>{slide.is_active ? "NONAKTIFKAN" : "AKTIFKAN"}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => openEditModal(slide)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-hairline bg-canvas text-main hover:border-blue-500/60 hover:text-blue-400 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>EDIT</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(slide)}
                        aria-label={`Hapus ${slide.title}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>HAPUS</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Slide Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain bg-surface border border-hairline p-6 space-y-5"
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-hairline">
              <div>
                <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider block">
                  {editing.id ? "PERBARUI SLIDE BERANDA" : "SLIDE BERANDA BARU"}
                </span>
                <h3 className="font-display text-2xl uppercase tracking-tight text-main">
                  {editing.id ? editing.title || "EDIT SLIDE" : "TAMBAH SLIDE HERO"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Tutup modal"
                className="p-2 border border-hairline bg-canvas text-secondary hover:text-main cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedback?.type === "error" && (
              <div className="p-3 border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-300">
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Upload + Live 16:9 Preview */}
              <div className="space-y-2.5 border border-hairline bg-canvas/50 p-3.5">
                <label className="font-mono text-[11px] text-secondary block uppercase">
                  FOTO LATAR SLIDE {editing.id ? "(OPSIONAL GANTI)" : "(WAJIB)"}
                </label>

                {activePreviewUrl ? (
                  <div className="relative aspect-video w-full border border-hairline bg-black overflow-hidden">
                    <Image
                      src={activePreviewUrl}
                      alt="Preview slide hero"
                      fill
                      sizes="(max-width: 640px) 100vw, 560px"
                      unoptimized
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full border border-hairline bg-canvas flex items-center justify-center font-mono text-xs text-muted">
                    BELUM ADA FOTO DIPILIH
                  </div>
                )}

                <label className="flex items-center gap-3 p-3 border border-dashed border-hairline bg-canvas cursor-pointer hover:border-blue-500/60 transition-colors">
                  <Upload className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-mono text-[11px] text-secondary truncate">
                    {selectedFile
                      ? `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`
                      : activePreviewUrl
                        ? "GANTI FOTO SLIDE (JPG / PNG / WEBP • MAKS 5 MB)"
                        : "UNGGAH FOTO SLIDE (JPG / PNG / WEBP • MAKS 5 MB)"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      updateSelectedFile(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="hero-slide-title"
                  className="font-mono text-[11px] text-secondary block uppercase"
                >
                  JUDUL SLIDE (TAMPIL DI POJOK KANAN ATAS HERO)
                </label>
                <input
                  id="hero-slide-title"
                  name="title"
                  required
                  minLength={2}
                  maxLength={100}
                  defaultValue={editing.title ?? ""}
                  placeholder="Contoh: T-CAMP SOLIDARITAS"
                  className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3 py-2.5 font-mono text-xs text-main outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="hero-slide-category"
                    className="font-mono text-[11px] text-secondary block uppercase"
                  >
                    KATEGORI / DIVISI
                  </label>
                  <input
                    id="hero-slide-category"
                    name="category"
                    required
                    minLength={2}
                    maxLength={40}
                    defaultValue={editing.category ?? "HIMATIKA"}
                    placeholder="Contoh: BPSDM, HUMAS, MEDKRAF"
                    className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3 py-2.5 font-mono text-xs text-main outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="hero-slide-order"
                    className="font-mono text-[11px] text-secondary block uppercase"
                  >
                    URUTAN TAMPIL
                  </label>
                  <input
                    id="hero-slide-order"
                    name="order_index"
                    type="number"
                    required
                    min={0}
                    max={999}
                    defaultValue={editing.order_index ?? slides.length + 1}
                    className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3 py-2.5 font-mono text-xs text-main outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 border border-hairline bg-canvas cursor-pointer">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={editing.is_active ?? true}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="font-mono text-xs text-main">
                  Tampilkan di slider beranda
                </span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline font-mono text-xs">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2.5 border border-hairline bg-canvas text-secondary hover:text-main cursor-pointer disabled:opacity-50"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? "MENYIMPAN..." : "SIMPAN SLIDE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
