"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageOrganization, getCurrentPengurus } from "@/lib/auth/session";
import { DEFAULT_SITE_ABOUT } from "@/lib/data/about";
import {
  removeUnusedPublicAssets,
  uploadPublicAsset,
} from "@/lib/supabase/storage";
import type { AboutMissionJson } from "@/types/database.types";
import type { ActionResult } from "@/types/finance.types";

const missionItemSchema = z.object({
  tag: z.string().trim().min(2, "Tag misi minimal 2 karakter.").max(50),
  title: z.string().trim().min(3, "Judul misi minimal 3 karakter.").max(120),
  desc: z.string().trim().min(10, "Deskripsi misi minimal 10 karakter.").max(400),
});

const aboutSchema = z.object({
  intro_primary: z
    .string()
    .trim()
    .min(10, "Paragraf profil utama minimal 10 karakter.")
    .max(600),
  intro_secondary: z
    .string()
    .trim()
    .min(10, "Paragraf profil kedua minimal 10 karakter.")
    .max(600),
  vision_text: z
    .string()
    .trim()
    .min(10, "Teks visi minimal 10 karakter.")
    .max(500),
  period_label: z
    .string()
    .trim()
    .min(3, "Label periode wajib diisi.")
    .max(50),
  existing_logo_url: z.string().trim().optional(),
  reset_logo: z.boolean().optional(),
  missions_json: z.string().trim(),
});

/**
 * Update the editable /about page profile, vision, missions, active period, and logo.
 */
export async function updateSiteAbout(formData: FormData): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageOrganization(pengurus.profile.role)) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin BPH yang dapat memperbarui halaman Tentang.",
    };
  }

  const parsed = aboutSchema.safeParse({
    intro_primary: formData.get("intro_primary"),
    intro_secondary: formData.get("intro_secondary"),
    vision_text: formData.get("vision_text"),
    period_label: formData.get("period_label"),
    existing_logo_url: formData.get("existing_logo_url") || "",
    reset_logo: formData.get("reset_logo") === "true",
    missions_json: formData.get("missions_json") || "[]",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data Tentang tidak valid.",
    };
  }

  let rawMissions: unknown;
  try {
    rawMissions = JSON.parse(parsed.data.missions_json);
  } catch {
    return { success: false, message: "Format JSON misi tidak valid." };
  }

  const parsedMissions = z
    .array(missionItemSchema)
    .min(1, "Minimal harus ada 1 poin misi.")
    .max(8, "Maksimal 8 poin misi.")
    .safeParse(rawMissions);

  if (!parsedMissions.success) {
    return {
      success: false,
      message:
        parsedMissions.error.issues[0]?.message ??
        "Pastikan setiap poin misi terisi lengkap.",
    };
  }

  const missions: AboutMissionJson[] = parsedMissions.data.map((m, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    tag: m.tag.toUpperCase(),
    title: m.title.toUpperCase(),
    desc: m.desc,
  }));

  const supabase = await createClient();
  const { data: existingRow } = await supabase
    .from("site_about")
    .select("logo_image_url")
    .eq("id", "default")
    .maybeSingle();

  let logoUrl = parsed.data.reset_logo
    ? DEFAULT_SITE_ABOUT.logoImageUrl
    : parsed.data.existing_logo_url ||
      existingRow?.logo_image_url ||
      DEFAULT_SITE_ABOUT.logoImageUrl;
  let newlyUploadedPath: string | null = null;

  const logoFile = formData.get("logo_file");
  if (logoFile instanceof File && logoFile.size > 0) {
    const uploadRes = await uploadPublicAsset(supabase, logoFile, "about", "logo");
    if (uploadRes.error || !uploadRes.url) {
      return {
        success: false,
        message: uploadRes.error ?? "Gagal mengunggah logo halaman Tentang.",
      };
    }
    newlyUploadedPath = uploadRes.path ?? null;
    logoUrl = uploadRes.url;
  }

  const { error } = await supabase.from("site_about").upsert({
    id: "default",
    intro_primary: parsed.data.intro_primary,
    intro_secondary: parsed.data.intro_secondary,
    vision_text: parsed.data.vision_text.toUpperCase(),
    period_label: parsed.data.period_label.toUpperCase(),
    logo_image_url: logoUrl,
    missions,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    if (newlyUploadedPath) {
      await supabase.storage.from("public-assets").remove([newlyUploadedPath]);
    }
    return {
      success: false,
      message: `Gagal menyimpan perubahan Tentang: ${error.message}`,
    };
  }

  if (existingRow?.logo_image_url) {
    await removeUnusedPublicAssets(
      supabase,
      [existingRow.logo_image_url],
      [logoUrl]
    );
  }

  updateTag("about");
  revalidatePath("/about");
  revalidatePath("/struktur");
  revalidatePath("/vault");

  return {
    success: true,
    message: "Konten halaman Tentang berhasil diperbarui.",
  };
}
