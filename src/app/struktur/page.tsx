import React from "react";
import Link from "next/link";
import OrgBlueprint from "@/components/diagram/OrgBlueprint";
import { ArrowRight, Compass, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STRUKTUR PENGURUS | HIMATIKA UNIVERSITAS TRILOGI",
  description:
    "Susunan kepengurusan, divisi kerja, dan koordinator bidang Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi.",
};

export default function StrukturPage() {
  return (
    <div className="w-full bg-canvas text-main min-h-screen">
      {/* HERO SECTION STRUKTUR PENGURUS */}
      <section className="relative pt-32 sm:pt-40 pb-12 sm:pb-16 border-b border-hairline overflow-hidden">
        {/* Subtle Decorative Background Grain & Dots */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
          <div className="flex items-center gap-2.5 font-mono text-xs text-blue-500 mb-4 tracking-wider uppercase font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>PERIODE AKTIF 2026/2027</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-main uppercase leading-none max-w-5xl">
            STRUKTUR <span className="text-blue-600">PENGURUS</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted font-sans max-w-2xl leading-relaxed">
            Susunan kepengurusan dan bidang kerja HIMATIKA Universitas Trilogi periode aktif.
          </p>
        </div>
      </section>

      {/* INTERACTIVE BLUEPRINT DIAGRAM */}
      <OrgBlueprint />

      {/* FOOTER BRIDGING CTA */}
      <section className="py-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 text-center">
        <div className="p-8 sm:p-14 bg-surface/40 border border-hairline rounded-xs max-w-4xl mx-auto space-y-6">
          <span className="font-mono text-xs text-blue-500 tracking-widest uppercase block font-medium">
            PROGRAM KERJA RESMI
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight">
            INGIN MELIHAT PROGRAM KERJA KAMI?
          </h2>
          <p className="text-sm sm:text-base text-muted font-sans max-w-xl mx-auto">
            Lihat seluruh kegiatan, workshop, pameran inovasi, dan agenda kemahasiswaan yang dikelola oleh pengurus HIMATIKA Universitas Trilogi.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/proker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors uppercase rounded-xs"
            >
              <span>BUKA KATALOG PROGRAM KERJA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 border border-hairline hover:border-white/20 text-muted hover:text-white font-mono text-xs transition-colors uppercase rounded-xs"
            >
              <span>BACA VISI &amp; MISI</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
