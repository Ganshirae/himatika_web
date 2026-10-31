import { Suspense } from "react";
import { Metadata } from "next";
import { ALL_PROKERS } from "@/lib/data/proker";
import { ProkerCatalogClient } from "@/components/proker/ProkerCatalogClient";

export const metadata: Metadata = {
  title: "Program Kerja & Agenda | HIMATIKA Universitas Trilogi",
  description:
    "Daftar program kerja resmi, lokakarya teknologi, festival IT expo, dan kegiatan kemahasiswaan HIMATIKA Universitas Trilogi.",
};

export default function ProkerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-400 font-mono text-sm">
          MEMUAT DAFTAR PROGRAM KERJA...
        </div>
      }
    >
      <ProkerCatalogClient initialProkers={ALL_PROKERS} />
    </Suspense>
  );
}
