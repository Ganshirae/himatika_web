"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Plus,
  Trash2,
  Wallet,
  Lock,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { deleteFinanceTransaction } from "@/actions/finance.actions";
import { ReceiptViewerModal } from "./ReceiptViewerModal";
import { TransactionFormModal } from "./TransactionFormModal";
import type {
  FinanceCategoryRow,
  FinancialSummary,
  VaultTransactionItem,
} from "@/types/finance.types";

interface FinanceVaultTabProps {
  summary: FinancialSummary;
  transactions: VaultTransactionItem[];
  categories: FinanceCategoryRow[];
  canEditFinance: boolean;
}

export function FinanceVaultTab({
  summary,
  transactions,
  categories,
  canEditFinance,
}: FinanceVaultTabProps) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<{
    path: string;
    title: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus transaksi "${title}"?`)) return;
    setDeletingId(id);
    setFeedback(null);

    const res = await deleteFinanceTransaction(id);
    setDeletingId(null);

    setFeedback({
      type: res.success ? "success" : "error",
      text: res.message,
    });

    if (res.success) {
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-6 bg-surface border border-hairline space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-secondary uppercase">
            <span>SALDO KAS AKTIF</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400">
            {formatRupiah(summary.current_balance)}
          </div>
        </div>

        <div className="p-6 bg-surface border border-hairline space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-secondary uppercase">
            <span>TOTAL PEMASUKAN</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-main">
            {formatRupiah(summary.total_income)}
          </div>
        </div>

        <div className="p-6 bg-surface border border-hairline space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-secondary uppercase">
            <span>TOTAL PENGELUARAN</span>
            <ArrowUpRight className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-red-400">
            {formatRupiah(summary.total_expense)}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <h2 className="font-display text-2xl uppercase text-main">
            BUKU KAS INTERNAL &amp; KUITANSI
          </h2>
          <p className="font-sans text-xs text-secondary mt-1">
            {canEditFinance
              ? "Anda memiliki akses penuh Bendahara untuk mencatat kas, melihat nota privat, dan menghapus entri."
              : "Mode Baca (Read-Only): Perubahan kas dan akses foto nota privat hanya terbuka untuk Bendahara / Admin."}
          </p>
        </div>

        {canEditFinance ? (
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>CATAT TRANSAKSI</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-hairline bg-surface font-mono text-xs text-muted shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span>KHUSUS BENDAHARA</span>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 border font-mono text-xs ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Ledger Table */}
      {transactions.length === 0 ? (
        <div className="p-12 border border-hairline bg-surface/50 text-center space-y-2">
          <p className="font-display text-xl uppercase text-main">
            BELUM ADA TRANSAKSI TERCATAT
          </p>
          <p className="font-sans text-xs text-secondary">
            Gunakan tombol &ldquo;Catat Transaksi&rdquo; untuk menambahkan pemasukan atau pengeluaran pertama.
          </p>
        </div>
      ) : (
        <div className="border border-hairline bg-surface overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline bg-canvas font-mono text-[11px] text-secondary uppercase tracking-wider">
                <th className="py-3.5 px-4">TANGGAL</th>
                <th className="py-3.5 px-4">KETERANGAN</th>
                <th className="py-3.5 px-4">KATEGORI</th>
                <th className="py-3.5 px-4">CATATAN</th>
                <th className="py-3.5 px-4 text-right">NOMINAL</th>
                <th className="py-3.5 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-secondary whitespace-nowrap">
                    {tx.transactionDate}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-main font-medium">
                    {tx.title}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-secondary">
                    {tx.categoryName}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-muted max-w-xs truncate">
                    {tx.notes || "-"}
                  </td>
                  <td
                    className={`py-3.5 px-4 font-mono text-sm font-semibold text-right whitespace-nowrap ${
                      tx.type === "income" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"} {formatRupiah(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      {tx.receiptUrl && canEditFinance && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewTarget({
                              path: tx.receiptUrl!,
                              title: tx.title,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white font-mono text-[11px] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>NOTA</span>
                        </button>
                      )}
                      {canEditFinance && (
                        <button
                          type="button"
                          disabled={deletingId === tx.id}
                          onClick={() => handleDelete(tx.id, tx.title)}
                          aria-label={`Hapus ${tx.title}`}
                          className="p-1.5 border border-hairline hover:border-red-500/50 text-muted hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransactionFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        categories={categories}
      />

      <ReceiptViewerModal
        receiptPath={previewTarget?.path ?? null}
        title={previewTarget?.title ?? ""}
        onClose={() => setPreviewTarget(null)}
      />
    </div>
  );
}
