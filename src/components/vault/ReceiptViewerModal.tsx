"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Loader2, FileText } from "lucide-react";
import { getReceiptSignedUrl } from "@/actions/finance.actions";
import { useLockBodyScroll } from "@/components/common/SmoothScroller";

interface ReceiptViewerModalProps {
  receiptPath: string | null;
  title: string;
  onClose: () => void;
}

interface ReceiptLoadState {
  path: string;
  signedUrl: string | null;
  errorMsg: string | null;
}

export function ReceiptViewerModal({
  receiptPath,
  title,
  onClose,
}: ReceiptViewerModalProps) {
  const [loadState, setLoadState] = useState<ReceiptLoadState | null>(null);

  useLockBodyScroll(Boolean(receiptPath));

  useEffect(() => {
    if (!receiptPath) return;
    let active = true;

    getReceiptSignedUrl(receiptPath).then((res) => {
      if (!active) return;
      setLoadState({
        path: receiptPath,
        signedUrl: res.success ? res.data?.signedUrl ?? null : null,
        errorMsg: res.success ? null : res.message,
      });
    });

    return () => {
      active = false;
    };
  }, [receiptPath]);

  useEffect(() => {
    if (!receiptPath) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [receiptPath, onClose]);

  if (!receiptPath) return null;

  const loading = loadState?.path !== receiptPath;
  const errorMsg = loadState?.path === receiptPath ? loadState.errorMsg : null;
  const signedUrl = loadState?.path === receiptPath ? loadState.signedUrl : null;
  const isPdf = receiptPath.toLowerCase().endsWith(".pdf");

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface border border-hairline shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <div className="space-y-0.5 min-w-0">
            <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider block">
              BUKTI KUITANSI PRIVAT (SIGNED URL 60 DETIK)
            </span>
            <h3 className="font-sans text-sm font-medium text-main truncate">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau nota"
            className="p-2 border border-hairline hover:border-blue-500/50 text-secondary hover:text-main transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 bg-canvas min-h-[320px] flex items-center justify-center">
          {loading ? (
            <div className="flex items-center gap-2 font-mono text-xs text-secondary">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>MEMBUAT TAUTAN TERENKRIPSI...</span>
            </div>
          ) : errorMsg ? (
            <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs">
              {errorMsg}
            </div>
          ) : signedUrl ? (
            isPdf ? (
              <div className="text-center space-y-4">
                <FileText className="w-12 h-12 text-blue-400 mx-auto" />
                <p className="font-sans text-sm text-secondary">
                  Dokumen bukti transaksi berformat PDF.
                </p>
                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs transition-colors"
                >
                  <span>BUKA PDF DI TAB BARU</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signedUrl}
                  alt={`Bukti kuitansi ${title}`}
                  className="max-h-[65vh] w-auto mx-auto object-contain border border-hairline"
                />
                <div className="text-right">
                  <a
                    href={signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-400 hover:text-blue-300"
                  >
                    <span>BUKA UKURAN PENUH</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
