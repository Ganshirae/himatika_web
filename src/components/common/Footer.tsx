"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { useLenisScroll } from "./SmoothScroller";
import ScrambleText from "./ScrambleText";
import { SOCIAL_LINKS } from "@/lib/data/social";

const DIVISIONS = [
  { label: "BPH (SEK & BEN)", href: "/struktur" },
  { label: "BPSDM", href: "/proker?division=BPSDM" },
  { label: "HUMAS", href: "/proker?division=HUMAS" },
  { label: "RISET & KEILMUAN", href: "/proker?division=RISET" },
  { label: "MINAT & BAKAT", href: "/proker?division=PMB" },
  { label: "SARANA & LOGISTIK", href: "/proker?division=SARLOG" },
  { label: "MEDIA KREATIF", href: "/proker?division=MEDKRAF" },
];

export default function Footer() {
  const { scrollTo } = useLenisScroll();

  const handleBackToTop = () => {
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <footer className="w-full bg-surface/60 border-t border-hairline text-secondary relative z-10 print:hidden">
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
                    UNIVERSITAS TRILOGI • EST. 2015
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
                JAKARTA SELATAN, INDONESIA
              </div>
            </div>
          </div>

          {/* Kolom 2: Direktori Navigasi (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs text-muted tracking-widest uppercase">
              NAVIGASI
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
                  href="/struktur"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-muted group-hover:text-blue-400">›</span>
                  <ScrambleText text="STRUKTUR PENGURUS" />
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
                  href="/keuangan"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-muted group-hover:text-blue-400">›</span>
                  <ScrambleText text="TRANSPARANSI KAS" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-muted group-hover:text-blue-400">›</span>
                  <ScrambleText text="HUBUNGI KAMI" />
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
              DIVISI KAMI
            </h4>
            <ul className="space-y-2 font-mono text-[11px] text-muted">
              {DIVISIONS.map((div) => (
                <li key={div.label}>
                  <Link
                    href={div.href}
                    className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>•</span>
                    <span>{div.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Jaringan Eksternal & Sosmed (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs text-muted tracking-widest uppercase">
              MEDIA SOSIAL
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {SOCIAL_LINKS.map((soc) => {
                const isExternal = soc.href !== "#";
                return (
                  <li key={soc.label}>
                    <a
                      href={soc.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!isExternal) e.preventDefault();
                      }}
                      className="flex items-center justify-between py-1 border-b border-hairline/40 hover:border-blue-500/40 hover:text-blue-400 transition-colors group"
                    >
                      <span>{soc.label}</span>
                      <span className="text-[11px] text-secondary group-hover:text-blue-400 flex items-center gap-1.5">
                        <span>{soc.handle}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </a>
                  </li>
                );
              })}
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
