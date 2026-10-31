"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { DIVISION_FILTER_OPTIONS, ProkerStatus } from "@/lib/data/proker";

interface ProkerFilterBarProps {
  totalCount: number;
  filteredCount: number;
  statusFilter: string;
  divisionFilter: string;
  searchQuery: string;
  onStatusChange: (status: string) => void;
  onDivisionChange: (division: string) => void;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "SEMUA", value: "all" },
  { label: "AKAN DATANG", value: "upcoming" },
  { label: "SEDANG BERJALAN", value: "ongoing" },
  { label: "SELESAI", value: "completed" },
];

export function ProkerFilterBar({
  totalCount,
  filteredCount,
  statusFilter,
  divisionFilter,
  searchQuery,
  onStatusChange,
  onDivisionChange,
  onSearchChange,
  onResetFilters,
}: ProkerFilterBarProps) {
  const isFiltered =
    statusFilter !== "all" || divisionFilter !== "ALL" || searchQuery.trim() !== "";

  return (
    <div className="sticky top-16 md:top-20 z-30 bg-[#050505]/95 backdrop-blur-xl border-y border-white/10 py-4 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Control Row: Search + Status Buttons */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {STATUS_OPTIONS.map((opt) => {
              const active = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onStatusChange(opt.value)}
                  className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all rounded ${
                    active
                      ? "bg-blue-600 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "bg-[#0c0c0e] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Reset Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari program kerja..."
                className="w-full bg-[#0c0c0e] border border-white/10 rounded py-1.5 pl-9 pr-8 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white bg-[#0c0c0e] border border-white/10 hover:border-white/20 rounded whitespace-nowrap flex items-center gap-1.5 transition-colors"
                title="Reset semua filter"
              >
                <X className="w-3 h-3 text-red-400" />
                RESET
              </button>
            )}
          </div>
        </div>

        {/* Bottom Control Row: Division Filter Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500 font-mono shrink-0 pr-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">BIDANG:</span>
          </div>

          {DIVISION_FILTER_OPTIONS.map((div) => {
            const active = divisionFilter === div.value;
            return (
              <button
                key={div.value}
                type="button"
                onClick={() => onDivisionChange(div.value)}
                className={`px-3 py-1 font-mono uppercase whitespace-nowrap text-[11px] tracking-wider rounded transition-all shrink-0 ${
                  active
                    ? div.value === "KOLABORASI"
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500 font-semibold"
                      : "bg-white text-black font-semibold"
                    : "bg-[#0c0c0e] text-zinc-400 hover:text-zinc-200 border border-white/5 hover:border-white/20"
                }`}
              >
                {div.label}
              </button>
            );
          })}
        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1 border-t border-white/5">
          <span>
            MENAMPILKAN{" "}
            <span className="text-white font-medium">{filteredCount}</span> DARI{" "}
            <span className="text-zinc-400">{totalCount}</span> PROGRAM KERJA
          </span>
          {isFiltered && (
            <span className="text-blue-400">
              FILTER AKTIF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
