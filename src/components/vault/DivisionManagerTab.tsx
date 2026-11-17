"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, X, Loader2 } from "lucide-react";
import { updateDivisionStructure } from "@/actions/org.actions";
import type { DivisionRow } from "@/types/database.types";

interface DivisionManagerTabProps {
  divisions: DivisionRow[];
}

export function DivisionManagerTab({ divisions }: DivisionManagerTabProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<DivisionRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateDivisionStructure(formData);
    setSubmitting(false);

    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });

    if (res.success) {
      setEditing(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-hairline pb-4">
        <h2 className="font-display text-2xl uppercase text-main">
          MANAJEMEN STRUKTUR &amp; DIVISI (/STRUKTUR)
        </h2>
        <p className="font-sans text-xs text-secondary mt-1">
          Kelola nama pimpinan, susunan anggota, tugas pokok, dan bidang fokus organisasi yang tampil di diagram interaktif.
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {divisions.map((div) => (
          <div
            key={div.id}
            className="p-5 bg-surface border border-hairline flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="font-mono text-[10px] text-blue-400 uppercase tracking-wider">
                {div.level_name} • {div.code}
              </div>
              <h3 className="font-display text-xl uppercase text-main">
                {div.short_title || div.name}
              </h3>
              <p className="font-mono text-xs text-secondary">
                {div.leader_title}: <span className="text-main">{div.leader_name}</span>
              </p>
              <p className="font-sans text-xs text-muted line-clamp-2">
                {div.short_desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditing(div)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 border border-hairline hover:border-blue-500/60 bg-canvas text-secondary hover:text-main font-mono text-xs transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>UBAH STRUKTUR</span>
            </button>
          </div>
        ))}
      </div>

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
                EDIT BIDANG: {editing.code}
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
              <input type="hidden" name="id" value={editing.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    NAMA LENGKAP BIDANG
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={editing.name}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-sm text-main outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    JUDUL SINGKAT NODE
                  </label>
                  <input
                    name="short_title"
                    required
                    defaultValue={editing.short_title ?? editing.name}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    JABATAN PIMPINAN
                  </label>
                  <input
                    name="leader_title"
                    required
                    defaultValue={editing.leader_title ?? "Koordinator Divisi"}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-secondary block">
                    NAMA PIMPINAN / KOORDINATOR
                  </label>
                  <input
                    name="leader_name"
                    required
                    defaultValue={editing.leader_name}
                    className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  RINGKASAN PERAN
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
                  TUGAS POKOK &amp; FUNGSI (1 POIN PER BARIS)
                </label>
                <textarea
                  name="tupoksi_text"
                  required
                  rows={4}
                  defaultValue={(editing.tupoksi ?? []).join("\n")}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-sans text-xs text-main outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  BIDANG FOKUS UTAMA (PISAHKAN DENGAN KOMA)
                </label>
                <input
                  name="focus_areas_text"
                  defaultValue={(editing.focus_areas ?? []).join(", ")}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] text-secondary block">
                  SUSUNAN ANGGOTA (FORMAT JSON)
                </label>
                <textarea
                  name="member_groups_json"
                  rows={3}
                  defaultValue={JSON.stringify(editing.member_groups ?? [], null, 2)}
                  className="w-full bg-canvas border border-hairline px-3 py-2 font-mono text-xs text-main outline-none"
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
                  <span>{submitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
