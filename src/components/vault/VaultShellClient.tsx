"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  CalendarDays,
  GitBranch,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { logoutUser } from "@/actions/auth.actions";
import { FinanceVaultTab } from "./FinanceVaultTab";
import { ProkerManagerTab } from "./ProkerManagerTab";
import { DivisionManagerTab } from "./DivisionManagerTab";
import type {
  AppRole,
  DivisionRow,
  FinanceCategoryRow,
  FinancialSummary,
  UserProfile,
  WorkProgramRow,
} from "@/types/database.types";
import type { VaultTransactionItem } from "@/types/finance.types";

interface VaultShellClientProps {
  profile: UserProfile;
  email: string;
  summary: FinancialSummary;
  transactions: VaultTransactionItem[];
  categories: FinanceCategoryRow[];
  prokers: WorkProgramRow[];
  divisions: DivisionRow[];
}

type VaultTab = "finance" | "proker" | "divisions";

const ROLE_LABEL: Record<AppRole, string> = {
  admin: "ADMIN BPH (AKSES PENUH)",
  bendahara: "BENDAHARA (KAS & KUITANSI)",
  medkraf: "MEDKRAF (PROGRAM KERJA)",
};

export function VaultShellClient({
  profile,
  email,
  summary,
  transactions,
  categories,
  prokers,
  divisions,
}: VaultShellClientProps) {
  const canEditFinance = profile.role === "bendahara" || profile.role === "admin";
  const canEditProker = profile.role === "medkraf" || profile.role === "admin";
  const canEditOrg = profile.role === "admin";

  const defaultTab: VaultTab =
    profile.role === "medkraf" ? "proker" : "finance";
  const [activeTab, setActiveTab] = useState<VaultTab>(defaultTab);

  return (
    <div className="min-h-screen bg-canvas text-main pt-24 sm:pt-32 pb-16 px-4 sm:px-8 lg:px-14">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Top Portal Banner */}
        <div className="p-6 sm:p-8 bg-surface border border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>PORTAL PENGURUS INTERNAL • {ROLE_LABEL[profile.role]}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-main">
              THE VAULT: {profile.full_name}
            </h1>
            <p className="font-mono text-xs text-secondary">{email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <Link
              href="/keuangan"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main transition-colors"
            >
              <span>LIHAT KAS PUBLIK</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <form action={logoutUser}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-red-500/40 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>KELUAR</span>
              </button>
            </form>
          </div>
        </div>

        {/* Role-Based Module Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-hairline pb-4 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("finance")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border transition-colors cursor-pointer ${
              activeTab === "finance"
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-hairline bg-surface text-secondary hover:text-main"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>KAS &amp; KUITANSI</span>
          </button>

          {canEditProker && (
            <button
              type="button"
              onClick={() => setActiveTab("proker")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border transition-colors cursor-pointer ${
                activeTab === "proker"
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-hairline bg-surface text-secondary hover:text-main"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>KELOLA PROGRAM KERJA</span>
            </button>
          )}

          {canEditOrg && (
            <button
              type="button"
              onClick={() => setActiveTab("divisions")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border transition-colors cursor-pointer ${
                activeTab === "divisions"
                  ? "border-blue-500 bg-blue-600 text-white"
                  : "border-hairline bg-surface text-secondary hover:text-main"
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>KELOLA STRUKTUR</span>
            </button>
          )}
        </div>

        {/* Active Module Content */}
        {activeTab === "finance" && (
          <FinanceVaultTab
            summary={summary}
            transactions={transactions}
            categories={categories}
            canEditFinance={canEditFinance}
          />
        )}

        {activeTab === "proker" && canEditProker && (
          <ProkerManagerTab prokers={prokers} canEditProker={canEditProker} />
        )}

        {activeTab === "divisions" && canEditOrg && (
          <DivisionManagerTab divisions={divisions} />
        )}
      </div>
    </div>
  );
}
