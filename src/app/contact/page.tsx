import React from "react";
import ContactSection from "@/components/home/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HUBUNGI KAMI | HIMATIKA UNIVERSITAS TRILOGI",
  description:
    "Saluran komunikasi resmi, alamat sekretariat, nomor telepon, dan formulir kirim pesan Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-canvas text-main min-h-screen pt-20">
      <ContactSection />
    </div>
  );
}
