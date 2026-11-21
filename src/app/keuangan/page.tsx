import type { Metadata } from "next";
import { getPublicFinanceData } from "@/lib/data/queries";
import { PublicFinanceClient } from "@/components/keuangan/PublicFinanceClient";

export const metadata: Metadata = {
  title: "Transparansi Kas HIMATIKA | HIMATIKA Universitas Trilogi",
  description:
    "Laporan transparansi saldo kas, pemasukan, dan pengeluaran HIMATIKA Universitas Trilogi yang terbuka bagi mahasiswa dan civitas akademika.",
};

export default async function KeuanganPage() {
  const { summary, transactions, categories } = await getPublicFinanceData();

  return (
    <PublicFinanceClient
      summary={summary}
      transactions={transactions}
      categories={categories}
    />
  );
}
