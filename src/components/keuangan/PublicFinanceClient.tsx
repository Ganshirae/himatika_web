"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Lock,
  Search,
  Wallet,
} from "lucide-react";
import { downloadFinanceCsv, formatRupiah } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type {
  FinanceCategoryRow,
  FinancialSummary,
  PublicTransactionItem,
} from "@/types/finance.types";

interface PublicFinanceClientProps {
  summary: FinancialSummary;
  transactions: PublicTransactionItem[];
  categories: FinanceCategoryRow[];
}

const PAGE_SIZE = 15;

function formatDateID(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
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

export function PublicFinanceClient({
  summary,
  transactions,
  categories,
}: PublicFinanceClientProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [monthFilter, setMonthFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    const query = searchQuery.trim().toLowerCase();
    return transactions.filter((item) => {
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchCategory =
        categoryFilter === "ALL" || item.categoryId === categoryFilter;
      const matchMonth =
        monthFilter === "ALL" || item.transactionDate.startsWith(monthFilter);
      const matchSearch =
        query === "" ||
        item.title.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query);

      return matchType && matchCategory && matchMonth && matchSearch;
    });
  }, [transactions, typeFilter, categoryFilter, monthFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, safePage]);

  const handleExportCsv = () => {
    const suffix = monthFilter === "ALL" ? "semua-periode" : monthFilter;
    downloadFinanceCsv(
      filteredTransactions,
      `transparansi-kas-himatika-${suffix}.csv`,
      false
    );
  };

  return (
    <div className="min-h-screen bg-canvas text-main">
      {/* Header Section */}
      <section className="pt-28 sm:pt-36 pb-12 border-b border-hairline px-4 sm:px-8 lg:px-14">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-400 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>TRANSPARANSI KEUANGAN ORGANISASI</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight leading-none text-main">
                LAPORAN <span className="text-blue-600">KAS HIMATIKA</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
                Catatan terbuka pemasukan dan pengeluaran kas HIMATIKA Universitas Trilogi periode aktif. Dokumen nota dan bukti transaksi internal dikelola secara terverifikasi oleh Bendahara.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-hairline hover:border-blue-500/60 bg-surface hover:bg-surface-hover font-mono text-xs text-secondary hover:text-blue-400 transition-colors shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>AKSES BENDAHARA</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Metrics Row */}
      <section className="border-b border-hairline bg-surface/30 px-4 sm:px-8 lg:px-14 py-8 sm:py-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Saldo Kas Aktif */}
          <div className="p-6 sm:p-8 bg-surface border border-hairline space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-secondary uppercase tracking-wider">
              <span>SALDO KAS SAAT INI</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 tracking-tight">
              {formatRupiah(summary.current_balance)}
            </div>
            <p className="font-sans text-xs text-muted">
              Akumulasi saldo bersih kas aktif organisasi.
            </p>
          </div>

          {/* Total Pemasukan */}
          <div className="p-6 sm:p-8 bg-surface border border-hairline space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-secondary uppercase tracking-wider">
              <span>TOTAL PEMASUKAN</span>
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-main tracking-tight">
              {formatRupiah(summary.total_income)}
            </div>
            <p className="font-sans text-xs text-muted">
              Iuran kas, dana kemahasiswaan, sponsor, dan danus.
            </p>
          </div>

          {/* Total Pengeluaran */}
          <div className="p-6 sm:p-8 bg-surface border border-hairline space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-secondary uppercase tracking-wider">
              <span>TOTAL PENGELUARAN</span>
              <ArrowUpRight className="w-4 h-4 text-red-400" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-red-400 tracking-tight">
              {formatRupiah(summary.total_expense)}
            </div>
            <p className="font-sans text-xs text-muted">
              Operasional program kerja, logistik, dan kesekretariatan.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Ledger Section */}
      <section className="px-4 sm:px-8 lg:px-14 py-10 sm:py-14">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 bg-surface border border-hairline flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Type Tabs */}
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
                  onClick={() => {
                    setTypeFilter(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-2 border transition-colors cursor-pointer ${
                    typeFilter === tab.value
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-hairline bg-canvas text-secondary hover:text-main"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Period, Category, Search, & Export */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <CustomSelect
                ariaLabel="Filter periode kas"
                value={monthFilter}
                onChange={(val) => {
                  setMonthFilter(val);
                  setCurrentPage(1);
                }}
                leadingIcon={<Calendar className="w-3.5 h-3.5" />}
                options={monthOptions}
                className="sm:w-52"
              />

              <CustomSelect
                ariaLabel="Filter kategori kas"
                value={categoryFilter}
                onChange={(val) => {
                  setCategoryFilter(val);
                  setCurrentPage(1);
                }}
                leadingIcon={<Filter className="w-3.5 h-3.5" />}
                options={[
                  { value: "ALL", label: "SEMUA KATEGORI" },
                  ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  })),
                ]}
                className="sm:w-56"
              />

              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari keterangan transaksi..."
                  className="w-full sm:w-56 bg-canvas border border-hairline focus:border-blue-500 pl-9 pr-3 py-2 font-mono text-xs text-main placeholder:text-muted outline-none"
                />
              </div>

              {filteredTransactions.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-hairline hover:border-blue-500/60 bg-canvas text-secondary hover:text-main font-mono text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>UNDUH CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
            <span>
              MENAMPILKAN {paginatedTransactions.length} DARI {filteredTransactions.length} TRANSAKSI
            </span>
            <span>PEMBUKUAN PUBLIK TERVERIFIKASI</span>
          </div>

          {/* Transaction List */}
          {filteredTransactions.length === 0 ? (
            <div className="p-12 sm:p-16 border border-hairline bg-surface/50 text-center space-y-3">
              <p className="font-display text-2xl uppercase text-main">
                BELUM ADA DATA TRANSAKSI
              </p>
              <p className="font-sans text-sm text-secondary max-w-md mx-auto">
                Belum ada catatan mutasi kas yang sesuai filter saat ini, atau pembukuan periode aktif baru dimulai.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block border border-hairline bg-surface overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-hairline bg-canvas font-mono text-[11px] text-secondary uppercase tracking-wider">
                      <th className="py-3.5 px-5">TANGGAL</th>
                      <th className="py-3.5 px-5">KETERANGAN</th>
                      <th className="py-3.5 px-5">KATEGORI</th>
                      <th className="py-3.5 px-5">TIPE</th>
                      <th className="py-3.5 px-5 text-right">NOMINAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-sm">
                    {paginatedTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-surface-hover transition-colors"
                      >
                        <td className="py-4 px-5 font-mono text-xs text-secondary whitespace-nowrap">
                          {formatDateID(tx.transactionDate)}
                        </td>
                        <td className="py-4 px-5 font-sans text-main font-medium">
                          {tx.title}
                        </td>
                        <td className="py-4 px-5 font-mono text-xs text-secondary">
                          <span className="px-2.5 py-1 border border-hairline bg-canvas">
                            {tx.categoryName}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono text-xs">
                          {tx.type === "income" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                              MASUK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              KELUAR
                            </span>
                          )}
                        </td>
                        <td
                          className={`py-4 px-5 font-mono text-sm font-semibold text-right whitespace-nowrap ${
                            tx.type === "income" ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"} {formatRupiah(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List */}
              <div className="md:hidden space-y-3">
                {paginatedTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 border border-hairline bg-surface space-y-3"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-secondary">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        {formatDateID(tx.transactionDate)}
                      </span>
                      <span
                        className={
                          tx.type === "income" ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {tx.type === "income" ? "PEMASUKAN" : "PENGELUARAN"}
                      </span>
                    </div>

                    <p className="font-sans text-sm font-medium text-main">
                      {tx.title}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-hairline/60">
                      <span className="font-mono text-[11px] text-secondary">
                        {tx.categoryName}
                      </span>
                      <span
                        className={`font-mono text-sm font-semibold ${
                          tx.type === "income" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "-"} {formatRupiah(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 font-mono text-xs">
                  <span className="text-muted">
                    HALAMAN {safePage} / {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="inline-flex items-center gap-1 px-3 py-2 border border-hairline bg-surface text-secondary hover:text-main disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>SEBELUMNYA</span>
                    </button>
                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 border border-hairline bg-surface text-secondary hover:text-main disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>BERIKUTNYA</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
