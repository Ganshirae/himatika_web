"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProkerItem } from "@/lib/data/proker";
import { ProkerFilterBar } from "./ProkerFilterBar";
import { ProkerCard } from "./ProkerCard";
import { Sparkles, Calendar, Layers, SearchX } from "lucide-react";
import Link from "next/link";

interface ProkerCatalogClientProps {
  initialProkers: ProkerItem[];
}

export function ProkerCatalogClient({ initialProkers }: ProkerCatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL search params
  const paramStatus = searchParams.get("status") || "all";
  const paramDivision = searchParams.get("division") || "ALL";
  const paramQuery = searchParams.get("q") || "";

  const [statusFilter, setStatusFilter] = useState<string>(paramStatus);
  const [divisionFilter, setDivisionFilter] = useState<string>(paramDivision);
  const [searchQuery, setSearchQuery] = useState<string>(paramQuery);

  // Sync state with URL changes (e.g. browser back/forward)
  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "all");
    setDivisionFilter(searchParams.get("division") || "ALL");
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Update URL helper
  const updateUrl = (status: string, division: string, query: string) => {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (division && division !== "ALL") params.set("division", division);
    if (query && query.trim() !== "") params.set("q", query.trim());

    const qs = params.toString();
    const newPath = qs ? `${pathname}?${qs}` : pathname;
    router.replace(newPath, { scroll: false });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    updateUrl(newStatus, divisionFilter, searchQuery);
  };

  const handleDivisionChange = (newDivision: string) => {
    setDivisionFilter(newDivision);
    updateUrl(statusFilter, newDivision, searchQuery);
  };

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    updateUrl(statusFilter, divisionFilter, newQuery);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setDivisionFilter("ALL");
    setSearchQuery("");
    router.replace(pathname, { scroll: false });
  };

  // Filtered proker computation
  const filteredProkers = useMemo(() => {
    return initialProkers.filter((proker) => {
      // Status filter
      if (statusFilter !== "all" && proker.status !== statusFilter) {
        return false;
      }

      // Division filter
      if (divisionFilter !== "ALL") {
        if (divisionFilter === "KOLABORASI") {
          if (proker.divisionCode !== "KOLABORASI") return false;
        } else {
          if (proker.divisionCode !== divisionFilter) return false;
        }
      }

      // Search Query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = proker.title.toLowerCase().includes(query);
        const matchDesc = proker.shortDesc.toLowerCase().includes(query);
        const matchDiv = proker.divisionName.toLowerCase().includes(query);
        const matchDate = proker.executionDate.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchDiv && !matchDate) return false;
      }

      return true;
    });
  }, [initialProkers, statusFilter, divisionFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f6]">
      {/* Editorial Header Section */}
      <section className="pt-28 md:pt-36 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AGENDA KEGIATAN 2026/2027
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-white mb-6">
            PROGRAM KERJA <span className="text-blue-500">& AGENDA</span>
          </h1>

          <p className="max-w-3xl text-zinc-400 font-sans text-base sm:text-lg leading-relaxed mb-8">
            Daftar lengkap program kerja, kegiatan kaderisasi, lokakarya teknologi, dan agenda kemahasiswaan HIMATIKA Universitas Trilogi. Dirancang untuk mengasah potensi, mempererat kebersamaan, dan memberi dampak nyata.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5 font-mono text-xs">
            <div className="p-3 bg-[#0c0c0e] border border-white/5 rounded">
              <span className="text-zinc-500 block mb-1">TOTAL PROGRAM</span>
              <span className="text-lg font-display text-white">{initialProkers.length} AGENDA</span>
            </div>
            <div className="p-3 bg-[#0c0c0e] border border-white/5 rounded">
              <span className="text-zinc-500 block mb-1">KOLABORATIF</span>
              <span className="text-lg font-display text-blue-400">
                {initialProkers.filter((p) => p.divisionCode === "KOLABORASI").length} PROGRAM
              </span>
            </div>
            <div className="p-3 bg-[#0c0c0e] border border-white/5 rounded">
              <span className="text-zinc-500 block mb-1">AKAN DATANG</span>
              <span className="text-lg font-display text-amber-400">
                {initialProkers.filter((p) => p.status === "upcoming").length} SEGERA
              </span>
            </div>
            <div className="p-3 bg-[#0c0c0e] border border-white/5 rounded">
              <span className="text-zinc-500 block mb-1">SUDAH SELESAI</span>
              <span className="text-lg font-display text-emerald-400">
                {initialProkers.filter((p) => p.status === "completed").length} SELESAI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <ProkerFilterBar
        totalCount={initialProkers.length}
        filteredCount={filteredProkers.length}
        statusFilter={statusFilter}
        divisionFilter={divisionFilter}
        searchQuery={searchQuery}
        onStatusChange={handleStatusChange}
        onDivisionChange={handleDivisionChange}
        onSearchChange={handleSearchChange}
        onResetFilters={handleResetFilters}
      />

      {/* Card Grid Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredProkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredProkers.map((proker) => (
              <ProkerCard key={proker.id} proker={proker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 border border-dashed border-white/10 rounded-lg bg-[#0c0c0e]">
            <SearchX className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="font-display text-2xl uppercase text-white mb-2">
              PROGRAM KERJA TIDAK DITEMUKAN
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
              Belum ada program kerja yang cocok dengan filter atau kata kunci yang kamu cari.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-wider uppercase rounded transition-colors"
            >
              RESET & TAMPILKAN SEMUA
            </button>
          </div>
        )}
      </section>

      {/* Partnership Proposal CTA */}
      <section className="border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 bg-[#08080a]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 p-8 border border-white/10 bg-[#0c0c0e] rounded">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
              KOLABORASI & KEMITRAAN
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase text-white">
              INGIN MENGAJUKAN KOLABORASI ACARA?
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              HIMATIKA Universitas Trilogi terbuka untuk kerja sama workshop, media partner, sponsorship kegiatan, atau proyek inovasi bersama himpunan dan komunitas lain.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-wider uppercase rounded whitespace-nowrap transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0"
          >
            HUBUNGI KAMI SEKARANG →
          </Link>
        </div>
      </section>
    </div>
  );
}
