"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageProker, getCurrentPengurus } from "@/lib/auth/session";
import type { ActionResult } from "@/types/finance.types";
import type { ProkerStatus } from "@/types/database.types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const prokerSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  highlight_number: z.string().trim().max(10).optional(),
  title: z.string().trim().min(3, "Judul program kerja minimal 3 karakter.").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Slug minimal 3 karakter.")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)."),
  division_code: z.string().trim().min(2, "Pilih divisi penyelenggara."),
  status: z.enum(["upcoming", "ongoing", "completed"]),
  execution_label: z.string().trim().min(2, "Jadwal pelaksanaan wajib diisi.").max(80),
  location: z.string().trim().min(2, "Lokasi wajib diisi.").max(160),
  target_audience: z.string().trim().min(2, "Sasaran peserta wajib diisi.").max(160),
  short_desc: z.string().trim().min(10, "Ringkasan minimal 10 karakter.").max(400),
  full_content: z.string().trim().optional(),
  objectives_text: z.string().trim().optional(),
  registration_link: z
    .string()
    .trim()
    .url("Link pendaftaran harus berupa URL valid (https://...)")
    .optional()
    .or(z.literal("")),
  existing_cover_url: z.string().trim().optional(),
  is_featured: z.boolean(),
  is_white_background: z.boolean(),
});

const DIVISION_NAME_MAP: Record<string, string> = {
  KOLABORASI: "KOLABORASI SEMUA DIVISI",
  PRESIDIUM: "PRESIDIUM UTAMA",
  BPH_SEK: "SEKRETARIS",
  BPH_BEN: "BENDAHARA",
  BPSDM: "BADAN PENGEMBANGAN SDM",
  HUMAS: "HUBUNGAN MASYARAKAT",
  RISET: "RISET DAN KEILMUAN",
  PMB: "PENGEMBANGAN MINAT & BAKAT",
  SARLOG: "SARANA DAN LOGISTIK",
  MEDKRAF: "MEDIA KREATIF",
};

/**
 * Create or update a work program in Supabase and invalidate public proker caches.
 */
export async function upsertWorkProgram(formData: FormData): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak. Hanya Medkraf atau Admin yang dapat mengelola Program Kerja.",
    };
  }

  const parsed = prokerSchema.safeParse({
    id: formData.get("id") || "",
    highlight_number: formData.get("highlight_number") || "",
    title: formData.get("title"),
    slug: formData.get("slug"),
    division_code: formData.get("division_code"),
    status: formData.get("status"),
    execution_label: formData.get("execution_label"),
    location: formData.get("location"),
    target_audience: formData.get("target_audience"),
    short_desc: formData.get("short_desc"),
    full_content: formData.get("full_content") || "",
    objectives_text: formData.get("objectives_text") || "",
    registration_link: formData.get("registration_link") || "",
    existing_cover_url: formData.get("existing_cover_url") || "",
    is_featured: formData.get("is_featured") === "true",
    is_white_background: formData.get("is_white_background") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data program kerja tidak valid.",
    };
  }

  const supabase = await createClient();
  let coverUrl = parsed.data.existing_cover_url || "/image/tcamp2024.jpg";

  const coverFile = formData.get("cover_file");
  if (coverFile instanceof File && coverFile.size > 0) {
    if (coverFile.size > MAX_IMAGE_BYTES) {
      return { success: false, message: "Ukuran gambar poster maksimal 5 MB." };
    }
    if (!ALLOWED_IMAGE_TYPES.has(coverFile.type)) {
      return { success: false, message: "Poster harus berformat JPG, PNG, atau WebP." };
    }

    const ext = coverFile.name.split(".").pop()?.toLowerCase() || "webp";
    const filePath = `prokers/${parsed.data.slug}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("public-assets")
      .upload(filePath, coverFile, {
        contentType: coverFile.type,
        upsert: true,
      });

    if (uploadError) {
      return {
        success: false,
        message: `Gagal mengunggah poster: ${uploadError.message}`,
      };
    }

    const { data: urlData } = supabase.storage
      .from("public-assets")
      .getPublicUrl(filePath);

    coverUrl = urlData.publicUrl;
  }

  let divisionId: string | null = null;
  if (parsed.data.division_code !== "KOLABORASI") {
    const { data: divRow } = await supabase
      .from("divisions")
      .select("id")
      .eq("code", parsed.data.division_code)
      .maybeSingle();
    divisionId = divRow?.id ?? null;
  }

  const objectives = (parsed.data.objectives_text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const payload = {
    highlight_number: parsed.data.highlight_number || null,
    title: parsed.data.title,
    slug: parsed.data.slug,
    division_id: divisionId,
    division_code: parsed.data.division_code,
    division_name:
      DIVISION_NAME_MAP[parsed.data.division_code] ?? parsed.data.division_code,
    status: parsed.data.status,
    execution_label: parsed.data.execution_label,
    location: parsed.data.location,
    target_audience: parsed.data.target_audience,
    short_desc: parsed.data.short_desc,
    full_content: parsed.data.full_content || parsed.data.short_desc,
    objectives,
    cover_image_url: coverUrl,
    gallery_images: coverUrl ? [coverUrl] : [],
    registration_link: parsed.data.registration_link || null,
    is_featured: parsed.data.is_featured,
    is_white_background: parsed.data.is_white_background,
  };

  const { error } = parsed.data.id
    ? await supabase.from("work_programs").update(payload).eq("id", parsed.data.id)
    : await supabase.from("work_programs").insert(payload);

  if (error) {
    return {
      success: false,
      message: `Gagal menyimpan program kerja: ${error.message}`,
    };
  }

  updateTag("prokers");
  revalidatePath("/proker");
  revalidatePath(`/proker/${parsed.data.slug}`);
  revalidatePath("/");
  revalidatePath("/vault");

  return {
    success: true,
    message: parsed.data.id
      ? "Program kerja berhasil diperbarui."
      : "Program kerja baru berhasil ditambahkan.",
  };
}

/**
 * Quickly switch status of a work program (upcoming / ongoing / completed).
 */
export async function updateProkerStatus(
  id: string,
  status: ProkerStatus
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return { success: false, message: "Akses ditolak." };
  }

  const idCheck = z.string().uuid().safeParse(id);
  const statusCheck = z.enum(["upcoming", "ongoing", "completed"]).safeParse(status);
  if (!idCheck.success || !statusCheck.success) {
    return { success: false, message: "Parameter status tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("work_programs")
    .update({ status: statusCheck.data })
    .eq("id", idCheck.data);

  if (error) {
    return { success: false, message: `Gagal memperbarui status: ${error.message}` };
  }

  updateTag("prokers");
  revalidatePath("/proker");
  revalidatePath("/");
  revalidatePath("/vault");

  return { success: true, message: "Status program kerja diperbarui." };
}

/**
 * Delete a work program by ID.
 */
export async function deleteWorkProgram(id: string): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return { success: false, message: "Akses ditolak." };
  }

  const idCheck = z.string().uuid().safeParse(id);
  if (!idCheck.success) {
    return { success: false, message: "ID program kerja tidak valid." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("work_programs")
    .delete()
    .eq("id", idCheck.data);

  if (error) {
    return { success: false, message: `Gagal menghapus program kerja: ${error.message}` };
  }

  updateTag("prokers");
  revalidatePath("/proker");
  revalidatePath("/");
  revalidatePath("/vault");

  return { success: true, message: "Program kerja berhasil dihapus." };
}
