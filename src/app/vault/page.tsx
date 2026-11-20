export const instant = false;

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCurrentPengurus } from "@/lib/auth/session";
import { mapSiteAboutRow } from "@/lib/data/about";
import { VaultShellClient } from "@/components/vault/VaultShellClient";
import type {
  ContactMessageRow,
  DivisionRow,
  FinanceCategoryRow,
  FinanceRecordRow,
  FinancialSummary,
  SiteAboutRow,
  WorkProgramRow,
} from "@/types/database.types";
import type { VaultTransactionItem } from "@/types/finance.types";

export const metadata: Metadata = {
  title: "Portal Pengurus (The Vault) | HIMATIKA Universitas Trilogi",
  description:
    "Portal internal pengurus HIMATIKA Universitas Trilogi untuk pengelolaan keuangan kas, program kerja, dan struktur organisasi.",
  robots: {
    index: false,
    follow: false,
  },
};

async function VaultContent() {
  await connection();
  const pengurus = await getCurrentPengurus();

  if (!pengurus) {
    redirect("/login?error=inactive");
  }

  const supabase = await createClient();

  const [
    summaryRes,
    recordsRes,
    categoriesRes,
    prokersRes,
    divisionsRes,
    messagesRes,
    aboutRes,
  ] = await Promise.all([
    supabase.rpc("get_financial_summary"),
    supabase
      .from("finance_records")
      .select(
        "id, title, amount, type, category_id, transaction_date, recorded_by, receipt_url, notes, created_at, finance_categories(name)"
      )
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("finance_categories")
      .select("id, name, type")
      .order("name", { ascending: true }),
    supabase
      .from("work_programs")
      .select("*")
      .order("highlight_number", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }),
    supabase
      .from("divisions")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("contact_messages")
      .select("id, name, email, subject, message, status, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("site_about").select("*").eq("id", "default").maybeSingle(),
  ]);

  const rawSummary = Array.isArray(summaryRes.data)
    ? summaryRes.data[0]
    : summaryRes.data;

  const summary: FinancialSummary = {
    total_income: Number(rawSummary?.total_income ?? 0),
    total_expense: Number(rawSummary?.total_expense ?? 0),
    current_balance: Number(rawSummary?.current_balance ?? 0),
  };

  const transactions: VaultTransactionItem[] = (
    (recordsRes.data ?? []) as unknown as FinanceRecordRow[]
  ).map((row) => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    type: row.type,
    categoryId: row.category_id,
    categoryName: row.finance_categories?.name || "Lainnya",
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
    receiptUrl: row.receipt_url,
    notes: row.notes,
    recordedBy: row.recorded_by,
  }));

  return (
    <VaultShellClient
      profile={pengurus.profile}
      email={pengurus.email}
      summary={summary}
      transactions={transactions}
      categories={(categoriesRes.data ?? []) as FinanceCategoryRow[]}
      prokers={(prokersRes.data ?? []) as WorkProgramRow[]}
      divisions={(divisionsRes.data ?? []) as DivisionRow[]}
      messages={(messagesRes.data ?? []) as ContactMessageRow[]}
      about={mapSiteAboutRow((aboutRes.data ?? null) as SiteAboutRow | null)}
    />
  );
}

export default function VaultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center font-mono text-xs text-secondary">
          MEMVERIFIKASI SESI PENGURUS...
        </div>
      }
    >
      <VaultContent />
    </Suspense>
  );
}
