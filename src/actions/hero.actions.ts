"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageProker, getCurrentPengurus } from "@/lib/auth/session";
import {
  removeUnusedPublicAssets,
  uploadPublicAsset,
} from "@/lib/supabase/storage";
import type { ActionResult } from "@/types/finance.types";

const heroSlideSchema = z.object({
  id: z.string().trim().uuid().optional().or(z.literal("")),
  title: z
    .string()
    .trim()
    .min(2, "Judul slide minimal 2 karakter.")
    .max(100, "Judul slide maksimal 100 karakter."),
  category: z
    .string()
    .trim()
    .min(2, "Kategori minimal 2 karakter.")
    .max(40, "Kategori maksimal 40 karakter."),
  order_index: z.coerce.number().int().min(0).max(999),
  is_active: z.boolean(),
});

function revalidateHeroCaches() {
  updateTag("hero-slides");
  revalidatePath("/");
  revalidatePath("/vault");
}

function slugifyPrefix(input: string): string {
  const cleaned = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return cleaned || "slide";
}

async function requireHeroManager() {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageProker(pengurus.profile.role)) {
    return null;
  }
  return pengurus;
}

/**
 * Create or update a Hero Background Slideshow entry, including photo upload to `public-assets/hero`.
 */
export async function upsertHeroSlide(formData: FormData): Promise<ActionResult> {
  const pengurus = await requireHeroManager();
  if (!pengurus) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin BPH atau Medkraf yang dapat mengelola slider beranda.",
    };
  }

  const rawId = formData.get("id");
  const parsed = heroSlideSchema.safeParse({
    id: typeof rawId === "string" ? rawId : "",
    title: formData.get("title"),
    category: formData.get("category"),
    order_index: formData.get("order_index"),
    is_active: formData.get("is_active") === "true",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data slide beranda tidak valid.",
    };
  }

  const supabase = await createClient();
  const slideId = parsed.data.id || "";
  const isEditing = slideId.length > 0;

  let existingImageUrl: string | null = null;
  if (isEditing) {
    const { data: existingRow, error: fetchError } = await supabase
      .from("hero_slides")
      .select("id, image_url")
      .eq("id", slideId)
      .maybeSingle();

    if (fetchError || !existingRow) {
      return {
        success: false,
        message: "Slide tidak ditemukan.",
      };
    }
    existingImageUrl = existingRow.image_url;
  }

  const imageFile = formData.get("image_file");
  const hasNewFile = imageFile instanceof File && imageFile.size > 0;

  if (!isEditing && !hasNewFile) {
    return {
      success: false,
      message: "Foto latar slide wajib diunggah.",
    };
  }

  let nextImageUrl = existingImageUrl ?? "";
  let newlyUploadedPath: string | null = null;

  if (hasNewFile) {
    const uploadRes = await uploadPublicAsset(
      supabase,
      imageFile,
      "hero",
      slugifyPrefix(parsed.data.title)
    );
    if (uploadRes.error || !uploadRes.url) {
      return {
        success: false,
        message: uploadRes.error ?? "Gagal mengunggah foto slide.",
      };
    }
    newlyUploadedPath = uploadRes.path ?? null;
    nextImageUrl = uploadRes.url;
  }

  const payload = {
    title: parsed.data.title.toUpperCase(),
    category: parsed.data.category.toUpperCase(),
    image_url: nextImageUrl,
    order_index: parsed.data.order_index,
    is_active: parsed.data.is_active,
  };

  const { error: dbError } = isEditing
    ? await supabase.from("hero_slides").update(payload).eq("id", slideId)
    : await supabase.from("hero_slides").insert(payload);

  if (dbError) {
    if (newlyUploadedPath) {
      await supabase.storage.from("public-assets").remove([newlyUploadedPath]);
    }
    return {
      success: false,
      message: `Gagal menyimpan slide beranda: ${dbError.message}`,
    };
  }

  if (isEditing && existingImageUrl) {
    await removeUnusedPublicAssets(supabase, [existingImageUrl], [nextImageUrl]);
  }

  revalidateHeroCaches();

  return {
    success: true,
    message: isEditing
      ? "Slide beranda berhasil diperbarui."
      : "Slide beranda baru berhasil ditambahkan.",
  };
}

/**
 * Toggle whether a Hero slide is active on the public home page.
 */
export async function toggleHeroSlideActive(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  const pengurus = await requireHeroManager();
  if (!pengurus) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin BPH atau Medkraf yang dapat mengubah status slide.",
    };
  }

  const parsedId = z.string().uuid("ID slide tidak valid.").safeParse(id);
  if (!parsedId.success) {
    return {
      success: false,
      message: parsedId.error.issues[0]?.message ?? "ID slide tidak valid.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("hero_slides")
    .update({ is_active: isActive })
    .eq("id", parsedId.data);

  if (error) {
    return {
      success: false,
      message: `Gagal memperbarui status slide: ${error.message}`,
    };
  }

  revalidateHeroCaches();

  return {
    success: true,
    message: isActive
      ? "Slide diaktifkan di halaman beranda."
      : "Slide dinonaktifkan dari halaman beranda.",
  };
}

/**
 * Move a Hero slide up or down in display order and normalize sequential order_index values.
 */
export async function reorderHeroSlide(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  const pengurus = await requireHeroManager();
  if (!pengurus) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin BPH atau Medkraf yang dapat mengatur urutan slide.",
    };
  }

  const parsed = z
    .object({
      id: z.string().uuid("ID slide tidak valid."),
      direction: z.enum(["up", "down"]),
    })
    .safeParse({ id, direction });

  if (!parsed.success) {
    return {
      success: false,
      message: "Parameter urutan slide tidak valid.",
    };
  }

  const supabase = await createClient();
  const { data: rows, error: fetchError } = await supabase
    .from("hero_slides")
    .select("id, order_index")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (fetchError || !rows) {
    return {
      success: false,
      message: `Gagal memuat urutan slide: ${fetchError?.message ?? "Unknown"}`,
    };
  }

  const idx = rows.findIndex((r) => r.id === parsed.data.id);
  if (idx === -1) {
    return {
      success: false,
      message: "Slide tidak ditemukan.",
    };
  }

  const targetIdx = parsed.data.direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= rows.length) {
    return {
      success: true,
      message: "Urutan slide sudah di batas.",
    };
  }

  const reordered = [...rows];
  const [moved] = reordered.splice(idx, 1);
  reordered.splice(targetIdx, 0, moved);

  const updates = reordered
    .map((row, index) => ({
      id: row.id,
      prevOrder: row.order_index,
      nextOrder: index + 1,
    }))
    .filter((item) => item.prevOrder !== item.nextOrder);

  if (updates.length > 0) {
    const results = await Promise.all(
      updates.map((item) =>
        supabase
          .from("hero_slides")
          .update({ order_index: item.nextOrder })
          .eq("id", item.id)
      )
    );

    const failed = results.find((res) => res.error);
    if (failed?.error) {
      return {
        success: false,
        message: `Gagal memperbarui urutan slide: ${failed.error.message}`,
      };
    }
  }

  revalidateHeroCaches();

  return {
    success: true,
    message: "Urutan slide beranda diperbarui.",
  };
}

/**
 * Delete a Hero slide and clean up any orphaned Storage asset in `public-assets`.
 */
export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const pengurus = await requireHeroManager();
  if (!pengurus) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin BPH atau Medkraf yang dapat menghapus slide.",
    };
  }

  const parsedId = z.string().uuid("ID slide tidak valid.").safeParse(id);
  if (!parsedId.success) {
    return {
      success: false,
      message: parsedId.error.issues[0]?.message ?? "ID slide tidak valid.",
    };
  }

  const supabase = await createClient();
  const { data: existingRow } = await supabase
    .from("hero_slides")
    .select("image_url")
    .eq("id", parsedId.data)
    .maybeSingle();

  const { error } = await supabase
    .from("hero_slides")
    .delete()
    .eq("id", parsedId.data);

  if (error) {
    return {
      success: false,
      message: `Gagal menghapus slide beranda: ${error.message}`,
    };
  }

  await removeUnusedPublicAssets(supabase, [existingRow?.image_url], []);
  revalidateHeroCaches();

  return {
    success: true,
    message: "Slide beranda berhasil dihapus.",
  };
}
