"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ORG_NODES, OrgNode, LeaderInfo } from "@/lib/data/organization";
import DivisionDrawer from "./DivisionDrawer";
import { ArrowUpRight, Users } from "lucide-react";

interface OrgBlueprintProps {
  nodes?: OrgNode[];
}

interface PortraitFrameProps {
  image?: string;
  name: string;
  role: string;
  fallbackCode: string;
  isHovered: boolean;
  sizeClass: string;
  sizesAttr: string;
  delayMs?: number;
}

function getLeaderInitials(name: string, fallbackCode: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  if (words.length === 1 && words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0]?.[0] || fallbackCode.slice(0, 2)).toUpperCase();
}

function getIdleRoleLabel(role: string): string {
  const trimmed = role.trim();
  if (!trimmed) return "PENGURUS";
  if (/^wakil ketua\b/i.test(trimmed)) return "WAKIL KETUA";

  const coordShort = trimmed.replace(/^koordinator\s+/i, "KOORD. ");
  if (coordShort.length <= 16) {
    return coordShort.toUpperCase();
  }

  const primaryWord = trimmed.replace(/^koordinator\s+/i, "").trim().split(/\s+/)[0];
  return primaryWord ? `KOORD. ${primaryWord}`.toUpperCase() : "KOORDINATOR";
}

/**
 * Minimalist architectural portrait frame: clean dark studio plate with subtle
 * corner viewfinder hairlines and monogram watermark when idle on desktop,
 * revealing the full-color portrait with 3D flip + glitch scanline on hover/focus.
 */
function PortraitFrame({
  image,
  name,
  role,
  fallbackCode,
  isHovered,
  sizeClass,
  sizesAttr,
  delayMs = 0,
}: PortraitFrameProps) {
  const initials = getLeaderInitials(name, fallbackCode);
  const idleRole = getIdleRoleLabel(role);

  return (
    <div
      className={`relative shrink-0 overflow-hidden border bg-[#060608] transition-all duration-300 ${sizeClass} ${
        isHovered
          ? "border-blue-500/80 shadow-[0_0_24px_rgba(37,99,235,0.22)]"
          : "border-white/[0.08] group-hover:border-blue-500/40"
      }`}
    >
      {/* Minimalist idle studio plate (Desktop before hover) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-2.5 text-center"
        aria-hidden="true"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.11), transparent 72%)",
          }}
        />

        {/* Delicate viewfinder corner hairlines */}
        <span className="pointer-events-none absolute top-1.5 left-1.5 h-1.5 w-1.5 border-t border-l border-white/20" />
        <span className="pointer-events-none absolute top-1.5 right-1.5 h-1.5 w-1.5 border-t border-r border-white/20" />
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-1.5 w-1.5 border-b border-l border-white/20" />
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-1.5 w-1.5 border-b border-r border-white/20" />

        <div className="relative flex -translate-y-1.5 flex-col items-center">
          <span className="font-display text-3xl sm:text-4xl tracking-[0.06em] text-white/[0.15] leading-none select-none">
            {initials}
          </span>
          <span className="mt-2.5 h-px w-5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />
        </div>

        <span className="absolute inset-x-3 bottom-2.5 truncate font-mono text-[8px] font-medium tracking-[0.05em] text-zinc-400/80 uppercase">
          {idleRole}
        </span>
      </div>

      {/* Full-color portrait layer (always visible on mobile, 3D flip-reveal on desktop hover) */}
      {image && (
        <div
          key={isHovered ? "revealed" : "idle"}
          style={
            isHovered && delayMs > 0
              ? { animationDelay: `${delayMs}ms` }
              : undefined
          }
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent px-2.5 pt-7 pb-2">
            <div className={isHovered ? "animate-portrait-caption" : ""}>
              <span className="block truncate font-mono text-[9px] font-semibold tracking-wider text-blue-400 uppercase">
                {role}
              </span>
              <span className="block truncate font-display text-xs tracking-tight text-white uppercase">
                {name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CircuitConnectorProps {
  label: string;
  active: boolean;
  branches: 2 | 3;
  maxWidthClass?: string;
}

function SvgBusLines({
  branches,
  strokeColor,
  nodeFill,
}: {
  branches: 2 | 3;
  strokeColor: string;
  nodeFill: string;
}) {
  return (
    <svg
      viewBox="0 0 1000 72"
      fill="none"
      className="h-[72px] w-full"
      preserveAspectRatio="none"
    >
      {branches === 2 ? (
        <>
          <path
            d="M500 0 V36 M250 36 H750 M250 36 V72 M750 36 V72"
            stroke={strokeColor}
            strokeWidth="1.25"
            className="transition-colors duration-300"
          />
          <circle cx="500" cy="36" r="3" fill={nodeFill} />
          <circle cx="250" cy="69" r="2.5" fill={nodeFill} />
          <circle cx="750" cy="69" r="2.5" fill={nodeFill} />
        </>
      ) : (
        <>
          <path
            d="M500 0 V36 M166.7 36 H833.3 M166.7 36 V72 M500 36 V72 M833.3 36 V72"
            stroke={strokeColor}
            strokeWidth="1.25"
            className="transition-colors duration-300"
          />
          <circle cx="500" cy="36" r="3" fill={nodeFill} />
          <circle cx="166.7" cy="69" r="2.5" fill={nodeFill} />
          <circle cx="500" cy="69" r="2.5" fill={nodeFill} />
          <circle cx="833.3" cy="69" r="2.5" fill={nodeFill} />
        </>
      )}
    </svg>
  );
}

/**
 * Hairline SVG circuit bus connecting organizational tiers with breakpoint-matched drops.
 */
function CircuitConnector({
  label,
  active,
  branches,
  maxWidthClass = "max-w-full",
}: CircuitConnectorProps) {
  const strokeColor = active ? "#3b82f6" : "rgba(255,255,255,0.14)";
  const nodeFill = active ? "#3b82f6" : "#2563eb";
  const badgeClass = `px-3.5 py-1 border bg-canvas font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
    active
      ? "border-blue-500/60 text-blue-400"
      : "border-white/10 text-blue-400/90"
  }`;

  return (
    <div className={`relative mx-auto w-full ${maxWidthClass}`}>
      <div
        className={`relative hidden ${
          branches === 3 ? "xl:block" : "md:block"
        }`}
        aria-hidden="true"
      >
        <SvgBusLines
          branches={branches}
          strokeColor={strokeColor}
          nodeFill={nodeFill}
        />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <span className={badgeClass}>{label}</span>
        </div>
      </div>

      {branches === 3 && (
        <div className="relative hidden md:block xl:hidden" aria-hidden="true">
          <SvgBusLines
            branches={2}
            strokeColor={strokeColor}
            nodeFill={nodeFill}
          />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
            <span className={badgeClass}>{label}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center py-2 md:hidden">
        <div className="h-5 w-px bg-gradient-to-b from-blue-500/60 to-white/15" />
        <span className={badgeClass}>{label}</span>
        <div className="h-5 w-px bg-gradient-to-b from-white/15 to-blue-500/60" />
      </div>
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
    ? "w-28 h-36 sm:w-36 sm:h-48"
    : variant === "bph"
      ? "w-24 h-32 sm:w-32 sm:h-44"
      : "w-24 h-32 sm:w-28 sm:h-40";

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
      className={`group relative h-full cursor-pointer overflow-hidden border bg-surface/80 p-5 sm:p-6 transition-all duration-300 ${
        isPresidium ? "border-t-2 border-t-blue-600/80" : ""
      } ${
        isHovered
          ? "border-blue-500/80 bg-surface shadow-[0_14px_40px_-18px_rgba(37,99,235,0.4)] -translate-y-0.5"
          : "border-white/[0.08] hover:border-blue-500/50"
      }`}
    >
      {/* Subtle interactive blue spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(37, 99, 235, 0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between gap-4">
        {/* Minimalist Top Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 font-mono text-[11px]">
          <span className="tracking-[0.18em] text-blue-400 uppercase">
            {isPresidium ? "PIMPINAN HIMPUNAN" : variant === "bph" ? tierLabel : node.code}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-400" />
        </div>

        {/* Stable Typographic Info + Portrait Frame(s) */}
        <div
          className={`flex flex-col sm:flex-row ${
            isPresidium ? "sm:items-center" : "items-start sm:items-stretch"
          } justify-between gap-4 sm:gap-5 flex-1`}
        >
          <div className="flex min-w-0 flex-1 flex-col justify-between space-y-3">
            <div className="space-y-1.5">
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

              <p className="line-clamp-2 font-sans text-xs sm:text-sm leading-relaxed text-secondary">
                {node.shortDesc}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-white/[0.06] font-mono text-[11px]">
              <span className="truncate text-main/90 font-medium max-w-full">
                {node.leaderName}
              </span>
              <span className="inline-flex items-center gap-1 text-muted shrink-0">
                <Users className="h-3 w-3 text-blue-400/80" />
                <span>{totalMembers}</span>
              </span>
            </div>
          </div>

          <div
            className={`flex shrink-0 items-center ${
              leaders.length > 1 ? "gap-2.5" : ""
            } self-center sm:self-auto`}
          >
            {leaders.slice(0, isPresidium ? 2 : 1).map((leader, idx) => (
              <PortraitFrame
                key={`${node.id}-leader-${idx}`}
                image={leader.image}
                name={leader.name}
                role={leader.role}
                fallbackCode={node.code.replace("BPH_", "")}
                isHovered={isHovered}
                sizeClass={portraitSize}
                sizesAttr="(max-width: 640px) 112px, 144px"
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
    <section className="relative w-full bg-canvas py-10 sm:py-16">
      {/* Subtle architectural dot blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* LEVEL 1: PRESIDIUM UTAMA */}
        <div className="mx-auto w-full max-w-3xl">
          <OrgNodeCard
            node={presidiumNode}
            tierLabel="TINGKAT 01"
            isHovered={hoveredId === presidiumNode.id}
            onHoverChange={setHoveredId}
            onSelect={handleOpenDrawer}
            variant="presidium"
          />
        </div>

        {/* ALIGNED CIRCUIT BUS: PRESIDIUM -> BPH */}
        <CircuitConnector
          label="BADAN PENGURUS HARIAN"
          active={hoveredId === presidiumNode.id || isBphHovered}
          branches={2}
          maxWidthClass="max-w-4xl"
        />

        {/* LEVEL 2: BADAN PENGURUS HARIAN (BPH) */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
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

        {/* ALIGNED CIRCUIT BUS: BPH -> DIVISI PELAKSANA */}
        <CircuitConnector
          label="DIVISI PELAKSANA"
          active={isBphHovered || isDivisiHovered}
          branches={3}
        />

        {/* LEVEL 3: DIVISI PELAKSANA */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

      {/* Slide-over Inspection Panel Drawer */}
      <DivisionDrawer
        isOpen={drawerOpen}
        selectedNode={selectedNode}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  );
}
