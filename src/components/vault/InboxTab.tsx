"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  CheckCircle2,
  Clock,
  ExternalLink,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  RotateCcw,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  deleteContactMessage,
  updateContactMessageStatus,
} from "@/actions/contact.actions";
import type {
  ContactMessageRow,
  ContactMessageStatus,
} from "@/types/database.types";

interface InboxTabProps {
  messages: ContactMessageRow[];
  canManageInbox: boolean;
}

type InboxFilter = "all" | ContactMessageStatus;

const STATUS_META: Record<
  ContactMessageStatus,
  { label: string; badgeClass: string }
> = {
  unread: {
    label: "BELUM DIBACA",
    badgeClass: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  },
  read: {
    label: "SUDAH DIBACA",
    badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  archived: {
    label: "ARSIP",
    badgeClass: "border-hairline bg-canvas text-muted",
  },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function InboxTab({ messages, canManageInbox }: InboxTabProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  const counts = useMemo(
    () => ({
      all: messages.length,
      unread: messages.filter((m) => m.status === "unread").length,
      read: messages.filter((m) => m.status === "read").length,
      archived: messages.filter((m) => m.status === "archived").length,
    }),
    [messages]
  );

  const filteredMessages = useMemo(() => {
    if (filter === "all") return messages;
    return messages.filter((m) => m.status === filter);
  }, [messages, filter]);

  const handleStatusChange = async (
    id: string,
    nextStatus: ContactMessageStatus
  ) => {
    setBusyId(id);
    setFeedback(null);
    const res = await updateContactMessageStatus(id, nextStatus);
    setBusyId(null);
    setFeedback({ ok: res.success, msg: res.message });
    if (res.success) {
      router.refresh();
    }
  };

  const handleDelete = async (item: ContactMessageRow) => {
    const confirmed = window.confirm(
      `Hapus pesan dari "${item.name}" dengan subjek "${item.subject}"?`
    );
    if (!confirmed) return;

    setBusyId(item.id);
    setFeedback(null);
    const res = await deleteContactMessage(item.id);
    setBusyId(null);
    setFeedback({ ok: res.success, msg: res.message });
    if (res.success) {
      router.refresh();
    }
  };

  const filterButtons: { key: InboxFilter; label: string; count: number }[] = [
    { key: "all", label: "SEMUA", count: counts.all },
    { key: "unread", label: "BELUM DIBACA", count: counts.unread },
    { key: "read", label: "SUDAH DIBACA", count: counts.read },
    { key: "archived", label: "DIARSIPKAN", count: counts.archived },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-surface border border-hairline flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-400 uppercase tracking-wider">
            <Inbox className="w-4 h-4" />
            <span>PESAN PUBLIK / KONTAK MASUK</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-main">
            KOTAK MASUK PENGURUS
          </h2>
          <p className="text-xs sm:text-sm text-secondary font-sans">
            Pesan yang dikirim melalui formulir kontak publik{" "}
            <code className="font-mono text-blue-400">/contact</code> atau halaman beranda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="px-4 py-2.5 bg-canvas border border-hairline">
            <span className="text-muted">TOTAL: </span>
            <span className="text-main font-semibold">{counts.all}</span>
          </div>
          <div className="px-4 py-2.5 bg-blue-500/10 border border-blue-500/30">
            <span className="text-blue-300">BELUM DIBACA: </span>
            <span className="text-blue-400 font-semibold">{counts.unread}</span>
          </div>
        </div>
      </div>

      {!canManageInbox && (
        <div className="p-4 border border-hairline bg-surface font-mono text-xs text-secondary flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Mode lihat saja — hanya Admin HIMATIKA dan Medkraf yang dapat mengubah status atau menghapus pesan masuk.
          </span>
        </div>
      )}

      {feedback && (
        <div
          className={`p-4 border font-mono text-xs flex items-center justify-between gap-3 ${
            feedback.ok
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {feedback.ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline cursor-pointer"
          >
            TUTUP
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            type="button"
            onClick={() => setFilter(btn.key)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 border transition-colors cursor-pointer ${
              filter === btn.key
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-hairline bg-surface text-secondary hover:text-main"
            }`}
          >
            <span>{btn.label}</span>
            <span
              className={`px-1.5 py-0.5 text-[10px] border ${
                filter === btn.key
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-hairline bg-canvas text-muted"
              }`}
            >
              {btn.count}
            </span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 bg-surface border border-hairline text-center space-y-2">
          <Inbox className="w-8 h-8 text-muted mx-auto opacity-60" />
          <p className="font-mono text-xs text-secondary uppercase">
            BELUM ADA PESAN PADA KATEGORI INI.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((item) => {
            const meta = STATUS_META[item.status];
            const isBusy = busyId === item.id;
            const mailtoHref = `mailto:${item.email}?subject=${encodeURIComponent(
              `Re: ${item.subject}`
            )}`;

            return (
              <article
                key={item.id}
                className={`p-5 sm:p-6 bg-surface border transition-colors ${
                  item.status === "unread"
                    ? "border-blue-500/40"
                    : "border-hairline"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-hairline">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 border font-mono text-[10px] uppercase tracking-wider ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {DATE_FORMATTER.format(new Date(item.created_at))}
                        </span>
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl text-main uppercase tracking-tight wrap-break-word">
                      {item.subject}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-secondary">
                      <span className="text-main font-medium">{item.name}</span>
                      <a
                        href={`mailto:${item.email}`}
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{item.email}</span>
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] shrink-0">
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>BALAS EMAIL</span>
                    </a>

                    {canManageInbox && (
                      <>
                        {item.status !== "read" ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStatusChange(item.id, "read")}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <MailOpen className="w-3.5 h-3.5" />
                            )}
                            <span>TANDAI DIBACA</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              handleStatusChange(item.id, "unread")
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            <span>BELUM DIBACA</span>
                          </button>
                        )}

                        {item.status !== "archived" ? (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              handleStatusChange(item.id, "archived")
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-hairline bg-canvas hover:border-white/25 text-secondary hover:text-main transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>ARSIPKAN</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStatusChange(item.id, "read")}
                            className="inline-flex items-center gap-1.5 px-3 py-2 border border-hairline bg-canvas hover:border-blue-500/50 text-secondary hover:text-main transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>PULIHKAN</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-500/40 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>HAPUS</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="pt-4">
                  <p className="font-sans text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap break-words">
                    {item.message}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
