"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  canManageOrganization,
  canManageProker,
  getCurrentPengurus,
} from "@/lib/auth/session";
import { DEFAULT_SITE_ABOUT } from "@/lib/data/about";
import {
  removeUnusedPublicAssets,
  uploadPublicAsset,
} from "@/lib/supabase/storage";
import type {
  AboutGalleryPhotoJson,
  AboutMissionJson,
} from "@/types/database.types";
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
        "Akses ditolak. Hanya Admin HIMATIKA yang dapat memperbarui halaman Tentang.",
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

const MAX_ABOUT_GALLERY_PHOTOS = 6;

const galleryPhotoSchema = z.object({
  photo_id: z.string().trim().max(80).optional().or(z.literal("")),
  tag: z
    .string()
    .trim()
    .min(2, "Label tag minimal 2 karakter.")
    .max(50, "Label tag maksimal 50 karakter."),
  caption: z
    .string()
    .trim()
    .min(5, "Keterangan foto minimal 5 karakter.")
    .max(220, "Keterangan foto maksimal 220 karakter."),
});

function slugifyGalleryTag(input: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
  return cleaned || "galeri";
}

function revalidateAboutGalleryCaches() {
  updateTag("about");
  revalidatePath("/about");
  revalidatePath("/vault");
}

function normalizeGalleryArray(raw: unknown): AboutGalleryPhotoJson[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is AboutGalleryPhotoJson =>
      Boolean(item && typeof item.id === "string" && typeof item.imageUrl === "string")
  );
}

/**
 * Add or update a photo in the /about editorial gallery. Accessible to Admin HIMATIKA & Medkraf.
 */
export async function upsertAboutGalleryPhoto(
  formData: FormData
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin HIMATIKA atau Medkraf yang dapat mengelola galeri halaman Tentang.",
    };
  }

  const rawId = formData.get("photo_id");
  const parsed = galleryPhotoSchema.safeParse({
    photo_id: typeof rawId === "string" ? rawId : "",
    tag: formData.get("tag"),
    caption: formData.get("caption"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ?? "Data foto galeri tidak valid.",
    };
  }

  const supabase = await createClient();
  const { data: siteRow, error: fetchError } = await supabase
    .from("site_about")
    .select("gallery_photos")
    .eq("id", "default")
    .maybeSingle();

  if (fetchError || !siteRow) {
    return {
      success: false,
      message: "Data halaman Tentang belum tersedia di database.",
    };
  }

  const currentPhotos = normalizeGalleryArray(siteRow.gallery_photos);
  const photoId = parsed.data.photo_id || "";
  const isEditing = photoId.length > 0;
  const existingIdx = isEditing
    ? currentPhotos.findIndex((p) => p.id === photoId)
    : -1;

  if (isEditing && existingIdx === -1) {
    return {
      success: false,
      message: "Foto galeri tidak ditemukan.",
    };
  }

  if (!isEditing && currentPhotos.length >= MAX_ABOUT_GALLERY_PHOTOS) {
    return {
      success: false,
      message: `Maksimal ${MAX_ABOUT_GALLERY_PHOTOS} foto untuk galeri halaman Tentang.`,
    };
  }

  const imageFile = formData.get("image_file");
  const hasNewFile = imageFile instanceof File && imageFile.size > 0;

  if (!isEditing && !hasNewFile) {
    return {
      success: false,
      message: "Berkas foto galeri wajib diunggah.",
    };
  }

  let nextImageUrl = isEditing ? currentPhotos[existingIdx].imageUrl : "";
  let newlyUploadedPath: string | null = null;

  if (hasNewFile) {
    const uploadRes = await uploadPublicAsset(
      supabase,
      imageFile,
      "about",
      `gal-${slugifyGalleryTag(parsed.data.tag)}`
    );
    if (uploadRes.error || !uploadRes.url) {
      return {
        success: false,
        message: uploadRes.error ?? "Gagal mengunggah foto galeri Tentang.",
      };
    }
    newlyUploadedPath = uploadRes.path ?? null;
    nextImageUrl = uploadRes.url;
  }

  const nextEntry: AboutGalleryPhotoJson = {
    id: isEditing ? photoId : `about-${crypto.randomUUID().slice(0, 8)}`,
    imageUrl: nextImageUrl,
    tag: parsed.data.tag.toUpperCase(),
    caption: parsed.data.caption,
  };

  const nextPhotos = isEditing
    ? currentPhotos.map((item, i) => (i === existingIdx ? nextEntry : item))
    : [...currentPhotos, nextEntry];

  const { error: updateError } = await supabase
    .from("site_about")
    .update({
      gallery_photos: nextPhotos,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (updateError) {
    if (newlyUploadedPath) {
      await supabase.storage.from("public-assets").remove([newlyUploadedPath]);
    }
    return {
      success: false,
      message: `Gagal menyimpan galeri foto Tentang: ${updateError.message}`,
    };
  }

  await removeUnusedPublicAssets(
    supabase,
    currentPhotos.map((p) => p.imageUrl),
    nextPhotos.map((p) => p.imageUrl)
  );
  revalidateAboutGalleryCaches();

  return {
    success: true,
    message: isEditing
      ? "Foto galeri Tentang berhasil diperbarui."
      : "Foto baru berhasil ditambahkan ke galeri Tentang.",
  };
}

/**
 * Move an /about gallery photo up or down in display order.
 */
export async function reorderAboutGalleryPhoto(
  photoId: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak.",
    };
  }

  const parsed = z
    .object({
      photoId: z.string().trim().min(1),
      direction: z.enum(["up", "down"]),
    })
    .safeParse({ photoId, direction });

  if (!parsed.success) {
    return { success: false, message: "Parameter urutan tidak valid." };
  }

  const supabase = await createClient();
  const { data: siteRow, error: fetchError } = await supabase
    .from("site_about")
    .select("gallery_photos")
    .eq("id", "default")
    .maybeSingle();

  if (fetchError || !siteRow) {
    return { success: false, message: "Gagal memuat galeri foto Tentang." };
  }

  const currentPhotos = normalizeGalleryArray(siteRow.gallery_photos);
  const idx = currentPhotos.findIndex((p) => p.id === parsed.data.photoId);
  if (idx === -1) {
    return { success: false, message: "Foto tidak ditemukan." };
  }

  const targetIdx = parsed.data.direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= currentPhotos.length) {
    return { success: true, message: "Urutan foto sudah di batas." };
  }

  const nextPhotos = [...currentPhotos];
  const [moved] = nextPhotos.splice(idx, 1);
  nextPhotos.splice(targetIdx, 0, moved);

  const { error: updateError } = await supabase
    .from("site_about")
    .update({
      gallery_photos: nextPhotos,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (updateError) {
    return {
      success: false,
      message: `Gagal mengubah urutan foto: ${updateError.message}`,
    };
  }

  revalidateAboutGalleryCaches();

  return {
    success: true,
    message: "Urutan foto galeri Tentang diperbarui.",
  };
}

/**
 * Remove a photo from the /about gallery and delete any orphaned Storage asset.
 */
export async function deleteAboutGalleryPhoto(
  photoId: string
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak.",
    };
  }

  if (!photoId || typeof photoId !== "string") {
    return { success: false, message: "ID foto tidak valid." };
  }

  const supabase = await createClient();
  const { data: siteRow, error: fetchError } = await supabase
    .from("site_about")
    .select("gallery_photos")
    .eq("id", "default")
    .maybeSingle();

  if (fetchError || !siteRow) {
    return { success: false, message: "Gagal memuat galeri foto Tentang." };
  }

  const currentPhotos = normalizeGalleryArray(siteRow.gallery_photos);
  const nextPhotos = currentPhotos.filter((p) => p.id !== photoId);

  const { error: updateError } = await supabase
    .from("site_about")
    .update({
      gallery_photos: nextPhotos,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (updateError) {
    return {
      success: false,
      message: `Gagal menghapus foto galeri: ${updateError.message}`,
    };
  }

  await removeUnusedPublicAssets(
    supabase,
    currentPhotos.map((p) => p.imageUrl),
    nextPhotos.map((p) => p.imageUrl)
  );
  revalidateAboutGalleryCaches();

  return {
    success: true,
    message: "Foto galeri Tentang berhasil dihapus.",
  };
}
