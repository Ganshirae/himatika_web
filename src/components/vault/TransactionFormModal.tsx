"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2 } from "lucide-react";
import { createFinanceTransaction } from "@/actions/finance.actions";
import type { FinanceCategoryRow, FinanceType } from "@/types/finance.types";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FinanceCategoryRow[];
}

export function TransactionFormModal({
  isOpen,
  onClose,
  categories,
}: TransactionFormModalProps) {
  const router = useRouter();
  const [txType, setTxType] = useState<FinanceType>("income");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredCategories = categories.filter((cat) => cat.type === txType);
  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    if (selectedFile) {
      formData.set("receipt", selectedFile);
    }

    const res = await createFinanceTransaction(formData);
    setSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSelectedFile(null);
    router.refresh();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface border border-hairline shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
          <div>
            <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider block">
              MODUL BENDAHARA
            </span>
            <h3 className="font-display text-xl uppercase text-main">
              CATAT TRANSAKSI KAS BARU
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir transaksi"
            className="p-2 border border-hairline text-secondary hover:text-main cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs">
              {errorMsg}
            </div>
          )}

          {/* Tipe Transaksi */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-secondary block">
              TIPE ARUS KAS
            </label>
            <input type="hidden" name="type" value={txType} />
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setTxType("income")}
                className={`py-2.5 border transition-colors cursor-pointer ${
                  txType === "income"
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-semibold"
                    : "border-hairline bg-canvas text-secondary"
                }`}
              >
                PEMASUKAN (+)
              </button>
              <button
                type="button"
                onClick={() => setTxType("expense")}
                className={`py-2.5 border transition-colors cursor-pointer ${
                  txType === "expense"
                    ? "border-red-500 bg-red-500/20 text-red-400 font-semibold"
                    : "border-hairline bg-canvas text-secondary"
                }`}
              >
                PENGELUARAN (-)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tx-title" className="font-mono text-xs text-secondary block">
              KETERANGAN TRANSAKSI
            </label>
            <input
              id="tx-title"
              name="title"
              type="text"
              required
              placeholder="Contoh: Konsumsi Rapat Kerja T-Camp"
              className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-sans text-sm text-main outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="tx-amount" className="font-mono text-xs text-secondary block">
                NOMINAL (RP)
              </label>
              <input
                id="tx-amount"
                name="amount"
                type="number"
                min={1}
                step="1"
                required
                placeholder="250000"
                className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-mono text-sm text-main outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tx-date" className="font-mono text-xs text-secondary block">
                TANGGAL TRANSAKSI
              </label>
              <input
                id="tx-date"
                name="transaction_date"
                type="date"
                defaultValue={today}
                required
                className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-mono text-sm text-main outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tx-category" className="font-mono text-xs text-secondary block">
              KATEGORI KAS
            </label>
            <select
              id="tx-category"
              name="category_id"
              required
              className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2.5 font-mono text-xs text-main outline-none"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tx-notes" className="font-mono text-xs text-secondary block">
              CATATAN INTERNAL (PRIVAT PENGURUS)
            </label>
            <textarea
              id="tx-notes"
              name="notes"
              rows={2}
              placeholder="Catatan verifikasi bendahara (tidak tampil di halaman publik)..."
              className="w-full bg-canvas border border-hairline focus:border-blue-500 px-3.5 py-2 font-sans text-xs text-main outline-none resize-none"
            />
          </div>

          {/* Drag & Drop Receipt Upload */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-secondary block">
              BUKTI NOTA / KUITANSI (PRIVAT, MAX 5MB)
            </label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) setSelectedFile(file);
              }}
              className="flex flex-col items-center justify-center gap-2 p-4 border border-dashed border-hairline hover:border-blue-500/60 bg-canvas cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 text-blue-400" />
              <span className="font-mono text-[11px] text-secondary text-center">
                {selectedFile
                  ? `Terpilih: ${selectedFile.name}`
                  : "Klik atau seret foto nota (JPG / PNG / WebP / PDF)"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
              />
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-hairline bg-canvas text-secondary hover:text-main font-mono text-xs cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{submitting ? "MENYIMPAN..." : "SIMPAN TRANSAKSI"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
