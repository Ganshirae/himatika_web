"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { useLenisScroll } from "./SmoothScroller";
import ScrambleText from "./ScrambleText";

const DIVISIONS = [
  "BPH (SEK & BEN)",
  "BPSDM",
  "HUMAS",
  "RISET & KEILMUAN",
  "MINAT & BAKAT",
  "SARANA & LOGISTIK",
  "MEDIA KREATIF",
];

const SOCIAL_LINKS = [
  { label: "INSTAGRAM", handle: "@himatikator", href: "https://instagram.com/himatikator" },
  { label: "GITHUB", handle: "himatikator", href: "https://github.com/himatikator" },
  { label: "LINKEDIN", handle: "himatika-trilogi", href: "https://linkedin.com" },
  { label: "EMAIL", handle: "himatika@trilogi.ac.id", href: "mailto:himatika@trilogi.ac.id" },
  { label: "CAMPUS", handle: "universitas-trilogi.ac.id", href: "https://universitas-trilogi.ac.id" },
];

export default function Footer() {
  const { scrollTo } = useLenisScroll();

  const handleBackToTop = () => {
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <footer className="w-full bg-surface/60 border-t border-hairline text-secondary relative z-10">
      {/* Upper Grid Section */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Kolom 1: Branding & Identitas (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3.5 group inline-flex">
                <div className="relative w-9 h-9 shrink-0">
                  <Image
                    src="/image/logohima.png"
                    alt="Logo HIMATIKA"
                    fill
                    sizes="36px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-display text-2xl tracking-tight text-main group-hover:text-blue-400 transition-colors block">
                    HIMATIKA TRILOGI
                  </span>
                  <span className="font-mono text-[9px] text-muted tracking-widest uppercase block">
                    UNIVERSITAS TRILOGI // EST. 2015
                  </span>
                </div>
              </Link>

              <p className="font-sans text-sm text-secondary leading-relaxed max-w-sm">
                Wadah resmi pengembangan keilmuan, kepemimpinan, dan inovasi teknologi mahasiswa Teknik Informatika Universitas Trilogi.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-hairline/60">
              <div className="font-mono text-[11px] text-muted leading-relaxed">
                Jl. TMP. Kalibata No.1, Duren Tiga, Pancoran, Kota Jakarta Selatan, DKI Jakarta 12760
              </div>
              <div className="font-mono text-[10px] text-blue-400 tracking-wider">
                COORDS: -6.2575° S, 106.8533° E // STATUS: DEPLOYED
              </div>
            </div>
          </div>

          {/* Kolom 2: Direktori Navigasi (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs text-muted tracking-widest uppercase">
              [01 // DIREKTORI]
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-muted group-hover:text-blue-400">›</span>
                  <ScrambleText text="BERANDA" />
                </Link>
              </li>
              <li>
                <Link
                  href="/proker"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-muted group-hover:text-blue-400">›</span>
                  <ScrambleText text="PROGRAM KERJA" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-muted group-hover:text-blue-400">›</span>
                  <ScrambleText text="TENTANG KAMI" />
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-blue-400">›</span>
                  <ScrambleText text="PORTAL PENGURUS" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: 8 Divisi Kepengurusan (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs text-muted tracking-widest uppercase">
              [02 // ENTIITAS]
            </h4>
            <ul className="space-y-2 font-mono text-[11px] text-muted">
              {DIVISIONS.map((divName) => (
                <li key={divName} className="hover:text-main transition-colors">
                  • {divName}
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Jaringan Eksternal & Sosmed (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs text-muted tracking-widest uppercase">
              [03 // JARINGAN]
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {SOCIAL_LINKS.map((soc) => (
                <li key={soc.label}>
                  <a
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-1 border-b border-hairline/40 hover:border-blue-500/40 hover:text-blue-400 transition-colors group"
                  >
                    <span>{soc.label}</span>
                    <span className="text-[10px] text-muted group-hover:text-blue-400 flex items-center gap-1">
                      {soc.handle}
                      <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Bar: Copyright, Specs, & Back to Top */}
      <div className="border-t border-hairline bg-canvas/70">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-muted">
          <div>
            © 2026-2027 HIMATIKA UNIVERSITAS TRILOGI. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-muted/80">
              STD: CINEMATIC BRUTALIST // VERCEL EDGE
            </span>

            <button
              onClick={handleBackToTop}
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors border border-hairline px-2.5 py-1 bg-surface/50"
              aria-label="Kembali ke atas"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3 h-3 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
