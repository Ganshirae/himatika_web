import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginFormClient } from "@/components/auth/LoginFormClient";

export const metadata: Metadata = {
  title: "Portal Pengurus | HIMATIKA Universitas Trilogi",
  description:
    "Halaman masuk internal pengurus HIMATIKA Universitas Trilogi untuk pengelolaan kas, program kerja, dan struktur organisasi.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center font-mono text-xs text-secondary">
          MEMUAT PORTAL PENGURUS...
        </div>
      }
    >
      <LoginFormClient />
    </Suspense>
  );
}
