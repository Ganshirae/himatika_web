"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { loginUser, type AuthActionState } from "@/actions/auth.actions";

const initialState: AuthActionState = {};

export function LoginFormClient() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [state, formAction, isPending] = useActionState(loginUser, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const queryErrorText =
    urlError === "unauthorized"
      ? "Silakan masuk terlebih dahulu menggunakan akun pengurus resmi untuk mengakses Portal Pengurus."
      : urlError === "inactive"
        ? "Akun pengurus Anda belum aktif atau tidak memiliki izin akses."
        : null;

  const displayError = state.error ?? queryErrorText;

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
                Akses internal untuk pencatatan kas (Bendahara), pembaruan program kerja (Media Kreatif), dan pengelolaan struktur (Admin BPH).
              </p>
            </div>
          </div>

          {/* Error Feedback */}
          {displayError && (
            <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs leading-relaxed">
              {displayError}
            </div>
          )}

          {/* Login Form via Server Action */}
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="identifier"
                className="font-mono text-xs text-secondary block"
              >
                USERNAME JABATAN / EMAIL
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="admin / bendahara / medkraf"
                className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-mono text-xs text-main placeholder:text-muted/60 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="font-mono text-xs text-secondary block"
              >
                KATA SANDI
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-canvas border border-hairline focus:border-blue-500 pl-3.5 pr-10 py-2.5 font-mono text-xs text-main placeholder:text-muted/60 outline-none transition-colors [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"
                  }
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-muted hover:text-main transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 border border-blue-600 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>{isPending ? "MEMVERIFIKASI..." : "MASUK KE PORTAL"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Access Roles Footer */}
          <div className="pt-4 border-t border-hairline/60 space-y-2">
            <div className="font-mono text-[10px] text-muted tracking-wider uppercase">
              PEMISAHAN HAK AKSES ROLE:
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-secondary">
              <div className="p-2 border border-hairline bg-surface/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                <span>BENDAHARA</span>
              </div>
              <div className="p-2 border border-hairline bg-surface/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                <span>MEDKRAF</span>
              </div>
              <div className="p-2 border border-hairline bg-surface/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0" />
                <span>ADMIN BPH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
