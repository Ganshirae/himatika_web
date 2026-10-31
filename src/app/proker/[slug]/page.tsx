export const instant = false;

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  Share2,
} from "lucide-react";
import { ALL_PROKERS, ProkerItem } from "@/lib/data/proker";
import { ProkerGallery } from "@/components/proker/ProkerGallery";

interface ProkerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_PROKERS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProkerDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proker = ALL_PROKERS.find((p) => p.slug === slug);

  if (!proker) {
    return {
      title: "Program Kerja Tidak Ditemukan | HIMATIKA Universitas Trilogi",
    };
  }

  return {
    title: `${proker.title} | HIMATIKA Universitas Trilogi`,
    description: proker.shortDesc,
  };
}

export default async function ProkerDetailPage({
  params,
}: ProkerDetailPageProps) {
  const { slug } = await params;
  const prokerIndex = ALL_PROKERS.findIndex((p) => p.slug === slug);

  if (prokerIndex === -1) {
    notFound();
  }

  const proker = ALL_PROKERS[prokerIndex];
  const isCollaborative = proker.divisionCode === "KOLABORASI";

  // Next and Previous prokers for pagination
  const prevProker =
    prokerIndex > 0 ? ALL_PROKERS[prokerIndex - 1] : ALL_PROKERS[ALL_PROKERS.length - 1];
  const nextProker =
    prokerIndex < ALL_PROKERS.length - 1 ? ALL_PROKERS[prokerIndex + 1] : ALL_PROKERS[0];

  const renderStatusBadge = () => {
    switch (proker.status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Akan Datang
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sedang Berjalan
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            Kegiatan Selesai
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6]">
      {/* Top Header / Breadcrumb */}
      <div className="pt-24 md:pt-32 pb-8 border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            href="/proker"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            KEMBALI KE DAFTAR PROGRAM
          </Link>

          {/* Metadata badges row */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className="px-2.5 py-1 text-xs font-mono text-white/90 bg-[#0c0c0e] border border-white/15 rounded">
              PROGRAM {proker.number}
            </span>
            <span
              className={`px-3 py-1 text-xs font-mono tracking-wider uppercase rounded ${
                isCollaborative
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/50 font-semibold"
                  : "bg-[#0c0c0e] text-zinc-300 border border-white/10"
              }`}
            >
              {proker.divisionName}
            </span>
            {renderStatusBadge()}
          </div>

          {/* Headline Title in Anton */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white max-w-5xl">
            {proker.title}
          </h1>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Narrative, Details, Rundown, Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Main Visual Cover */}
            <div
              className={`relative aspect-[16/9] w-full overflow-hidden border border-white/10 rounded ${
                proker.isWhiteBackground ? "bg-white" : "bg-black"
              }`}
            >
              <Image
                src={proker.coverImage}
                alt={proker.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className={`transition-all duration-300 ${
                  proker.isWhiteBackground
                    ? "object-contain p-8 sm:p-14"
                    : "object-cover"
                }`}
              />
              {!proker.isWhiteBackground && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              )}
            </div>

            {/* Section 1: Latar Belakang & Deskripsi Naratif */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                TENTANG KEGIATAN
              </div>
              <h2 className="font-display text-2xl sm:text-3xl uppercase text-white">
                TENTANG PROGRAM KERJA
              </h2>
              <div className="space-y-4 text-zinc-300 font-sans text-base leading-relaxed">
                {proker.fullDesc.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Section 2: Tujuan & Sasaran Utama */}
            {proker.objectives && proker.objectives.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  TUJUAN UTAMA
                </div>
                <h2 className="font-display text-2xl sm:text-3xl uppercase text-white">
                  TUJUAN & TARGET KEGIATAN
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {proker.objectives.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#0c0c0e] border border-white/5 rounded flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded bg-blue-600/20 text-blue-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Rundown / Susunan Acara (Jika Ada) */}
            {proker.rundown && proker.rundown.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  SUSUNAN ACARA
                </div>
                <h2 className="font-display text-2xl sm:text-3xl uppercase text-white">
                  SUSUNAN KEGIATAN
                </h2>
                <div className="border border-white/10 rounded overflow-hidden divide-y divide-white/5 bg-[#0c0c0e]">
                  {proker.rundown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="font-mono text-xs text-blue-400 font-medium shrink-0 sm:w-40">
                        {item.time}
                      </span>
                      <span className="text-sm text-zinc-200 flex-1">
                        {item.activity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 4: Galeri Dokumentasi Foto dengan Interaktif Lightbox */}
            {proker.galleryImages && proker.galleryImages.length > 0 && (
              <ProkerGallery title={proker.title} images={proker.galleryImages} />
            )}
          </div>

          {/* Right Column: Sticky Sidebar / Info Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Event Information Box */}
              <div className="p-6 bg-[#0c0c0e] border border-white/10 rounded space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    INFORMASI ACARA
                  </span>
                  {renderStatusBadge()}
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 block">WAKTU PELAKSANAAN</span>
                      <span className="text-white text-sm font-sans font-medium">
                        {proker.executionDate}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 block">LOKASI / TEMPAT</span>
                      <span className="text-zinc-200 text-sm font-sans">
                        {proker.location}
                      </span>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 block">SASARAN PESERTA</span>
                      <span className="text-zinc-200 text-sm font-sans">
                        {proker.targetAudience}
                      </span>
                    </div>
                  </div>

                  {/* Division */}
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-500 block">DIVISI PENYELENGGARA</span>
                      <span className="text-blue-400 text-sm font-sans font-medium">
                        {proker.divisionName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  {proker.status === "upcoming" && proker.registrationLink ? (
                    <a
                      href={proker.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-wider uppercase rounded font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] text-center"
                    >
                      DAFTAR SEKARANG
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : proker.status === "ongoing" ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-center text-xs font-mono text-emerald-400">
                      PROGRAM INI SEDANG BERLANGSUNG
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-800/80 border border-zinc-700 rounded text-center text-xs font-mono text-zinc-300">
                      KEGIATAN TELAH SELESAI DILAKSANAKAN
                    </div>
                  )}

                  {/* Contact Person / Narahubung WhatsApp */}
                  {proker.contactPerson && (
                    <a
                      href={proker.contactPerson.contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#141418] hover:bg-[#1b1b22] text-zinc-300 hover:text-white border border-white/10 rounded font-mono text-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      HUBUNGI NARAHUBUNG ({proker.contactPerson.name})
                    </a>
                  )}
                </div>
              </div>

              {/* Division Context Box */}
              <div className="p-6 bg-[#0c0c0e] border border-white/10 rounded space-y-3">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                  STRUKTUR HIMATIKA
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Ingin mengetahui lebih dalam mengenai tugas pokok dan susunan pengurus divisi yang menaungi program ini?
                </p>
                <Link
                  href="/struktur"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors pt-1"
                >
                  LIHAT STRUKTUR PENGURUS →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Pagination / Navigator */}
      <div className="border-t border-white/10 bg-[#08080a] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link
            href={`/proker/${prevProker.slug}`}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <span className="text-[10px] text-zinc-600 block">SEBELUMNYA</span>
              <span className="text-zinc-300 group-hover:text-white font-sans text-sm font-medium truncate max-w-xs block">
                {prevProker.title}
              </span>
            </div>
          </Link>

          <Link
            href="/proker"
            className="px-4 py-2 bg-[#0c0c0e] border border-white/10 rounded text-zinc-400 hover:text-white transition-colors"
          >
            SEMUA PROGRAM
          </Link>

          <Link
            href={`/proker/${nextProker.slug}`}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-right"
          >
            <div className="text-right">
              <span className="text-[10px] text-zinc-600 block">BERIKUTNYA</span>
              <span className="text-zinc-300 group-hover:text-white font-sans text-sm font-medium truncate max-w-xs block">
                {nextProker.title}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
