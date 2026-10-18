import HeroSection from "@/components/home/HeroSection";
import ShowcaseSlider from "@/components/home/ShowcaseSlider";
import MetricsSection from "@/components/home/MetricsSection";
import Link from "next/link";
import { ArrowUpRight, Shield, GitBranch, User } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. Featured Showcase Slider (Flagship Proker) */}
      <ShowcaseSlider />

      {/* 3. Quick Metrics & Statistical Dossier */}
      <MetricsSection />

      {/* 4. Brutalist Editorial Action Terminal (About & Vault Prompt) */}
      <section className="w-full bg-surface/30 border-b border-hairline py-16 sm:py-24">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
          <div className="border border-hairline bg-canvas p-8 sm:p-14 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Background Cyber Ambient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="space-y-4 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-400 tracking-wider uppercase">
                <GitBranch className="w-3.5 h-3.5" />
                <span>BAGAN INTERAKTIF // PERIODE 2026-2027</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight leading-tight">
                STRUKTUR ORGANISASI & HIERARKI KEPENGURUSAN.
              </h2>
              <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
                Jelajahi alur koordinasi kepengurusan HIMATIKA melalui diagram hierarki interaktif. Buka rincian tugas pokok, kepala divisi, dan daftar anggota di setiap departemen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto relative z-10 font-mono text-xs">
              <Link
                href="/about"
                className="flex items-center justify-center gap-2 px-6 py-4 border border-main bg-main text-canvas font-semibold hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors group"
              >
                <span>LIHAT STRUKTUR ORGANISASI</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-6 py-4 border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span>PORTAL PENGURUS</span>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
