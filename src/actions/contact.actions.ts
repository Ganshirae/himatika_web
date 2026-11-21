"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { canManageProker, getCurrentPengurus } from "@/lib/auth/session";
import type { ContactMessageStatus } from "@/types/database.types";
import type { ActionResult } from "@/types/finance.types";

const ContactSubmitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(120, "Nama maksimal 120 karakter."),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid.")
    .max(180, "Email maksimal 180 karakter."),
  subject: z
    .string()
    .trim()
    .min(3, "Subjek / topik minimal 3 karakter.")
    .max(200, "Subjek maksimal 200 karakter."),
  message: z
    .string()
    .trim()
    .min(10, "Pesan minimal 10 karakter.")
    .max(4000, "Pesan maksimal 4000 karakter."),
});

const MessageIdSchema = z.string().uuid("ID pesan tidak valid.");
const MessageStatusSchema = z.enum(["unread", "read", "archived"]);

/**
 * Mengirim pesan dari formulir kontak publik ke tabel `contact_messages` (RLS anon INSERT only).
 */
export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ActionResult> {
  const parsed = ContactSubmitSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Data pesan tidak valid.",
    };
  }

  const supabase = createPublicClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    console.error("[submitContactMessage]", error.message);
    return {
      success: false,
      message:
        "Gagal mengirim pesan ke server. Silakan coba lagi atau hubungi lewat email resmi kami.",
    };
  }

  revalidatePath("/vault");

  return {
    success: true,
    message: "Pesan berhasil dikirim ke kotak masuk pengurus HIMATIKA.",
  };
}

/**
 * Memperbarui status pesan kontak (unread/read/archived) untuk Admin HIMATIKA & Medkraf.
 */
export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus
): Promise<ActionResult> {
  const parsedId = MessageIdSchema.safeParse(id);
  const parsedStatus = MessageStatusSchema.safeParse(status);

  if (!parsedId.success || !parsedStatus.success) {
    return { success: false, message: "Parameter status pesan tidak valid." };
  }

  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin HIMATIKA dan Medkraf yang dapat mengelola kotak masuk.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data);

  if (error) {
    return {
      success: false,
      message: `Gagal memperbarui status pesan: ${error.message}`,
    };
  }

  revalidatePath("/vault");

  return {
    success: true,
    message: "Status pesan berhasil diperbarui.",
  };
}

/**
 * Menghapus pesan kontak dari kotak masuk (Admin HIMATIKA & Medkraf).
 */
export async function deleteContactMessage(id: string): Promise<ActionResult> {
  const parsedId = MessageIdSchema.safeParse(id);
  if (!parsedId.success) {
    return { success: false, message: "ID pesan tidak valid." };
  }

  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin HIMATIKA dan Medkraf yang dapat menghapus pesan.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", parsedId.data);

  if (error) {
    return {
      success: false,
      message: `Gagal menghapus pesan: ${error.message}`,
    };
  }

  revalidatePath("/vault");

  return {
    success: true,
    message: "Pesan berhasil dihapus dari kotak masuk.",
  };
}
