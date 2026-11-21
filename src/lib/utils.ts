import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Normalize a WhatsApp phone number or URL into a clean `https://wa.me/...` link.
 */
export function normalizeWhatsappUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
}

export interface CsvExportRow {
  transactionDate: string;
  title: string;
  categoryName: string;
  type: "income" | "expense";
  amount: number;
  notes?: string | null;
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Trigger a UTF-8 BOM CSV download of cash transactions for Excel/LPJ reporting.
 */
export function downloadFinanceCsv(
  rows: CsvExportRow[],
  filename: string,
  includeNotes = false
) {
  const headers = includeNotes
    ? ["Tanggal", "Keterangan", "Kategori", "Tipe", "Nominal (IDR)", "Catatan Internal"]
    : ["Tanggal", "Keterangan", "Kategori", "Tipe", "Nominal (IDR)"];

  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => {
      const base = [
        row.transactionDate,
        row.title,
        row.categoryName,
        row.type === "income" ? "PEMASUKAN" : "PENGELUARAN",
        row.amount,
      ];
      if (includeNotes) {
        base.push(row.notes || "");
      }
      return base.map(escapeCsvCell).join(",");
    }),
  ];

  // UTF-8 BOM ensures Indonesian characters & columns open cleanly in Excel
  const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
