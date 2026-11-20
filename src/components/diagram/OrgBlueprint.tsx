"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ORG_NODES, OrgNode, LeaderInfo } from "@/lib/data/organization";
import DivisionDrawer from "./DivisionDrawer";
import { ChevronRight, Users, User } from "lucide-react";

interface OrgBlueprintProps {
  nodes?: OrgNode[];
}

interface PortraitFrameProps {
  image?: string;
  name: string;
  role: string;
  monogram: string;
  isHovered: boolean;
  sizeClass: string;
  sizesAttr: string;
  delayMs?: number;
}

/**
 * Fixed-aspect portrait frame that remains structurally static on idle
 * and reveals the full-color leader portrait with 3D flip + glitch scanline on hover.
 */
function PortraitFrame({
  image,
  name,
  role,
  monogram,
  isHovered,
  sizeClass,
  sizesAttr,
  delayMs = 0,
}: PortraitFrameProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden border bg-canvas transition-colors duration-300 ${sizeClass} ${
        isHovered ? "border-blue-500/80 shadow-[0_0_24px_rgba(37,99,235,0.28)]" : "border-hairline"
      }`}
    >
      {/* Precision corner ticks */}
      <span className="pointer-events-none absolute top-0 left-0 z-30 h-2.5 w-2.5 border-t-2 border-l-2 border-blue-500/60" />
      <span className="pointer-events-none absolute top-0 right-0 z-30 h-2.5 w-2.5 border-t-2 border-r-2 border-blue-500/60" />
      <span className="pointer-events-none absolute bottom-0 left-0 z-30 h-2.5 w-2.5 border-b-2 border-l-2 border-blue-500/60" />
      <span className="pointer-events-none absolute bottom-0 right-0 z-30 h-2.5 w-2.5 border-b-2 border-r-2 border-blue-500/60" />

      {/* Idle State Backdrop (Desktop before hover) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface/60 p-2 text-center"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="relative flex h-11 w-11 items-center justify-center border border-hairline bg-canvas/90 text-blue-400/70">
          <User className="h-5 w-5 stroke-[1.5]" />
        </div>
        <span className="relative font-mono text-[10px] font-semibold tracking-widest text-muted uppercase">
          {monogram}
        </span>
      </div>

      {/* Revealed Full-Color Portrait Layer (always visible on mobile, 3D flip-reveal on desktop hover) */}
      {image && (
        <div
          key={isHovered ? "revealed" : "idle"}
          style={isHovered && delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
          className={`absolute inset-0 z-10 overflow-hidden bg-surface transition-opacity duration-300 ${
            isHovered
              ? "opacity-100 animate-photo-flip-glitch"
              : "opacity-100 md:opacity-0 md:pointer-events-none"
          }`}
        >
          {isHovered && <div className="scanline-sweep" />}

          <div
            className={`relative h-full w-full ${
              isHovered ? "animate-portrait-zoom" : ""
            }`}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes={sizesAttr}
              className="object-cover object-top"
            />
          </div>

          {/* Bottom editorial caption gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-2.5 pt-8 pb-2">
            <div className={isHovered ? "animate-portrait-caption" : ""}>
              <span className="block truncate font-mono text-[9px] font-bold tracking-wider text-blue-400 uppercase">
                {role}
              </span>
              <span className="block truncate font-display text-xs sm:text-sm tracking-tight text-white uppercase">
                {name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface OrgNodeCardProps {
  node: OrgNode;
  tierLabel: string;
  isHovered: boolean;
  onHoverChange: (id: string | null) => void;
  onSelect: (node: OrgNode) => void;
  variant: "presidium" | "bph" | "divisi";
}

function OrgNodeCard({
  node,
  tierLabel,
  isHovered,
  onHoverChange,
  onSelect,
  variant,
}: OrgNodeCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const totalMembers = node.members.reduce((sum, m) => sum + m.count, 0);
  const leaders: LeaderInfo[] =
    node.leaders && node.leaders.length > 0
      ? node.leaders
      : node.leaderImage
        ? [{ name: node.leaderName, role: node.leaderTitle, image: node.leaderImage }]
        : [];

  const isPresidium = variant === "presidium";
  const portraitSize = isPresidium
    ? "w-28 h-36 sm:w-36 sm:h-48 lg:w-40 lg:h-52"
    : variant === "bph"
      ? "w-28 h-36 sm:w-36 sm:h-48"
      : "w-28 h-36 sm:w-32 sm:h-44";

  return (
    <div
      onClick={() => onSelect(node)}
      onMouseEnter={() => onHoverChange(node.id)}
      onMouseLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(node.id)}
      onBlur={() => onHoverChange(null)}
      onMouseMove={handleMouseMove}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(node);
        }
      }}
      className={`group relative cursor-pointer overflow-hidden border bg-surface/90 p-5 sm:p-6 transition-all duration-300 ${
        isPresidium ? "border-2" : ""
      } ${
        isHovered
          ? "border-blue-500 bg-surface shadow-[0_18px_50px_-15px_rgba(37,99,235,0.35)] -translate-y-0.5"
          : "border-hairline hover:border-blue-500/60"
      }`}
    >
      {/* Interactive cursor-following blue spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(37, 99, 235, 0.14), transparent 65%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        {/* Top Metadata Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-2.5 font-mono text-xs">
          <span className="font-bold tracking-wider text-blue-400 uppercase">
            {tierLabel}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] text-muted transition-colors group-hover:text-blue-400">
            RINCIAN{" "}
            <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Main Body: Text on Left (100% stable) + Large Portrait Frame(s) on Right */}
        <div
          className={`flex flex-col sm:flex-row ${
            isPresidium ? "lg:items-center" : "items-start sm:items-stretch"
          } justify-between gap-4 sm:gap-5`}
        >
          <div className="flex min-w-0 flex-1 flex-col justify-between space-y-3">
            <div className="space-y-2">
              <h3
                className={`font-display uppercase tracking-tight text-main transition-colors duration-200 group-hover:text-blue-400 ${
                  isPresidium
                    ? "text-3xl sm:text-4xl leading-none"
                    : variant === "bph"
                      ? "text-2xl sm:text-3xl leading-none"
                      : "text-xl sm:text-2xl leading-tight"
                }`}
              >
                {node.shortTitle}
              </h3>

              <p className="line-clamp-3 font-sans text-xs sm:text-sm leading-relaxed text-secondary">
                {node.shortDesc}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 font-mono text-[11px]">
              <div className="truncate text-main/90">
                <span className="text-muted">PIMPINAN: </span>
                <span className="font-medium">{node.leaderName}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-blue-400/90">
                <Users className="h-3.5 w-3.5" />
                <span>{totalMembers} Anggota Aktif</span>
              </div>
            </div>
          </div>

          {/* Portrait Container(s) */}
          <div
            className={`flex shrink-0 items-center ${
              leaders.length > 1 ? "gap-3" : ""
            } self-center sm:self-auto`}
          >
            {leaders.slice(0, isPresidium ? 2 : 1).map((leader, idx) => (
              <PortraitFrame
                key={`${node.id}-leader-${idx}`}
                image={leader.image}
                name={leader.name}
                role={leader.role}
                monogram={node.code}
                isHovered={isHovered}
                sizeClass={portraitSize}
                sizesAttr="(max-width: 640px) 112px, 160px"
                delayMs={idx * 90}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrgBlueprint({ nodes = ORG_NODES }: OrgBlueprintProps) {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const presidiumNode = nodes.find((n) => n.code === "PRESIDIUM") ?? nodes[0];
  const bphNodes = nodes.filter((n) => n.level === 2);
  const divisiNodes = nodes.filter((n) => n.level === 3);

  const handleOpenDrawer = (node: OrgNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };

  const isBphHovered = bphNodes.some((n) => n.id === hoveredId);
  const isDivisiHovered = divisiNodes.some((n) => n.id === hoveredId);

  return (
    <section className="relative w-full bg-canvas py-12 sm:py-20">
      {/* Decorative Technical Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* ============================================================== */}
        {/* LEVEL 1: PRESIDIUM UTAMA                                      */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <OrgNodeCard
              node={presidiumNode}
              tierLabel="PRESIDIUM UTAMA"
              isHovered={hoveredId === presidiumNode.id}
              onHoverChange={setHoveredId}
              onSelect={handleOpenDrawer}
              variant="presidium"
            />
          </div>

          {/* SVG Circuit Bus: Presidium -> BPH */}
          <div className="relative hidden w-full max-w-4xl md:block" aria-hidden="true">
            <svg
              viewBox="0 0 800 56"
              fill="none"
              className="h-14 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M400 0 V28 H200 V56 M400 28 H600 V56"
                stroke={
                  hoveredId === presidiumNode.id || isBphHovered
                    ? "#3b82f6"
                    : "rgba(255,255,255,0.16)"
                }
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <circle cx="400" cy="28" r="4" fill="#2563eb" />
              <circle cx="200" cy="52" r="4" fill="#2563eb" />
              <circle cx="600" cy="52" r="4" fill="#2563eb" />
            </svg>
          </div>
          <div className="relative h-8 w-0.5 bg-gradient-to-b from-blue-600 to-white/20 md:hidden">
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* LEVEL 2: BADAN PENGURUS HARIAN (BPH)                           */}
        {/* ============================================================== */}
        <div className="relative mx-auto max-w-5xl pb-6">
          <div className="mb-4 text-center font-mono text-xs font-semibold tracking-wider text-blue-400 uppercase">
            BADAN PENGURUS HARIAN (BPH)
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {bphNodes.map((node) => (
              <OrgNodeCard
                key={node.id}
                node={node}
                tierLabel="BPH"
                isHovered={hoveredId === node.id}
                onHoverChange={setHoveredId}
                onSelect={handleOpenDrawer}
                variant="bph"
              />
            ))}
          </div>

          {/* SVG Circuit Bus: BPH -> Divisi Pelaksana */}
          <div className="relative hidden w-full lg:block" aria-hidden="true">
            <svg
              viewBox="0 0 1000 56"
              fill="none"
              className="h-14 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M500 0 V28 M165 28 H835 M165 28 V56 M500 28 V56 M835 28 V56"
                stroke={
                  isBphHovered || isDivisiHovered
                    ? "#3b82f6"
                    : "rgba(255,255,255,0.16)"
                }
                strokeWidth="2"
                className="transition-colors duration-300"
              />
              <circle cx="500" cy="28" r="4" fill="#2563eb" />
              <circle cx="165" cy="52" r="4" fill="#2563eb" />
              <circle cx="500" cy="52" r="4" fill="#2563eb" />
              <circle cx="835" cy="52" r="4" fill="#2563eb" />
            </svg>
          </div>
          <div className="relative mx-auto mt-4 h-8 w-0.5 bg-gradient-to-b from-white/20 to-blue-600 lg:hidden">
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* LEVEL 3: 6 DIVISI PELAKSANA                                    */}
        {/* ============================================================== */}
        <div className="relative pt-2">
          <div className="mb-6 text-center font-mono text-xs font-semibold tracking-wider text-blue-400 uppercase">
            DIVISI PELAKSANA
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {divisiNodes.map((node) => (
              <OrgNodeCard
                key={node.id}
                node={node}
                tierLabel="DIVISI"
                isHovered={hoveredId === node.id}
                onHoverChange={setHoveredId}
                onSelect={handleOpenDrawer}
                variant="divisi"
              />
            ))}
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
