"use client";

import React, { useState } from "react";
import { ORG_NODES, OrgNode } from "@/lib/data/organization";
import DivisionDrawer from "./DivisionDrawer";
import { Cpu, Layers, ChevronRight, CornerDownRight, ShieldCheck, Activity } from "lucide-react";

export default function OrgBlueprint() {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"blueprint" | "matrix">("blueprint");

  // Pisahkan nodes berdasarkan level hierarki
  const presidiumNode = ORG_NODES.find((n) => n.code === "PRESIDIUM")!;
  const bphNodes = ORG_NODES.filter((n) => n.level === 2);
  const divisiNodes = ORG_NODES.filter((n) => n.level === 3);

  const handleOpenDrawer = (node: OrgNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 border-t border-hairline bg-canvas">
      {/* Decorative Technical Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        {/* Section Header & Blueprint Specification Dossier */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-hairline">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-blue-500 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>SCHEMA ID // ARCH-ORG-2026 // NODE TOPOLOGY</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-main tracking-tight uppercase">
              ARSITEKTUR & STRUKTUR ORGANISASI
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl font-sans">
              Diagram hierarki operasional HIMATIKA Universitas Trilogi. Dirancang berbasis sistem node teknis tanpa visualisasi portrait individual untuk mengedepankan integritas tupoksi dan fungsi sistemik.
            </p>
          </div>

          {/* View Mode Toggle & Counter */}
          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="hidden sm:flex items-center gap-1 p-1 bg-surface border border-hairline rounded-xs">
              <button
                onClick={() => setActiveTab("blueprint")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs transition-colors ${
                  activeTab === "blueprint"
                    ? "bg-blue-600 text-white font-medium"
                    : "text-muted hover:text-white"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>CIRCUIT BUS</span>
              </button>
              <button
                onClick={() => setActiveTab("matrix")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs transition-colors ${
                  activeTab === "matrix"
                    ? "bg-blue-600 text-white font-medium"
                    : "text-muted hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>GRID MATRIX</span>
              </button>
            </div>

            <div className="px-3 py-2 bg-surface/60 border border-hairline text-muted rounded-xs flex items-center gap-2">
              <span className="text-white font-bold">{ORG_NODES.length}</span>
              <span>TOTAL NODES</span>
            </div>
          </div>
        </div>

        {/* User Interaction Banner */}
        <div className="my-6 px-4 py-3 bg-blue-950/20 border border-blue-900/40 rounded-xs flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-blue-300">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400 shrink-0" />
            <span>INTERAKSI BLUEPRINT: Klik pada setiap modul node organisasi untuk membuka panel inspeksi rincian tugas (TUPOKSI), kepanitiaan, & program kerja.</span>
          </div>
          <span className="text-[11px] text-muted hidden lg:inline">ESC / KLIK LUAR UNTUK MENUTUP DRAWER</span>
        </div>

        {/* VIEW 1: CIRCUIT BUS SCHEMATIC (DESKTOP & RESPONSIVE TREE) */}
        {activeTab === "blueprint" ? (
          <div className="py-8">
            {/* LEVEL 1: PRESIDIUM UTAMA (ROOT NODE) */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => handleOpenDrawer(presidiumNode)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(presidiumNode)}
                className="group relative w-full max-w-xl cursor-pointer bg-surface/90 hover:bg-surface border-2 border-hairline hover:border-blue-600 transition-all duration-300 p-5 sm:p-6 rounded-xs shadow-lg hover:shadow-blue-900/20"
              >
                {/* Crosshairs corner accents */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500" />

                <div className="flex items-center justify-between font-mono text-xs pb-3 border-b border-hairline">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>LEVEL 01 // {presidiumNode.levelName}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] rounded-xs font-bold">
                    ROOT AUTHORITY
                  </span>
                </div>

                <div className="py-3">
                  <h3 className="font-display text-2xl sm:text-3xl text-main tracking-tight group-hover:text-blue-400 transition-colors uppercase">
                    {presidiumNode.shortTitle}
                  </h3>
                  <p className="font-mono text-xs text-muted mt-1">
                    {presidiumNode.name}
                  </p>
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-muted/70 pt-3 border-t border-hairline/60">
                  <span className="text-[11px]">3 AGENDA STRATEGIS AKTIF</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-[11px] font-bold">
                    INSPEKSI DETAIL <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Central Trunk Line connecting Level 1 to Level 2 */}
              <div className="w-0.5 h-10 bg-linear-to-b from-blue-600 to-white/20 relative">
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* LEVEL 2: BADAN PENGURUS HARIAN (BPH) */}
            <div className="relative pt-2 pb-8">
              {/* Bus Horizontal Header Line (Desktop) */}
              <div className="hidden md:block relative w-full max-w-2xl mx-auto h-0.5 bg-white/20">
                <span className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-2 bg-canvas font-mono text-[10px] text-muted tracking-widest uppercase">
                  BPH BACKBONE BUS
                </span>
              </div>

              {/* Grid 2 Kolom untuk Sekretaris & Bendahara */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
                {bphNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => handleOpenDrawer(node)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(node)}
                    className="group relative cursor-pointer bg-surface/80 hover:bg-surface border border-hairline hover:border-blue-500 transition-all duration-300 p-5 rounded-xs hover:shadow-lg hover:shadow-blue-900/10"
                  >
                    <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-hairline">
                      <span className="text-blue-400 font-medium">
                        LEVEL 02 // {node.code}
                      </span>
                      <span className="text-[10px] text-muted font-mono">
                        {node.leaderTitle}
                      </span>
                    </div>

                    <div className="py-2.5">
                      <h4 className="font-display text-xl sm:text-2xl text-main group-hover:text-blue-400 transition-colors uppercase">
                        {node.shortTitle}
                      </h4>
                      <p className="text-xs text-muted font-sans line-clamp-2 mt-1">
                        {node.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs text-muted/80 pt-2 border-t border-hairline/60">
                      <span className="text-[11px] text-blue-400/80">
                        {node.activeProkers.length} PROGRAM KERJA
                      </span>
                      <span className="text-white group-hover:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-[11px]">
                        BUKA TUPOKSI <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vertical connector trunk from BPH down to Divisi Pelaksana */}
              <div className="w-0.5 h-12 bg-linear-to-b from-white/20 to-blue-600 mx-auto relative mt-4">
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* LEVEL 3: 6 DIVISI PELAKSANA (OPERATIONAL SECTOR) */}
            <div className="relative pt-2">
              {/* Bus Distribution Line for 6 Divisions (Desktop) */}
              <div className="hidden lg:block relative w-full max-w-5xl mx-auto h-0.5 bg-white/20 mb-8">
                <span className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-canvas font-mono text-[10px] text-blue-400 tracking-widest uppercase">
                  OPERATIONAL DISTRIBUTION TRUNK // 6 SECTORS
                </span>
              </div>

              {/* Grid 6 Divisi Pelaksana */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {divisiNodes.map((node, index) => (
                  <div
                    key={node.id}
                    onClick={() => handleOpenDrawer(node)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(node)}
                    className="group relative cursor-pointer bg-surface/70 hover:bg-surface border border-hairline hover:border-blue-500 transition-all duration-300 p-5 rounded-xs hover:shadow-md hover:shadow-blue-900/10 flex flex-col justify-between"
                  >
                    {/* Top Node Bar */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-hairline">
                        <span className="text-blue-400 font-bold">
                          DIV_0{index + 1} // {node.code}
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          LEVEL 03
                        </span>
                      </div>

                      <div className="py-3">
                        <h4 className="font-display text-lg sm:text-xl text-main group-hover:text-blue-400 transition-colors uppercase leading-tight">
                          {node.shortTitle}
                        </h4>
                        <p className="text-xs text-muted font-sans mt-2 line-clamp-3 leading-relaxed">
                          {node.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata & CTA */}
                    <div className="pt-3 border-t border-hairline/60">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {node.focusAreas.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 bg-black/40 border border-hairline text-neutral-400 rounded-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-muted">
                          {node.activeProkers.length} Proker Resmi
                        </span>
                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                          INSPEKSI <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: GRID MATRIX VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {ORG_NODES.map((node) => (
              <div
                key={node.id}
                onClick={() => handleOpenDrawer(node)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(node)}
                className="group cursor-pointer bg-surface/80 hover:bg-surface border border-hairline hover:border-blue-500 transition-all duration-300 p-6 rounded-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs pb-3 border-b border-hairline">
                    <span className="text-blue-400 font-semibold uppercase">
                      {node.levelName}
                    </span>
                    <span className="font-mono text-[11px] text-muted">
                      {node.code}
                    </span>
                  </div>

                  <div className="py-4">
                    <h3 className="font-display text-2xl text-main group-hover:text-blue-400 transition-colors uppercase">
                      {node.shortTitle}
                    </h3>
                    <p className="font-mono text-xs text-muted/80 mt-1">
                      {node.name}
                    </p>
                    <p className="text-xs text-neutral-300 font-sans mt-3 line-clamp-3 leading-relaxed">
                      {node.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline/60">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-muted text-[11px]">
                      {node.activeProkers.length} PROGRAM KERJA
                    </span>
                    <span className="text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold text-[11px]">
                      BUKA PANEL <CornerDownRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Inspection Panel Drawer */}
      <DivisionDrawer
        isOpen={drawerOpen}
        selectedNode={selectedNode}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  );
}
