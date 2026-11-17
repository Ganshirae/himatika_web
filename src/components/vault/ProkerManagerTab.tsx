"use client";

import React, { useState } from "react";
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
import type { ProkerStatus, WorkProgramRow } from "@/types/database.types";

interface ProkerManagerTabProps {
  prokers: WorkProgramRow[];
  canEditProker: boolean;
}

const DIVISION_OPTIONS = [
  { code: "KOLABORASI", label: "KOLABORASI SEMUA DIVISI" },
  { code: "PRESIDIUM", label: "PRESIDIUM UTAMA" },
  { code: "BPH_SEK", label: "SEKRETARIS" },
  { code: "BPH_BEN", label: "BENDAHARA" },
  { code: "BPSDM", label: "BPSDM" },
  { code: "HUMAS", label: "HUBUNGAN MASYARAKAT" },
  { code: "RISET", label: "RISET & KEILMUAN" },
  { code: "PMB", label: "MINAT & BAKAT" },
  { code: "SARLOG", label: "SARANA & LOGISTIK" },
  { code: "MEDKRAF", label: "MEDIA KREATIF" },
];

export function ProkerManagerTab({
  prokers,
  canEditProker,
}: ProkerManagerTabProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<WorkProgramRow> | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const openNewModal = () => {
    setCoverFile(null);
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
      cover_image_url: "/image/tcamp2024.jpg",
      registration_link: "",
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

    const res = await upsertWorkProgram(formData);
    setSubmitting(false);
    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });

    if (res.success) {
      setEditing(null);
      setCoverFile(null);
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
                <select
                  aria-label={`Ubah status ${proker.title}`}
                  disabled={!canEditProker}
                  value={proker.status}
                  onChange={(e) =>
                    handleStatusChange(proker.id, e.target.value as ProkerStatus)
                  }
                  className="bg-canvas border border-hairline px-2.5 py-1.5 font-mono text-[11px] text-main outline-none"
                >
                  <option value="upcoming">UPCOMING</option>
                  <option value="ongoing">ONGOING</option>
                  <option value="completed">COMPLETED</option>
                </select>
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
                      onClick={() => {
                        setCoverFile(null);
                        setEditing(proker);
                      }}
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
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-2xl bg-surface border border-hairline shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
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
                  <select
                    name="division_code"
                    defaultValue={editing.division_code ?? "MEDKRAF"}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  >
                    {DIVISION_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    STATUS
                  </label>
                  <select
                    name="status"
                    defaultValue={editing.status ?? "upcoming"}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  >
                    <option value="upcoming">UPCOMING (AKAN DATANG)</option>
                    <option value="ongoing">ONGOING (BERJALAN)</option>
                    <option value="completed">COMPLETED (SELESAI)</option>
                  </select>
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

              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-secondary block">
                  POSTER / BANNER KEGIATAN (OPSIONAL, UNGGAH KE PUBLIC-ASSETS)
                </label>
                <label className="flex items-center gap-3 p-3 border border-dashed border-hairline bg-canvas cursor-pointer hover:border-blue-500/60">
                  <Upload className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-mono text-[11px] text-secondary truncate">
                    {coverFile
                      ? `File baru: ${coverFile.name}`
                      : `Poster saat ini: ${editing.cover_image_url || "Default"}`}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  />
                </label>
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
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_white_background"
                    value="true"
                    defaultChecked={Boolean(editing.is_white_background)}
                  />
                  <span>WADAH LATAR PUTIH (LOGO)</span>
                </label>
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
