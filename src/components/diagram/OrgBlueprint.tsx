"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ORG_NODES, OrgNode } from "@/lib/data/organization";
import DivisionDrawer from "./DivisionDrawer";
import { ChevronRight } from "lucide-react";

export default function OrgBlueprint() {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Pisahkan nodes berdasarkan level hierarki
  const presidiumNode = ORG_NODES.find((n) => n.code === "PRESIDIUM")!;
  const bphNodes = ORG_NODES.filter((n) => n.level === 2);
  const divisiNodes = ORG_NODES.filter((n) => n.level === 3);

  const handleOpenDrawer = (node: OrgNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  return (
    <section className="relative w-full py-12 sm:py-20 bg-canvas">
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
        {/* ============================================================== */}
        {/* LEVEL 1: PRESIDIUM UTAMA                                      */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl">
            <div
              onClick={() => handleOpenDrawer(presidiumNode)}
              onMouseEnter={() => setHoveredId(presidiumNode.id)}
              onMouseLeave={() => setHoveredId(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(presidiumNode)}
              className={`group relative cursor-pointer bg-surface/90 hover:bg-surface border-2 transition-all duration-300 p-5 sm:p-6 rounded-xs shadow-lg ${
                hoveredId === presidiumNode.id
                  ? "border-blue-500 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/50"
                  : "border-hairline hover:border-blue-500/60"
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-hairline font-mono text-xs">
                <span className="text-blue-400 font-bold uppercase tracking-wider">
                  PRESIDIUM UTAMA
                </span>
                <span className="text-muted text-[11px] group-hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">
                  RINCIAN <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              <div className="py-3">
                <h3 className="font-display text-2xl sm:text-3xl text-main uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                  KETUA &amp; WAKIL KETUA
                </h3>
              </div>

              {/* Reveal Foto Kahim & Wakahim dengan Animasi 3D Flip & Glitch */}
              {hoveredId === presidiumNode.id && (
                <div className="mt-1 p-3 bg-black/60 border border-blue-500/50 rounded-xs relative overflow-hidden transition-all duration-300">
                  <div className="scanline-sweep" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {presidiumNode.leaders?.map((leader, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 bg-surface/80 border border-hairline rounded-xs"
                      >
                        <div className="relative w-14 h-14 shrink-0 rounded-xs overflow-hidden bg-black/90 border border-blue-500/60 animate-photo-flip-glitch">
                          <Image
                            src={leader.image}
                            alt={leader.name}
                            fill
                            sizes="56px"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-blue-400 block uppercase font-bold truncate">
                            {leader.role}
                          </span>
                          <h4 className="font-display text-sm text-white uppercase truncate">
                            {leader.name}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Garis Penghubung Presidium ke BPH */}
          <div className="w-0.5 h-10 bg-linear-to-b from-blue-600 to-white/20 relative">
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* LEVEL 2: BADAN PENGURUS HARIAN (BPH)                           */}
        {/* ============================================================== */}
        <div className="relative pt-2 pb-8 max-w-4xl mx-auto">
          <div className="text-center font-mono text-xs text-blue-400 tracking-wider uppercase mb-4 font-semibold">
            BADAN PENGURUS HARIAN (BPH)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bphNodes.map((node) => {
              const isHovered = hoveredId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => handleOpenDrawer(node)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(node)}
                  className={`group relative cursor-pointer bg-surface/90 hover:bg-surface border transition-all duration-300 p-5 rounded-xs shadow-md ${
                    isHovered
                      ? "border-blue-500 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/50"
                      : "border-hairline hover:border-blue-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-hairline font-mono text-xs">
                    <span className="text-blue-400 font-bold uppercase">
                      BPH
                    </span>
                    <span className="text-muted text-[11px] group-hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">
                      RINCIAN <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className="py-3">
                    <h4 className="font-display text-xl sm:text-2xl text-main uppercase group-hover:text-blue-400 transition-colors">
                      {node.shortTitle}
                    </h4>
                  </div>

                  {/* Reveal Foto Pengurus BPH dengan Animasi 3D Flip & Glitch */}
                  {isHovered && (
                    <div className="mt-1 p-3 bg-black/60 border border-blue-500/50 rounded-xs relative overflow-hidden transition-all duration-300">
                      <div className="scanline-sweep" />
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 shrink-0 rounded-xs overflow-hidden bg-black/90 border border-blue-500/60 animate-photo-flip-glitch">
                          {node.leaderImage && (
                            <Image
                              src={node.leaderImage}
                              alt={node.leaderName}
                              fill
                              sizes="56px"
                              className="object-cover object-top"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-blue-400 block uppercase font-bold">
                            {node.leaderTitle}
                          </span>
                          <h4 className="font-display text-base text-white uppercase truncate">
                            {node.leaderName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Garis Penghubung BPH ke Divisi */}
          <div className="w-0.5 h-10 bg-linear-to-b from-white/20 to-blue-600 mx-auto relative mt-4">
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* LEVEL 3: 6 DIVISI PELAKSANA                                    */}
        {/* ============================================================== */}
        <div className="relative pt-2">
          <div className="text-center font-mono text-xs text-blue-400 tracking-wider uppercase mb-6 font-semibold">
            DIVISI PELAKSANA
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {divisiNodes.map((node) => {
              const isHovered = hoveredId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => handleOpenDrawer(node)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleOpenDrawer(node)}
                  className={`group relative cursor-pointer bg-surface/90 hover:bg-surface border transition-all duration-300 p-5 rounded-xs shadow-md ${
                    isHovered
                      ? "border-blue-500 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/50"
                      : "border-hairline hover:border-blue-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-hairline font-mono text-xs">
                    <span className="text-blue-400 font-bold uppercase">
                      DIVISI
                    </span>
                    <span className="text-muted text-[11px] group-hover:text-blue-400 transition-colors inline-flex items-center gap-0.5">
                      RINCIAN <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <div className="py-3">
                    <h4 className="font-display text-lg sm:text-xl text-main uppercase leading-tight group-hover:text-blue-400 transition-colors">
                      {node.shortTitle}
                    </h4>
                  </div>

                  {/* Reveal Foto Koordinator Divisi dengan Animasi 3D Flip & Glitch */}
                  {isHovered && (
                    <div className="mt-1 p-3 bg-black/60 border border-blue-500/50 rounded-xs relative overflow-hidden transition-all duration-300">
                      <div className="scanline-sweep" />
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 shrink-0 rounded-xs overflow-hidden bg-black/90 border border-blue-500/60 animate-photo-flip-glitch">
                          {node.leaderImage && (
                            <Image
                              src={node.leaderImage}
                              alt={node.leaderName}
                              fill
                              sizes="56px"
                              className="object-cover object-top"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-blue-400 block uppercase font-bold">
                            KOORDINATOR
                          </span>
                          <h4 className="font-display text-base text-white uppercase truncate">
                            {node.leaderName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
