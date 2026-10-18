"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Lock, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message === "Invalid login credentials"
            ? "Email atau kata sandi pengurus tidak sesuai. Silakan periksa kembali."
            : error.message
        );
      } else if (data?.user) {
        setSuccessMessage("Autentikasi berhasil. Mengalihkan ke dashboard...");
        window.location.href = "/vault";
      }
    } catch {
      setErrorMessage("Terjadi kendala koneksi ke server autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden bg-canvas">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>KEMBALI KE BERANDA</span>
        </Link>

        {/* Main Auth Card */}
        <div className="border border-hairline bg-surface/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl space-y-6">
          
          {/* Header Brand */}
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="relative w-7 h-7 shrink-0">
                <Image
                  src="/image/logohima.png"
                  alt="Logo HIMATIKA"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-base tracking-tight text-main">
                HIMATIKA TRILOGI
              </span>
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-main uppercase tracking-tight">
                PORTAL PENGURUS
              </h1>
              <p className="font-sans text-xs text-secondary mt-1.5 leading-relaxed">
                Akses internal untuk pembaruan dokumentasi kegiatan (Media Kreatif), pencatatan kas (Bendahara), dan administrasi BPH.
              </p>
            </div>
          </div>

          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-xs">
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="font-mono text-xs text-secondary block">
                EMAIL PENGURUS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pengurus@trilogi.ac.id"
                  className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-mono text-xs text-main placeholder:text-muted/60 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="font-mono text-xs text-secondary block">
                KATA SANDI
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-mono text-xs text-main placeholder:text-muted/60 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "MEMVERIFIKASI..." : "MASUK KE PORTAL"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Access Roles Footer */}
          <div className="pt-4 border-t border-hairline/60 space-y-2">
            <div className="font-mono text-[10px] text-muted tracking-wider uppercase">
              HAK AKSES RESMI:
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-secondary">
              <div className="p-2 border border-hairline bg-surface/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>BENDAHARA (KAS)</span>
              </div>
              <div className="p-2 border border-hairline bg-surface/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>MEDKRAF (PROKER)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
