import { Suspense } from "react";
import { Metadata } from "next";
import { getPublicProkers } from "@/lib/data/queries";
import { ProkerCatalogClient } from "@/components/proker/ProkerCatalogClient";

export const metadata: Metadata = {
  title: "Program Kerja & Agenda | HIMATIKA Universitas Trilogi",
  description:
    "Daftar program kerja resmi, lokakarya teknologi, festival IT expo, dan kegiatan kemahasiswaan HIMATIKA Universitas Trilogi.",
};

export default async function ProkerPage() {
  const prokers = await getPublicProkers();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-400 font-mono text-sm">
          MEMUAT DAFTAR PROGRAM KERJA...
        </div>
      }
    >
      <ProkerCatalogClient initialProkers={prokers} />
    </Suspense>
  );
}
