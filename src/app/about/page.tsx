import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, ShieldCheck, Zap, Code2, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TENTANG KAMI | HIMATIKA UNIVERSITAS TRILOGI",
  description:
    "Profil resmi, visi, misi, dan identitas Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi.",
};

const MISI_ITEMS = [
  {
    num: "01",
    tag: "AKADEMIK & RISET",
    title: "PENGUASAAN KEILMUAN & RISET",
    desc: "Mengembangkan keilmuan mahasiswa melalui workshop pemrograman, studi teknologi terkini, riset software, dan persiapan delegasi kompetisi IT.",
  },
  {
    num: "02",
    tag: "KARAKTER & SOLIDARITAS",
    title: "KEPEMIMPINAN & KEKELUARGAAN",
    desc: "Membentuk kepemimpinan yang beretika serta mempererat rasa kekeluargaan dan solidaritas antar-angkatan mahasiswa Teknik Informatika.",
  },
  {
    num: "03",
    tag: "KEMITRAAN AKTIF",
    title: "KOLABORASI INDUSTRI & ALUMNI",
    desc: "Membangun relasi aktif dengan industri teknologi, komunitas open-source, dan ikatan alumni untuk membuka peluang riset, magang, dan karir.",
  },
  {
    num: "04",
    tag: "TECHNOPRENEURSHIP",
    title: "INOVASI & KONTRIBUSI NYATA",
    desc: "Mendorong lahirnya karya teknologi tepat guna, penyelenggaraan Trilogi IT Expo tahunan, serta menumbuhkan jiwa technopreneurship mahasiswa.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-canvas text-main min-h-screen">
      {/* HERO SECTION: LOGO & IDENTITAS RESMI */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 border-b border-hairline overflow-hidden">
        {/* Subtle Decorative Background Grain */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-14 max-w-6xl">
            
            {/* Visual Logo HIMATIKA (Besar & Langsung Berdampingan) */}
            <div className="shrink-0">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/image/Logo Himatika.png"
                  alt="Logo Resmi HIMATIKA Universitas Trilogi"
                  fill
                  sizes="(max-width: 768px) 208px, (max-width: 1024px) 256px, 320px"
                  className="object-contain drop-shadow-[0_0_40px_rgba(37,99,235,0.3)]"
                  priority
                />
              </div>
            </div>

            {/* Teks Identitas Resmi */}
            <div className="space-y-5 text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2.5 font-mono text-xs text-blue-500 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>TENTANG HIMATIKA TRILOGI</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight text-main uppercase leading-none">
                HIMATIKA <span className="text-blue-600">TRILOGI</span>
              </h1>

              <div className="space-y-4 text-base sm:text-lg text-muted font-sans leading-relaxed max-w-2xl">
                <p>
                  <strong className="text-white font-medium">Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi</strong> adalah organisasi kemahasiswaan resmi yang menjadi wadah pemersatu, inkubasi keilmuan, dan ruang kreasi bagi seluruh mahasiswa Teknik Informatika.
                </p>
                <p className="text-sm sm:text-base text-neutral-400">
                  Berakar pada semangat teknopreneur, kolaborasi, dan kemandirian, HIMATIKA berkomitmen mendampingi mahasiswa dari ranah akademik hingga kesiapan profesional di industri teknologi digital.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEKSI VISI: EDITORIAL STATEMENT BOX */}
      <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 border-b border-hairline">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-14 bg-surface/50 border-2 border-hairline relative rounded-xs shadow-xl">
            {/* Badge Sudut Kanan Atas */}
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600/20 border-b border-l border-blue-500/30 font-mono text-[11px] text-blue-400 uppercase tracking-widest font-semibold">
              VISI KAMI
            </div>

            <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl text-main tracking-tight uppercase leading-snug pt-2">
              &ldquo;MENJADIKAN HIMATIKA UNIVERSITAS TRILOGI SEBAGAI RUANG TUMBUH BAGI MAHASISWA TEKNIK INFORMATIKA YANG UNGGUL, BERINTEGRITAS, INOVATIF, DAN SIAP BERKONTRIBUSI DI INDUSTRI TEKNOLOGI.&rdquo;
            </blockquote>

            <div className="mt-8 pt-4 border-t border-hairline font-mono text-xs text-muted flex items-center justify-between">
              <span>HIMATIKA UNIVERSITAS TRILOGI</span>
              <span className="text-blue-400">PERIODE 2026/2027</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI MISI: 4 PILAR UTAMA */}
      <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 border-b border-hairline">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight">
            EMPAT MISI UTAMA
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted font-sans">
            Komitmen nyata yang kami jalankan dalam menggerakkan seluruh program kerja dan pembinaan mahasiswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {MISI_ITEMS.map((item) => (
            <div
              key={item.num}
              className="p-6 sm:p-8 bg-surface/40 hover:bg-surface/70 border border-hairline hover:border-blue-500/50 transition-all duration-300 rounded-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs pb-3 border-b border-hairline">
                  <span className="text-blue-400 font-bold">
                    MISI {item.num}
                  </span>
                  <span className="text-muted text-[10px] uppercase">
                    {item.tag}
                  </span>
                </div>

                <div className="py-4">
                  <h3 className="font-display text-xl sm:text-2xl text-main group-hover:text-blue-400 transition-colors uppercase">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI FOOTER BRIDGING CTA (PROGRAM KERJA & STRUKTUR) */}
      <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 text-center">
        <div className="p-8 sm:p-14 bg-surface/40 border border-hairline rounded-xs max-w-4xl mx-auto space-y-6">
          <span className="font-mono text-xs text-blue-500 tracking-widest uppercase block font-semibold">
            PROGRAM KERJA &amp; STRUKTUR
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
              href="/struktur"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface/80 border border-hairline hover:border-white/20 text-muted hover:text-white font-mono text-xs transition-colors uppercase rounded-xs"
            >
              <span>LIHAT STRUKTUR PENGURUS</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
