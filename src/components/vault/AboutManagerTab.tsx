"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { updateSiteAbout } from "@/actions/about.actions";
import { AboutGalleryPanel } from "./AboutGalleryPanel";
import {
  DEFAULT_SITE_ABOUT,
  type SiteAboutContent,
} from "@/lib/data/about";
import type { AboutMissionJson } from "@/types/database.types";

interface AboutManagerTabProps {
  about: SiteAboutContent;
  canEditProfile: boolean;
}

export function AboutManagerTab({
  about,
  canEditProfile,
}: AboutManagerTabProps) {
  const router = useRouter();
  const [introPrimary, setIntroPrimary] = useState(about.introPrimary);
  const [introSecondary, setIntroSecondary] = useState(about.introSecondary);
  const [visionText, setVisionText] = useState(about.visionText);
  const [periodLabel, setPeriodLabel] = useState(about.periodLabel);
  const [missions, setMissions] = useState<AboutMissionJson[]>(about.missions);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoObjectUrl, setLogoObjectUrl] = useState<string | null>(null);
  const [resetLogo, setResetLogo] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (logoObjectUrl) {
        URL.revokeObjectURL(logoObjectUrl);
      }
    };
  }, [logoObjectUrl]);

  const updateSelectedLogo = (file: File | null) => {
    setLogoFile(file);
    setLogoObjectUrl(file ? URL.createObjectURL(file) : null);
    if (file) {
      setResetLogo(false);
    }
  };

  const previewLogoUrl =
    logoObjectUrl ??
    (resetLogo ? DEFAULT_SITE_ABOUT.logoImageUrl : about.logoImageUrl);

  const handleMissionChange = (
    idx: number,
    field: "tag" | "title" | "desc",
    value: string
  ) => {
    setMissions((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMission = () => {
    if (missions.length >= 8) return;
    setMissions((prev) => [
      ...prev,
      {
        num: String(prev.length + 1).padStart(2, "0"),
        tag: "PROGRAM UNGGULAN",
        title: "PILAR MISI BARU",
        desc: "Tuliskan deskripsi misi organisasi di sini...",
      },
    ]);
  };

  const handleRemoveMission = (idx: number) => {
    if (missions.length <= 1) return;
    setMissions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.set("intro_primary", introPrimary);
    formData.set("intro_secondary", introSecondary);
    formData.set("vision_text", visionText);
    formData.set("period_label", periodLabel);
    formData.set("existing_logo_url", about.logoImageUrl);
    formData.set("reset_logo", String(resetLogo && !logoFile));
    formData.set(
      "missions_json",
      JSON.stringify(
        missions.map((m) => ({
          tag: m.tag,
          title: m.title,
          desc: m.desc,
        }))
      )
    );
    if (logoFile) {
      formData.set("logo_file", logoFile);
    }

    const res = await updateSiteAbout(formData);
    setSubmitting(false);
    setFeedback({ ok: res.success, msg: res.message });

    if (res.success) {
      updateSelectedLogo(null);
      setResetLogo(false);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <AboutGalleryPanel
        photos={about.galleryPhotos}
        canEditProfile={canEditProfile}
      />

      {canEditProfile && (
        <div className="space-y-6">
          <div className="p-6 bg-surface border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-400 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>MANAJEMEN PROFIL &amp; VISI MISI (/about)</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-main">
                KELOLA HALAMAN TENTANG
              </h2>
              <p className="text-xs sm:text-sm text-secondary font-sans">
                Perbarui profil organisasi, visi, daftar misi, periode kepengurusan, dan logo yang tampil di halaman Tentang Kami.
              </p>
            </div>

            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main font-mono text-xs transition-colors shrink-0"
            >
              <span>LIHAT /ABOUT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {feedback && (
            <div
              className={`p-4 border font-mono text-xs ${
                feedback.ok
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
              }`}
            >
              {feedback.msg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-6 bg-surface border border-hairline space-y-6"
          >
        {/* Logo & Period Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 border-b border-hairline">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-mono text-xs text-secondary uppercase">
                LOGO HALAMAN TENTANG
              </label>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {logoFile && (
                  <button
                    type="button"
                    onClick={() => updateSelectedLogo(null)}
                    className="px-2 py-1 border border-hairline bg-canvas text-secondary hover:text-main cursor-pointer"
                  >
                    BATALKAN FILE
                  </button>
                )}
                {about.logoImageUrl !== DEFAULT_SITE_ABOUT.logoImageUrl &&
                  !resetLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        updateSelectedLogo(null);
                        setResetLogo(true);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 border border-hairline bg-canvas text-secondary hover:text-main cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>KEMBALIKAN DEFAULT</span>
                    </button>
                  )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-hairline bg-canvas">
              <div className="relative w-24 h-24 shrink-0 border border-hairline bg-surface overflow-hidden">
                <Image
                  src={previewLogoUrl}
                  alt="Preview logo Tentang"
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2.5">
                <p className="font-mono text-[11px] text-secondary truncate">
                  {logoFile
                    ? `File baru: ${logoFile.name}`
                    : resetLogo
                      ? "Akan kembali ke Logo Default (/image/Logo Himatika.webp)"
                      : about.logoImageUrl}
                </p>
                <label className="inline-flex items-center gap-2 px-3.5 py-2 border border-dashed border-hairline bg-surface hover:border-blue-500/60 font-mono text-[11px] text-secondary hover:text-main cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>UNGGAH LOGO BARU (JPG / PNG / WEBP)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      updateSelectedLogo(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-2">
            <label
              htmlFor="about-period"
              className="font-mono text-xs text-secondary uppercase block"
            >
              LABEL PERIODE AKTIF
            </label>
            <input
              id="about-period"
              required
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              placeholder="PERIODE 2026/2027"
              className="w-full bg-canvas border border-hairline px-3.5 py-2.5 font-mono text-xs text-main focus:border-blue-500 outline-none"
            />
            <p className="font-mono text-[10px] text-muted leading-relaxed">
              Otomatis tersinkron ke badge periode di halaman /about dan /struktur.
            </p>
          </div>
        </div>

        {/* Intro Paragraphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="about-intro-1"
              className="font-mono text-xs text-secondary uppercase block"
            >
              PARAGRAF PROFIL UTAMA
            </label>
            <textarea
              id="about-intro-1"
              required
              rows={4}
              value={introPrimary}
              onChange={(e) => setIntroPrimary(e.target.value)}
              className="w-full bg-canvas border border-hairline px-3.5 py-2.5 font-sans text-sm text-main focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="about-intro-2"
              className="font-mono text-xs text-secondary uppercase block"
            >
              PARAGRAF PROFIL KEDUA
            </label>
            <textarea
              id="about-intro-2"
              required
              rows={4}
              value={introSecondary}
              onChange={(e) => setIntroSecondary(e.target.value)}
              className="w-full bg-canvas border border-hairline px-3.5 py-2.5 font-sans text-sm text-main focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Vision Statement */}
        <div className="space-y-1.5">
          <label
            htmlFor="about-vision"
            className="font-mono text-xs text-secondary uppercase block"
          >
            PERNYATAAN VISI ORGANISASI
          </label>
          <textarea
            id="about-vision"
            required
            rows={3}
            value={visionText}
            onChange={(e) => setVisionText(e.target.value)}
            className="w-full bg-canvas border border-hairline px-3.5 py-2.5 font-sans text-sm text-main focus:border-blue-500 outline-none"
          />
        </div>

        {/* Missions List */}
        <div className="space-y-4 pt-4 border-t border-hairline">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-blue-400 uppercase tracking-wider">
              DAFTAR MISI ORGANISASI ({missions.length} POIN)
            </span>
            {missions.length < 8 && (
              <button
                type="button"
                onClick={handleAddMission}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main font-mono text-[11px] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>TAMBAH POIN MISI</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {missions.map((mission, idx) => (
              <div
                key={idx}
                className="p-4 bg-canvas border border-hairline space-y-3"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="text-blue-400 font-semibold">
                    MISI {String(idx + 1).padStart(2, "0")}
                  </span>
                  {missions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMission(idx)}
                      className="inline-flex items-center gap-1 text-muted hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>HAPUS</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    required
                    value={mission.tag}
                    onChange={(e) =>
                      handleMissionChange(idx, "tag", e.target.value)
                    }
                    placeholder="Tag (mis. RISET)"
                    className="bg-surface border border-hairline px-2.5 py-2 font-mono text-[11px] text-main outline-none"
                  />
                  <input
                    required
                    value={mission.title}
                    onChange={(e) =>
                      handleMissionChange(idx, "title", e.target.value)
                    }
                    placeholder="Judul Misi"
                    className="sm:col-span-2 bg-surface border border-hairline px-2.5 py-2 font-sans text-xs text-main outline-none"
                  />
                </div>

                <textarea
                  required
                  rows={2}
                  value={mission.desc}
                  onChange={(e) =>
                    handleMissionChange(idx, "desc", e.target.value)
                  }
                  placeholder="Deskripsi misi..."
                  className="w-full bg-surface border border-hairline px-2.5 py-2 font-sans text-xs text-main outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-hairline flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{submitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN TENTANG"}</span>
          </button>
        </div>
      </form>
        </div>
      )}
    </div>
  );
}
