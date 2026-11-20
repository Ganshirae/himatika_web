"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Loader2,
  ExternalLink,
  Upload,
} from "lucide-react";
import {
  deleteWorkProgram,
  updateProkerStatus,
  upsertWorkProgram,
} from "@/actions/proker.actions";
import { useLockBodyScroll } from "@/components/common/SmoothScroller";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { ProkerStatus, WorkProgramRow } from "@/types/database.types";

interface ProkerManagerTabProps {
  prokers: WorkProgramRow[];
  canEditProker: boolean;
}

const DIVISION_OPTIONS = [
  { value: "KOLABORASI", label: "KOLABORASI SEMUA DIVISI" },
  { value: "PRESIDIUM", label: "PRESIDIUM UTAMA" },
  { value: "BPH_SEK", label: "SEKRETARIS" },
  { value: "BPH_BEN", label: "BENDAHARA" },
  { value: "BPSDM", label: "BPSDM" },
  { value: "HUMAS", label: "HUBUNGAN MASYARAKAT" },
  { value: "RISET", label: "RISET & KEILMUAN" },
  { value: "PMB", label: "MINAT & BAKAT" },
  { value: "SARLOG", label: "SARANA & LOGISTIK" },
  { value: "MEDKRAF", label: "MEDIA KREATIF" },
];

const QUICK_STATUS_OPTIONS = [
  { value: "upcoming", label: "UPCOMING" },
  { value: "ongoing", label: "ONGOING" },
  { value: "completed", label: "COMPLETED" },
];

const MODAL_STATUS_OPTIONS = [
  { value: "upcoming", label: "UPCOMING (AKAN DATANG)" },
  { value: "ongoing", label: "ONGOING (BERJALAN)" },
  { value: "completed", label: "COMPLETED (SELESAI)" },
];

export function ProkerManagerTab({
  prokers,
  canEditProker,
}: ProkerManagerTabProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<WorkProgramRow> | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverObjectUrl, setCoverObjectUrl] = useState<string | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [galleryDraft, setGalleryDraft] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useLockBodyScroll(Boolean(editing));

  React.useEffect(() => {
    return () => {
      if (coverObjectUrl) {
        URL.revokeObjectURL(coverObjectUrl);
      }
    };
  }, [coverObjectUrl]);

  const updateSelectedCoverFile = (file: File | null) => {
    setCoverFile(file);
    setCoverObjectUrl(file ? URL.createObjectURL(file) : null);
    if (file) {
      setCoverRemoved(false);
    }
  };

  const activeCoverPreview =
    coverObjectUrl ??
    (coverRemoved ? null : editing?.cover_image_url || null);

  const openEditModal = (proker: WorkProgramRow) => {
    updateSelectedCoverFile(null);
    setCoverRemoved(false);
    setNewGalleryFiles([]);
    setGalleryDraft(proker.gallery_images ?? []);
    setEditing(proker);
  };

  const openNewModal = () => {
    updateSelectedCoverFile(null);
    setCoverRemoved(false);
    setNewGalleryFiles([]);
    setGalleryDraft([]);
    setEditing({
      id: "",
      highlight_number: String(prokers.length + 1).padStart(2, "0"),
      title: "",
      slug: "",
      division_code: "MEDKRAF",
      status: "upcoming",
      execution_label: "DESEMBER 2026",
      location: "Universitas Trilogi",
      target_audience: "Mahasiswa Teknik Informatika",
      short_desc: "",
      full_content: "",
      objectives: [],
      rundown: [],
      gallery_images: [],
      cover_image_url: null,
      registration_link: "",
      contact_person: null,
      is_featured: false,
      is_white_background: false,
    });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    if (coverFile) {
      formData.set("cover_file", coverFile);
    }
    formData.set("remove_cover", String(coverRemoved && !coverFile));
    formData.set("existing_gallery_json", JSON.stringify(galleryDraft));
    for (const file of newGalleryFiles) {
      formData.append("gallery_files", file);
    }

    const res = await upsertWorkProgram(formData);
    setSubmitting(false);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });

    if (res.success) {
      setEditing(null);
      updateSelectedCoverFile(null);
      setCoverRemoved(false);
      setNewGalleryFiles([]);
      setGalleryDraft([]);
      router.refresh();
    }
  };

  const handleStatusChange = async (id: string, status: ProkerStatus) => {
    setFeedback(null);
    const res = await updateProkerStatus(id, status);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) router.refresh();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus program kerja "${title}"?`)) return;
    const res = await deleteWorkProgram(id);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });
    if (res.success) router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <h2 className="font-display text-2xl uppercase text-main">
            MANAJEMEN PROGRAM KERJA (/PROKER)
          </h2>
          <p className="font-sans text-xs text-secondary mt-1">
            Setiap perubahan akan langsung disinkronkan ke halaman publik katalog proker dan beranda.
          </p>
        </div>

        {canEditProker && (
          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>TAMBAH PROKER</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 border font-mono text-xs ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prokers.map((proker) => (
          <div
            key={proker.id}
            className="p-5 bg-surface border border-hairline flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                <span className="text-blue-400 font-semibold">
                  {proker.highlight_number || "--"} • {proker.division_name || proker.division_code}
                </span>
                {proker.is_featured && (
                  <span className="px-2 py-0.5 border border-blue-500/40 bg-blue-500/10 text-blue-300">
                    UNGGULAN
                  </span>
                )}
              </div>

              <h3 className="font-display text-xl uppercase text-main leading-snug">
                {proker.title}
              </h3>

              <p className="font-sans text-xs text-secondary line-clamp-2">
                {proker.short_desc}
              </p>
            </div>

            <div className="pt-3 border-t border-hairline/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CustomSelect
                  ariaLabel={`Ubah status ${proker.title}`}
                  disabled={!canEditProker}
                  value={proker.status}
                  options={QUICK_STATUS_OPTIONS}
                  onChange={(val) =>
                    handleStatusChange(proker.id, val as ProkerStatus)
                  }
                  className="min-w-[145px]"
                  buttonClassName="py-1.5 px-2.5 text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/proker/${proker.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-hairline text-secondary hover:text-blue-400 transition-colors"
                  title="Lihat halaman publik"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {canEditProker && (
                  <>
                    <button
                      type="button"
                      onClick={() => openEditModal(proker)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-hairline hover:border-blue-500/50 text-secondary hover:text-main font-mono text-[11px] cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>EDIT</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(proker.id, proker.title)}
                      aria-label={`Hapus ${proker.title}`}
                      className="p-2 border border-hairline hover:border-red-500/50 text-muted hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Proker Modal */}
      {editing && (
        <div
          key={editing.id || "new-proker"}
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
          onClick={() => setEditing(null)}
        >
          <div
            data-lenis-prevent
            className="w-full max-w-2xl bg-surface border border-hairline shadow-2xl my-8 max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline sticky top-0 bg-surface z-10">
              <h3 className="font-display text-xl uppercase text-main">
                {editing.id ? "EDIT PROGRAM KERJA" : "TAMBAH PROGRAM KERJA BARU"}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-2 border border-hairline text-secondary hover:text-main cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input type="hidden" name="id" value={editing.id ?? ""} />
              <input
                type="hidden"
                name="existing_cover_url"
                value={editing.cover_image_url ?? ""}
              />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    NOMOR
                  </label>
                  <input
                    name="highlight_number"
                    defaultValue={editing.highlight_number ?? ""}
                    placeholder="01"
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    JUDUL PROGRAM KERJA
                  </label>
                  <input
                    name="title"
                    required
                    defaultValue={editing.title ?? ""}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-sm text-main outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    SLUG URL (/proker/...)
                  </label>
                  <input
                    name="slug"
                    required
                    defaultValue={editing.slug ?? ""}
                    placeholder="contoh: tech-workshop-2026"
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    DIVISI PENYELENGGARA
                  </label>
                  <CustomSelect
                    name="division_code"
                    ariaLabel="Divisi Penyelenggara"
                    defaultValue={editing.division_code ?? "MEDKRAF"}
                    options={DIVISION_OPTIONS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    STATUS
                  </label>
                  <CustomSelect
                    name="status"
                    ariaLabel="Status Program Kerja"
                    defaultValue={editing.status ?? "upcoming"}
                    options={MODAL_STATUS_OPTIONS}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    JADWAL PELAKSANAAN
                  </label>
                  <input
                    name="execution_label"
                    required
                    defaultValue={editing.execution_label ?? ""}
                    placeholder="NOVEMBER 2026"
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    LOKASI KEGIATAN
                  </label>
                  <input
                    name="location"
                    required
                    defaultValue={editing.location ?? ""}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    SASARAN PESERTA
                  </label>
                  <input
                    name="target_audience"
                    required
                    defaultValue={editing.target_audience ?? ""}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  RINGKASAN SINGKAT
                </label>
                <textarea
                  name="short_desc"
                  required
                  rows={2}
                  defaultValue={editing.short_desc ?? ""}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  DESKRIPSI LENGKAP (PISAH PARAGRAF DENGAN BARIS KOSONG)
                </label>
                <textarea
                  name="full_content"
                  rows={4}
                  defaultValue={editing.full_content ?? ""}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  TUJUAN KEGIATAN (1 POIN PER BARIS)
                </label>
                <textarea
                  name="objectives_text"
                  rows={3}
                  defaultValue={(editing.objectives ?? []).join("\n")}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  SUSUNAN ACARA / RUNDOWN (FORMAT: WAKTU | KEGIATAN, 1 BARIS PER SESI)
                </label>
                <textarea
                  name="rundown_text"
                  rows={3}
                  placeholder="08.00 - 09.00 | Registrasi Peserta & Pembukaan"
                  defaultValue={(editing.rundown ?? [])
                    .map((item) => `${item.time} | ${item.activity}`)
                    .join("\n")}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 border border-hairline bg-canvas/50">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-secondary block">
                    NAMA NARAHUBUNG (OPSIONAL)
                  </label>
                  <input
                    name="contact_name"
                    defaultValue={editing.contact_person?.name ?? ""}
                    placeholder="Contoh: Adi (PMB)"
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-secondary block">
                    PERAN / JABATAN
                  </label>
                  <input
                    name="contact_role"
                    defaultValue={editing.contact_person?.role ?? ""}
                    placeholder="Ketua Pelaksana"
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-secondary block">
                    NO. WA / LINK WA.ME
                  </label>
                  <input
                    name="contact_phone"
                    defaultValue={editing.contact_person?.contact ?? ""}
                    placeholder="081234567890"
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  LINK PENDAFTARAN (OPSIONAL)
                </label>
                <input
                  name="registration_link"
                  type="url"
                  defaultValue={editing.registration_link ?? ""}
                  placeholder="https://forms.gle/..."
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                />
              </div>

              <div className="space-y-2.5 border border-hairline bg-canvas/50 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-mono text-[11px] text-secondary block">
                    POSTER / BANNER UTAMA (OPSIONAL)
                  </label>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    {coverFile && (
                      <button
                        type="button"
                        onClick={() => updateSelectedCoverFile(null)}
                        className="px-2 py-1 border border-hairline bg-canvas text-secondary hover:text-main cursor-pointer"
                      >
                        BATALKAN FILE BARU
                      </button>
                    )}
                    {activeCoverPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          updateSelectedCoverFile(null);
                          setCoverRemoved(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>HAPUS POSTER</span>
                      </button>
                    )}
                    {!activeCoverPreview && coverRemoved && editing.cover_image_url && (
                      <button
                        type="button"
                        onClick={() => setCoverRemoved(false)}
                        className="px-2 py-1 border border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                      >
                        BATALKAN HAPUS
                      </button>
                    )}
                  </div>
                </div>

                {activeCoverPreview ? (
                  <div className="flex items-center gap-3 p-2.5 border border-hairline bg-canvas">
                    <div className="relative w-28 sm:w-36 aspect-video border border-hairline bg-black overflow-hidden shrink-0">
                      <Image
                        src={activeCoverPreview}
                        alt="Preview poster proker"
                        fill
                        sizes="150px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1 font-mono text-[11px]">
                      <span className="text-blue-400 block uppercase">
                        {coverFile ? "POSTER BARU SIAP DIUNGGAH" : "POSTER TERPASANG"}
                      </span>
                      <p className="text-secondary truncate">
                        {coverFile ? coverFile.name : editing.cover_image_url}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 border border-hairline bg-canvas font-mono text-[11px] text-muted">
                    {coverRemoved
                      ? "Poster utama akan dihapus saat disimpan (proker tampil tanpa poster)."
                      : "Belum ada poster utama (opsional)."}
                  </div>
                )}

                <label className="flex items-center gap-3 p-2.5 border border-dashed border-hairline bg-canvas cursor-pointer hover:border-blue-500/60">
                  <Upload className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-mono text-[11px] text-secondary truncate">
                    {coverFile
                      ? `Ganti pilihan: ${coverFile.name}`
                      : activeCoverPreview
                        ? "GANTI POSTER UTAMA (JPG / PNG / WEBP)"
                        : "UNGGAH POSTER UTAMA (JPG / PNG / WEBP)"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      updateSelectedCoverFile(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {/* Multi-Photo Documentation Gallery Manager */}
              <div className="space-y-2 border border-hairline bg-canvas/50 p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-blue-400 uppercase tracking-wider">
                    GALERI DOKUMENTASI ({galleryDraft.length + newGalleryFiles.length} FOTO)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted">
                      Klik X pada foto untuk menghapusnya
                    </span>
                    {(galleryDraft.length > 0 || newGalleryFiles.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryDraft([]);
                          setNewGalleryFiles([]);
                        }}
                        className="px-2 py-0.5 border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white font-mono text-[10px] transition-colors cursor-pointer"
                      >
                        HAPUS SEMUA
                      </button>
                    )}
                  </div>
                </div>

                {galleryDraft.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {galleryDraft.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="relative aspect-video border border-hairline bg-black overflow-hidden group"
                      >
                        <Image
                          src={url}
                          alt={`Galeri ${idx + 1}`}
                          fill
                          sizes="120px"
                          unoptimized
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setGalleryDraft((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label={`Hapus foto galeri ${idx + 1}`}
                          className="absolute top-1 right-1 p-1 bg-black/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-center gap-3 p-2.5 border border-dashed border-hairline bg-canvas cursor-pointer hover:border-blue-500/60">
                  <Upload className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-mono text-[11px] text-secondary truncate">
                    {newGalleryFiles.length > 0
                      ? `${newGalleryFiles.length} foto dokumentasi baru siap diunggah`
                      : "TAMBAH FOTO DOKUMENTASI (BISA PILIH BANYAK)"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length > 0) {
                        setNewGalleryFiles((prev) => [...prev, ...files]);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>

                {newGalleryFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {newGalleryFiles.map((file, idx) => (
                      <span
                        key={`${file.name}-${idx}`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 border border-blue-500/40 bg-blue-500/10 font-mono text-[10px] text-blue-300"
                      >
                        <span className="truncate max-w-[140px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setNewGalleryFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1 font-mono text-xs text-secondary">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    value="true"
                    defaultChecked={Boolean(editing.is_featured)}
                  />
                  <span>TAMPILKAN DI SLIDER BERANDA</span>
                </label>
                <input
                  type="hidden"
                  name="is_white_background"
                  value={String(Boolean(editing.is_white_background))}
                />
              </div>

              <div className="pt-3 border-t border-hairline flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 border border-hairline bg-canvas text-secondary font-mono text-xs cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? "MENYIMPAN..." : "SIMPAN PROKER"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
