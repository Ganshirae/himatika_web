"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageFinance, getCurrentPengurus } from "@/lib/auth/session";
import type { ActionResult } from "@/types/finance.types";

const MAX_RECEIPT_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_RECEIPT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const financePayloadSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  title: z.string().trim().min(3, "Keterangan transaksi minimal 3 karakter.").max(160),
  amount: z.coerce
    .number()
    .positive("Nominal transaksi harus lebih dari Rp 0.")
    .max(10000000000, "Nominal terlalu besar."),
  type: z.enum(["income", "expense"]),
  category_id: z.string().uuid("Kategori kas tidak valid."),
  transaction_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD."),
  notes: z.string().trim().max(500).optional(),
  existing_receipt_url: z.string().trim().optional(),
  remove_receipt: z.boolean().optional(),
});

async function uploadPrivateReceipt(
  supabase: Awaited<ReturnType<typeof createClient>>,
  receiptFile: File
): Promise<{ path?: string; error?: string }> {
  if (receiptFile.size > MAX_RECEIPT_BYTES) {
    return { error: "Ukuran file bukti nota maksimal 5 MB." };
  }
  if (!ALLOWED_RECEIPT_TYPES.has(receiptFile.type)) {
    return { error: "Format bukti nota harus JPG, PNG, WebP, atau PDF." };
  }

  const ext = receiptFile.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `receipts/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("vault-receipts")
    .upload(storagePath, receiptFile, {
      contentType: receiptFile.type,
      upsert: false,
    });

  if (uploadError) {
    return { error: `Gagal mengunggah bukti nota: ${uploadError.message}` };
  }

  return { path: storagePath };
}

function invalidateFinanceCaches() {
  updateTag("finance");
  revalidatePath("/vault");
  revalidatePath("/keuangan");
}

/**
 * Create or update a finance transaction and handle private receipt upload/replacement.
 */
export async function upsertFinanceTransaction(
  formData: FormData
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageFinance(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak. Hanya Bendahara atau Admin yang dapat mengelola transaksi kas.",
    };
  }

  const parsed = financePayloadSchema.safeParse({
    id: formData.get("id") || "",
    title: formData.get("title"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    category_id: formData.get("category_id"),
    transaction_date: formData.get("transaction_date"),
    notes: formData.get("notes") || undefined,
    existing_receipt_url: formData.get("existing_receipt_url") || "",
    remove_receipt: formData.get("remove_receipt") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Input transaksi tidak valid.",
    };
  }

  const supabase = await createClient();
  const isEdit = Boolean(parsed.data.id);
  const existingReceipt = parsed.data.existing_receipt_url || null;
  let nextReceiptPath: string | null = parsed.data.remove_receipt ? null : existingReceipt;
  let newlyUploadedPath: string | null = null;

  const receiptFile = formData.get("receipt");
  if (receiptFile instanceof File && receiptFile.size > 0) {
    const uploadRes = await uploadPrivateReceipt(supabase, receiptFile);
    if (uploadRes.error || !uploadRes.path) {
      return { success: false, message: uploadRes.error ?? "Gagal mengunggah nota." };
    }
    newlyUploadedPath = uploadRes.path;
    nextReceiptPath = uploadRes.path;
  }

  if (isEdit && parsed.data.id) {
    const { error: updateError } = await supabase
      .from("finance_records")
      .update({
        title: parsed.data.title,
        amount: parsed.data.amount,
        type: parsed.data.type,
        category_id: parsed.data.category_id,
        transaction_date: parsed.data.transaction_date,
        notes: parsed.data.notes ?? null,
        receipt_url: nextReceiptPath,
      })
      .eq("id", parsed.data.id);

    if (updateError) {
      if (newlyUploadedPath) {
        await supabase.storage.from("vault-receipts").remove([newlyUploadedPath]);
      }
      return {
        success: false,
        message: `Gagal memperbarui transaksi: ${updateError.message}`,
      };
    }

    if (existingReceipt && (newlyUploadedPath || parsed.data.remove_receipt)) {
      await supabase.storage.from("vault-receipts").remove([existingReceipt]);
    }

    invalidateFinanceCaches();
    return {
      success: true,
      message: "Transaksi kas berhasil diperbarui.",
    };
  }

  const { error: insertError } = await supabase.from("finance_records").insert({
    title: parsed.data.title,
    amount: parsed.data.amount,
    type: parsed.data.type,
    category_id: parsed.data.category_id,
    transaction_date: parsed.data.transaction_date,
    notes: parsed.data.notes ?? null,
    receipt_url: nextReceiptPath,
    recorded_by: pengurus.userId,
  });

  if (insertError) {
    if (newlyUploadedPath) {
      await supabase.storage.from("vault-receipts").remove([newlyUploadedPath]);
    }
    return {
      success: false,
      message: `Gagal menyimpan transaksi: ${insertError.message}`,
    };
  }

  invalidateFinanceCaches();
  return {
    success: true,
    message: "Transaksi kas berhasil dicatat.",
  };
}

/**
 * Backward-compatible alias for creating a new finance transaction.
 */
export async function createFinanceTransaction(
  formData: FormData
): Promise<ActionResult> {
  return upsertFinanceTransaction(formData);
}

/**
 * Delete a finance transaction and its private receipt file if present.
 */
export async function deleteFinanceTransaction(id: string): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageFinance(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak. Hanya Bendahara atau Admin yang dapat menghapus transaksi.",
    };
  }

  const idCheck = z.string().uuid().safeParse(id);
  if (!idCheck.success) {
    return { success: false, message: "ID transaksi tidak valid." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("finance_records")
    .select("receipt_url")
    .eq("id", idCheck.data)
    .maybeSingle();

  const { error } = await supabase
    .from("finance_records")
    .delete()
    .eq("id", idCheck.data);

  if (error) {
    return {
      success: false,
      message: `Gagal menghapus transaksi: ${error.message}`,
    };
  }

  if (existing?.receipt_url) {
    await supabase.storage.from("vault-receipts").remove([existing.receipt_url]);
  }

  invalidateFinanceCaches();
  return {
    success: true,
    message: "Transaksi kas berhasil dihapus.",
  };
}

/**
 * Generate a 60-second signed URL to view a private receipt inside The Vault.
 */
export async function getReceiptSignedUrl(
  receiptPath: string
): Promise<ActionResult<{ signedUrl: string }>> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageFinance(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak. Hanya Bendahara atau Admin yang dapat membuka bukti nota privat.",
    };
  }

  if (!receiptPath || receiptPath.includes("..")) {
    return { success: false, message: "Path bukti nota tidak valid." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("vault-receipts")
    .createSignedUrl(receiptPath, 60);

  if (error || !data?.signedUrl) {
    return {
      success: false,
      message: error?.message ?? "Gagal membuat tautan pratinjau nota.",
    };
  }

  return {
    success: true,
    message: "Tautan nota siap.",
    data: { signedUrl: data.signedUrl },
  };
}
