"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight, ExternalLink } from "lucide-react";
import { OrgNode } from "@/lib/data/organization";

interface DivisionDrawerProps {
  isOpen: boolean;
  selectedNode: OrgNode | null;
  onClose: () => void;
}

export default function DivisionDrawer({
  isOpen,
  selectedNode,
  onClose,
}: DivisionDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Tangani tombol ESC dan klik di luar untuk menutup drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !selectedNode) return null;

  return (
    <>
      {/* Backdrop Gelap dengan Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[500px] lg:w-[580px] bg-canvas/95 backdrop-blur-2xl border-l border-hairline flex flex-col shadow-2xl transition-transform animate-in slide-in-from-right duration-300"
      >
        {/* Top Header Bar */}
        <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-hairline flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>DETAIL BIDANG {selectedNode.shortTitle}</span>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-muted hover:text-main border border-hairline hover:border-blue-600/50 bg-canvas/80 transition-all rounded-xs"
            aria-label="Tutup panel"
          >
            <span>TUTUP</span>
            <span className="text-[10px] text-muted/70 group-hover:text-blue-400">[ESC]</span>
            <X className="w-3.5 h-3.5 ml-0.5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-7 space-y-8 custom-scrollbar">
          {/* Judul & Metadata Divisi */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-wider uppercase px-2.5 py-0.5 bg-blue-600/10 text-blue-400 border border-blue-600/30 rounded-xs">
                {selectedNode.levelName}
              </span>
              <span className="font-mono text-xs text-muted/60">
                HIMATIKA TRILOGI
              </span>
            </div>

            <h2
              id="drawer-title"
              className="font-display text-2xl sm:text-3xl text-main tracking-tight uppercase leading-none"
            >
              {selectedNode.name}
            </h2>

            <p className="text-sm text-muted leading-relaxed font-sans pt-1">
              {selectedNode.shortDesc}
            </p>
          </div>

          {/* Section 1: Tugas Pokok & Fungsi (TUPOKSI) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">
                TUGAS POKOK &amp; FUNGSI (TUPOKSI)
              </span>
            </div>

            <ul className="space-y-2.5">
              {selectedNode.tupoksi.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-surface/30 border border-hairline rounded-xs hover:border-blue-600/30 transition-colors"
                >
                  <span className="font-mono text-xs text-blue-500 font-bold shrink-0 mt-0.5">
                    {`0${idx + 1}.`}
                  </span>
                  <span className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Struktur Pimpinan & Koordinasi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">
                PENGURUS DIVISI
              </span>
            </div>

            {/* Leader Photos Card */}
            {selectedNode.leaders && selectedNode.leaders.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedNode.leaders.map((leader, i) => (
                  <div
                    key={i}
                    className="p-3 bg-surface/60 border border-hairline rounded-xs flex items-center gap-3.5"
                  >
                    <div className="relative w-14 h-14 shrink-0 rounded-xs overflow-hidden bg-black/60 border border-blue-500/30">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        sizes="56px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] text-blue-400 block uppercase">
                        {leader.role}
                      </span>
                      <h4 className="font-display text-sm text-main uppercase truncate">
                        {leader.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-surface/40 border border-hairline rounded-xs space-y-3">
              <div className="border-t border-hairline pt-1 space-y-2">
                <span className="font-mono text-[11px] text-muted block">
                  SUSUNAN ANGGOTA &amp; PENGURUS:
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedNode.members.map((member, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1 px-2.5 bg-black/40 border border-hairline/60 rounded-xs"
                    >
                      <span className="text-neutral-300">{member.role}</span>
                      <span className="text-blue-400 font-semibold">
                        {member.count} Anggota
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Program Kerja Utama */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-mono text-xs tracking-widest text-muted uppercase">
                PROGRAM KERJA DIVISI
              </span>
            </div>

            <div className="space-y-2">
              {selectedNode.activeProkers.map((proker, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surface/30 border border-hairline rounded-xs flex items-center justify-between gap-3 hover:border-blue-600/40 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs text-main block truncate font-medium">
                      {proker.title}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      STATUS:{" "}
                      <span
                        className={
                          proker.status === "completed"
                            ? "text-emerald-400"
                            : proker.status === "ongoing"
                            ? "text-blue-400"
                            : "text-amber-400"
                        }
                      >
                        {proker.status.toUpperCase()}
                      </span>
                    </span>
                  </div>

                  <Link
                    href={`/proker#${proker.slug}`}
                    className="shrink-0 p-1.5 text-muted hover:text-main border border-hairline hover:border-white/20 bg-canvas/80 rounded-xs transition-colors"
                    title="Lihat di Katalog Proker"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Bidang Fokus (Core Competencies) */}
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-widest text-muted uppercase block border-b border-hairline pb-2">
              BIDANG FOKUS UTAMA
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedNode.focusAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs px-2.5 py-1 bg-surface border border-hairline text-neutral-300 rounded-xs"
                >
                  #{area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="shrink-0 p-6 border-t border-hairline bg-surface/80 flex items-center gap-3">
          <Link
            href="/proker"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors uppercase rounded-xs"
          >
            <span>JELAJAHI KATALOG PROKER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-hairline hover:border-white/30 text-muted hover:text-white font-mono text-xs transition-colors rounded-xs"
          >
            TUTUP
          </button>
        </div>
      </aside>
    </>
  );
}
