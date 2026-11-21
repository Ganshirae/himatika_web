"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Edit3,
  Eye,
  Lock,
  Plus,
  Printer,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import { downloadFinanceCsv, formatRupiah } from "@/lib/utils";
import { deleteFinanceTransaction } from "@/actions/finance.actions";
import { CustomSelect } from "@/components/ui/CustomSelect";
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

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  })
    .format(new Date(year, month - 1, 1))
    .toUpperCase();
}

export function FinanceVaultTab({
  summary,
  transactions,
  categories,
  canEditFinance,
}: FinanceVaultTabProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<VaultTransactionItem | null>(null);
  const [previewTarget, setPreviewTarget] = useState<{
    path: string;
    title: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [monthFilter, setMonthFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const monthOptions = useMemo(() => {
    const keys = Array.from(
      new Set(
        transactions
          .map((tx) => tx.transactionDate.slice(0, 7))
          .filter((k) => /^\d{4}-\d{2}$/.test(k))
      )
    ).sort((a, b) => b.localeCompare(a));

    return [
      { value: "ALL", label: "SEMUA PERIODE" },
      ...keys.map((k) => ({ value: k, label: formatMonthLabel(k) })),
    ];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      const matchType = typeFilter === "all" || tx.type === typeFilter;
      const matchMonth =
        monthFilter === "ALL" || tx.transactionDate.startsWith(monthFilter);
      const matchSearch =
        q === "" ||
        tx.title.toLowerCase().includes(q) ||
        tx.categoryName.toLowerCase().includes(q) ||
        (tx.notes ?? "").toLowerCase().includes(q);
      return matchType && matchMonth && matchSearch;
    });
  }, [transactions, typeFilter, monthFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (tx: VaultTransactionItem) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

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

  const handleExportCsv = () => {
    const suffix = monthFilter === "ALL" ? "semua-periode" : monthFilter;
    downloadFinanceCsv(
      filteredTransactions,
      `laporan-kas-himatika-${suffix}.csv`,
      true
    );
  };

  return (
    <div className="space-y-6">
      {/* Print-Only Header for LPJ Printing */}
      <div className="hidden print:block border-b border-black pb-4 mb-6 text-black">
        <h2 className="text-xl font-bold uppercase">
          LAPORAN KAS HIMATIKA UNIVERSITAS TRILOGI
        </h2>
        <p className="text-xs">
          Periode: {monthFilter === "ALL" ? "Semua Periode" : formatMonthLabel(monthFilter)} • Dicetak:{" "}
          {new Intl.DateTimeFormat("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date())}
        </p>
      </div>

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-hairline pb-4 print:hidden">
        <div>
          <h2 className="font-display text-2xl uppercase text-main">
            BUKU KAS INTERNAL &amp; KUITANSI
          </h2>
          <p className="font-sans text-xs text-secondary mt-1">
            {canEditFinance
              ? "Anda memiliki akses penuh Bendahara untuk mencatat, mengubah, menghapus, melihat nota privat, dan mengekspor laporan kas."
              : "Mode Baca (Read-Only): Perubahan kas dan akses foto nota privat hanya terbuka untuk Bendahara / Admin."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {filteredTransactions.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-hairline hover:border-blue-500/60 bg-surface hover:bg-surface-hover text-secondary hover:text-main font-mono text-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>EKSPOR CSV</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-hairline hover:border-blue-500/60 bg-surface hover:bg-surface-hover text-secondary hover:text-main font-mono text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>CETAK LPJ</span>
              </button>
            </>
          )}

          {canEditFinance ? (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>CATAT TRANSAKSI</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-hairline bg-surface font-mono text-xs text-muted">
              <Lock className="w-3.5 h-3.5" />
              <span>KHUSUS BENDAHARA</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-surface border border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {(
            [
              { value: "all", label: "SEMUA" },
              { value: "income", label: "PEMASUKAN" },
              { value: "expense", label: "PENGELUARAN" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setTypeFilter(tab.value)}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                typeFilter === tab.value
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-hairline bg-canvas text-secondary hover:text-main"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <CustomSelect
            ariaLabel="Filter periode transaksi"
            value={monthFilter}
            onChange={setMonthFilter}
            options={monthOptions}
            className="sm:w-52"
          />

          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi / catatan..."
              className="w-full sm:w-60 bg-canvas border border-hairline focus:border-blue-500 pl-9 pr-3 py-2 font-mono text-xs text-main placeholder:text-muted outline-none"
            />
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 border font-mono text-xs print:hidden ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Ledger Table */}
      {filteredTransactions.length === 0 ? (
        <div className="p-12 border border-hairline bg-surface/50 text-center space-y-2">
          <p className="font-display text-xl uppercase text-main">
            {transactions.length === 0
              ? "BELUM ADA TRANSAKSI TERCATAT"
              : "TIDAK ADA TRANSAKSI YANG COCOK"}
          </p>
          <p className="font-sans text-xs text-secondary">
            {transactions.length === 0
              ? 'Gunakan tombol "Catat Transaksi" untuk menambahkan pemasukan atau pengeluaran pertama.'
              : "Coba ubah filter tipe, periode, atau kata kunci pencarian."}
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
                <th className="py-3.5 px-4 text-right print:hidden">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {filteredTransactions.map((tx) => (
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
                  <td className="py-3.5 px-4 text-right whitespace-nowrap print:hidden">
                    <div className="inline-flex items-center gap-1.5">
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
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(tx)}
                            aria-label={`Edit ${tx.title}`}
                            className="p-1.5 border border-hairline hover:border-blue-500/50 text-secondary hover:text-main transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === tx.id}
                            onClick={() => handleDelete(tx.id, tx.title)}
                            aria-label={`Hapus ${tx.title}`}
                            className="p-1.5 border border-hairline hover:border-red-500/50 text-muted hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
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
        isOpen={modalOpen}
        editingTransaction={editingTx}
        onClose={() => {
          setModalOpen(false);
          setEditingTx(null);
        }}
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
