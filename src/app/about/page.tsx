import React from "react";
import Link from "next/link";
import OrgBlueprint from "@/components/diagram/OrgBlueprint";
import { ArrowRight, Code2, Compass, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TENTANG KAMI // HIMATIKA UNIVERSITAS TRILOGI",
  description:
    "Arsip sejarah, visi, misi, dan arsitektur struktur organisasi Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi.",
};

const TIMELINE_MILESTONES = [
  {
    year: "2015",
    title: "PENDIRIAN RESMI ORGANISASI",
    desc: "Inisiasi pembentukan Himpunan Mahasiswa Teknik Informatika di Universitas Trilogi sebagai wadah pemersatu aspirasi, keilmuan, dan solidaritas mahasiswa prodi Teknik Informatika.",
  },
  {
    year: "2018",
    title: "INTEGRASI TECHNOPRENEURSHIP",
    desc: "Transformasi kurikulum kegiatan berbasis technopreneurship dan riset terapan, melahirkan kompetisi IT pertama dan inkubasi proyek perangkat lunak kemahasiswaan.",
  },
  {
    year: "2021",
    title: "EKSPANSI JARINGAN & KEMITRAAN",
    desc: "Pembentukan divisi Hubungan Masyarakat & Kemitraan strategis untuk merambah jejaring kerja sama dengan industri teknologi nasional, BUMN, dan komunitas open-source.",
  },
  {
    year: "2024",
    title: "DIGITAL TRANSFORMATION ERA",
    desc: "Modernisasi manajemen kas melalui perancangan sistem internal The Vault dan restrukturisasi kurikulum kaderisasi kepemimpinan berbasis rekayasa etis.",
  },
  {
    year: "2026",
    title: "GENERASI INTEGRASI PENUH",
    desc: "Peluncuran platform web generasi baru HIMATIKA dengan arsitektur serverless modern, transparansi pembukuan kas real-time, dan sistem katalog program kerja publik.",
  },
];

const CORE_VALUES = [
  {
    number: "01",
    title: "INTEGRITAS",
    subtitle: "HIGH ETHICAL CODE",
    icon: ShieldCheck,
    desc: "Menjunjung tinggi etika rekayasa komputasi, keterbukaan informasi, kejujuran akademik, dan tata kelola organisasi yang bertanggung jawab.",
  },
  {
    number: "02",
    title: "INOVASI",
    subtitle: "CONTINUOUS EVOLUTION",
    icon: Zap,
    desc: "Eksplorasi tanpa henti terhadap teknologi mutakhir, memecahkan problematika nyata dengan pendekatan komputasi yang efisien dan elegan.",
  },
  {
    number: "03",
    title: "SOLIDARITAS",
    subtitle: "RADICAL FELLOWSHIP",
    icon: Compass,
    desc: "Membangun persaudaraan erat antarmahasiswa dan alumni, menciptakan lingkungan inklusif yang saling menopang dalam proses belajar.",
  },
  {
    number: "04",
    title: "TECHNOPRENEUR",
    subtitle: "VALUE CREATION",
    icon: Code2,
    desc: "Mengasah kepekaan solusi teknologi agar tidak hanya unggul secara kode, namun mampu memberikan dampak ekonomi dan kemaslahatan sosial.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-canvas text-main min-h-screen">
      {/* HERO SECTION TENTANG KAMI */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 border-b border-hairline overflow-hidden">
        {/* Subtle Decorative Background Grain & Lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
          <div className="flex items-center gap-2.5 font-mono text-xs text-blue-500 mb-4 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>IDENTITAS RESMI // ARSIP SISTEM #2015-2026</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-main uppercase leading-none max-w-5xl">
            TENTANG KAMI &amp;{" "}
            <span className="text-blue-600">ARSITEKTUR</span> ORGANISASI
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted font-sans max-w-3xl leading-relaxed">
            Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi adalah entitas resmi kemahasiswaan yang berfokus pada pengembangan integritas keilmuan, kepemimpinan adaptif, dan budaya rekayasa perangkat lunak berdaya saing global.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-hairline font-mono">
            <div className="p-4 bg-surface/40 border border-hairline rounded-xs">
              <span className="text-xs text-muted block mb-1">FOUNDATION YEAR</span>
              <span className="font-display text-2xl sm:text-3xl text-main">2015</span>
              <span className="text-[10px] text-blue-400 block mt-0.5">ESTABLISHED</span>
            </div>
            <div className="p-4 bg-surface/40 border border-hairline rounded-xs">
              <span className="text-xs text-muted block mb-1">ORGANIZATION NODES</span>
              <span className="font-display text-2xl sm:text-3xl text-main">08 + 01</span>
              <span className="text-[10px] text-blue-400 block mt-0.5">DIVISI &amp; PRESIDIUM</span>
            </div>
            <div className="p-4 bg-surface/40 border border-hairline rounded-xs">
              <span className="text-xs text-muted block mb-1">NETWORK REACH</span>
              <span className="font-display text-2xl sm:text-3xl text-main">500+</span>
              <span className="text-[10px] text-blue-400 block mt-0.5">KADER &amp; ALUMNI</span>
            </div>
            <div className="p-4 bg-surface/40 border border-hairline rounded-xs">
              <span className="text-xs text-muted block mb-1">CORE DISCIPLINE</span>
              <span className="font-display text-2xl sm:text-3xl text-main">TI TRILOGI</span>
              <span className="text-[10px] text-blue-400 block mt-0.5">ACCREDITED</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI SEJARAH: EDITORIAL TWO-COLUMN DOSSIER */}
      <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 border-b border-hairline">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Kolom Kiri: Narasi Sejarah Editorial */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs text-blue-500 uppercase tracking-widest">
              <span>01 // HISTORICAL LOGS</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-main uppercase tracking-tight leading-tight">
              PERJALANAN &amp; KELAHIRAN HIMATIKA SEJAK 2015
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
              <p>
                Berdiri pada tahun 2015 di bawah naungan Program Studi Teknik Informatika Universitas Trilogi, Jakarta Selatan, HIMATIKA diinisiasi oleh para mahasiswa perintis yang memiliki keresahan bersama: pentingnya sebuah wadah independen dan progresif yang mampu memfasilitasi percepatan kapabilitas komputasi mahasiswa di luar ruang kuliah konvensional.
              </p>
              <p>
                Mengusung pilar utama Universitas Trilogi yaitu <em>Teknopreneur, Kolaborasi, dan Kemandirian</em>, HIMATIKA terus berevolusi dari sekadar himpunan kemahasiswaan seremonial menjadi inkubator ide, komunitas pembelajaran rekayasa kode, dan kawah candradimuka bagi calon pemimpin industri teknologi masa depan.
              </p>
              <p>
                Hingga kini, himpunan terus memelihara kultur egaliter dan budaya riset terbuka, menjembatani ratusan mahasiswa dengan jaringan alumni profesional yang tersebar di berbagai raksasa teknologi, unicorn, hingga instansi pemerintahan.
              </p>
            </div>

            <div className="pt-4 border-t border-hairline font-mono text-xs text-muted flex items-center gap-4">
              <span>STATUS: KONTINU &amp; ADAPTIF</span>
              <span>//</span>
              <span>LOKASI: KAMPUS TRILOGI, KALIBATA</span>
            </div>
          </div>

          {/* Kolom Kanan: Milestone Timeline */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-muted pb-2 border-b border-hairline">
              <span className="text-blue-500 uppercase">CHRONOLOGICAL MILESTONES</span>
              <span>2015 — 2026</span>
            </div>

            <div className="space-y-4 font-mono">
              {TIMELINE_MILESTONES.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-surface/30 hover:bg-surface/60 border border-hairline hover:border-blue-600/40 transition-colors rounded-xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 font-bold rounded-xs">
                      {item.year}
                    </span>
                    <span className="text-[10px] text-muted">
                      PHASE 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-lg text-main group-hover:text-blue-400 transition-colors uppercase">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted font-sans mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI VISI & MISI: ENGINEERING SPECIFICATION DOSSIER */}
      <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 border-b border-hairline">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-blue-500 tracking-widest uppercase block mb-2">
            02 // STRATEGIC CHARTER &amp; MANDATE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight">
            VISI &amp; MISI STRATEGIS
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted font-sans">
            Landasan operasional dan komitmen formal HIMATIKA Universitas Trilogi dalam mencetak talenta rekayasa teknologi berkualitas tinggi.
          </p>
        </div>

        {/* Kotak Visi Besar */}
        <div className="p-8 sm:p-12 bg-surface/60 border-2 border-hairline relative mb-12 rounded-xs overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600/20 border-b border-l border-blue-500/30 font-mono text-[11px] text-blue-400 uppercase">
            PRIMARY VISION SPECIFICATION
          </div>

          <span className="font-mono text-xs text-muted tracking-widest uppercase block mb-3">
            VISI UTAMA HIMATIKA
          </span>
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-main tracking-tight uppercase leading-snug">
            &ldquo;MENJADIKAN HIMATIKA UNIVERSITAS TRILOGI SEBAGAI EPISENTRUM PENGEMBANGAN TALENTA REKAYASA TEKNOLOGI INFORMASI YANG BERDAYA SAING GLOBAL, BERINTEGRITAS TINGGI, ADAPTIF TERHADAP DISRUPSI, DAN BERJIWA TECHNOPRENEURSHIP.&rdquo;
          </blockquote>
        </div>

        {/* Grid 4 Pilar Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-surface/40 border border-hairline rounded-xs space-y-3">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-hairline">
              <span className="text-blue-400 font-bold">MISI // PILAR 01</span>
              <span className="text-muted text-[10px]">AKADEMIK &amp; RISET</span>
            </div>
            <h3 className="font-display text-xl text-main uppercase">
              PENGUASAAN KEILMUAN REKAYASA
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              Menyelenggarakan ekosistem riset terapan, coding bootcamp terstruktur, serta pembinaan kompetensi rekayasa perangkat lunak dan AI yang relevan dengan standar industri terdepan.
            </p>
          </div>

          <div className="p-6 bg-surface/40 border border-hairline rounded-xs space-y-3">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-hairline">
              <span className="text-blue-400 font-bold">MISI // PILAR 02</span>
              <span className="text-muted text-[10px]">KADERISASI &amp; KARAKTER</span>
            </div>
            <h3 className="font-display text-xl text-main uppercase">
              KEPEMIMPINAN BERETIKA &amp; SOLID
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              Membina kader mahasiswa Teknik Informatika yang memiliki integritas etis tinggi, kedisiplinan organisasi, dan jiwa kepemimpinan yang berakar pada semangat kekeluargaan.
            </p>
          </div>

          <div className="p-6 bg-surface/40 border border-hairline rounded-xs space-y-3">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-hairline">
              <span className="text-blue-400 font-bold">MISI // PILAR 03</span>
              <span className="text-muted text-[10px]">KOLABORASI &amp; DIPLOMASI</span>
            </div>
            <h3 className="font-display text-xl text-main uppercase">
              SINERGI INDUSTRI &amp; EKSTERNAL
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              Membangun kemitraan strategis yang produktif bersama korporasi teknologi, institusi riset, organisasi kemahasiswaan lintas universitas, dan ikatan alumni.
            </p>
          </div>

          <div className="p-6 bg-surface/40 border border-hairline rounded-xs space-y-3">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-hairline">
              <span className="text-blue-400 font-bold">MISI // PILAR 04</span>
              <span className="text-muted text-[10px]">INOVASI &amp; TECHNOPRENEUR</span>
            </div>
            <h3 className="font-display text-xl text-main uppercase">
              KREASI NILAI &amp; DAMPAK NYATA
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              Memfasilitasi inkubasi inovasi digital, turnamen esports, dan produk perangkat lunak solutif yang berorientasi pada kemandirian technopreneurship.
            </p>
          </div>
        </div>
      </section>

      {/* SEKSI NILAI DASAR (CORE VALUES) */}
      <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 border-b border-hairline">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs text-blue-500 tracking-widest uppercase block mb-2">
              03 // CORE TENETS &amp; ETHICS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-main uppercase tracking-tight">
              EMPAT NILAI DASAR HIMPUNAN
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            PRINSIP PERILAKU DAN KULTUR KERJA ORGANISASI
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CORE_VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-surface/50 border border-hairline hover:border-blue-600/50 transition-all rounded-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-hairline">
                    <span className="text-blue-500 font-bold">{val.number}</span>
                    <Icon className="w-4 h-4 text-muted group-hover:text-blue-400 transition-colors" />
                  </div>

                  <div className="py-4">
                    <h3 className="font-display text-2xl text-main group-hover:text-blue-400 transition-colors uppercase">
                      {val.title}
                    </h3>
                    <span className="font-mono text-[11px] text-muted block mt-0.5">
                      {val.subtitle}
                    </span>
                    <p className="text-xs text-neutral-300 font-sans mt-3 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-hairline/60 font-mono text-[10px] text-muted">
                  DISCIPLINE ENFORCED
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEKSI INTERACTIVE ORG BLUEPRINT DIAGRAM */}
      <OrgBlueprint />

      {/* SEKSI FOOTER BRIDGING CTA */}
      <section className="py-20 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 text-center">
        <div className="p-8 sm:p-14 bg-surface/40 border border-hairline rounded-xs max-w-4xl mx-auto space-y-6">
          <span className="font-mono text-xs text-blue-500 tracking-widest uppercase block">
            NEXT DIRECTORY // PROGRAM KERJA &amp; AGENDA
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight">
            INGIN MELIHAT PROGRAM KERJA KAMI?
          </h2>
          <p className="text-sm sm:text-base text-muted font-sans max-w-xl mx-auto">
            Jelajahi seluruh arsip kegiatan, workshop, pameran inovasi, dan agenda kemahasiswaan HIMATIKA Universitas Trilogi pada katalog resmi.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/proker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors uppercase rounded-xs"
            >
              <span>BUKA KATALOG PROGRAM KERJA</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 border border-hairline hover:border-white/20 text-muted hover:text-white font-mono text-xs transition-colors uppercase rounded-xs"
            >
              <span>KEMBALI KE BERANDA</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
