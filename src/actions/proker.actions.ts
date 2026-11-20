"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageProker, getCurrentPengurus } from "@/lib/auth/session";
import { normalizeWhatsappUrl } from "@/lib/utils";
import type { ActionResult } from "@/types/finance.types";
import type {
  ProkerContactJson,
  ProkerRundownJson,
  ProkerStatus,
} from "@/types/database.types";

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
  rundown_text: z.string().trim().optional(),
  registration_link: z
    .string()
    .trim()
    .url("Link pendaftaran harus berupa URL valid (https://...)")
    .optional()
    .or(z.literal("")),
  contact_name: z.string().trim().max(100).optional(),
  contact_role: z.string().trim().max(100).optional(),
  contact_phone: z.string().trim().max(160).optional(),
  existing_cover_url: z.string().trim().optional(),
  existing_gallery_json: z.string().trim().optional(),
  remove_cover: z.boolean().optional(),
  is_featured: z.boolean(),
  is_white_background: z.boolean(),
});

const PUBLIC_ASSETS_MARKER = "/storage/v1/object/public/public-assets/";

function extractPublicAssetPath(
  publicUrl: string | null | undefined
): string | null {
  if (!publicUrl) return null;
  const markerIdx = publicUrl.indexOf(PUBLIC_ASSETS_MARKER);
  if (markerIdx === -1) return null;
  const rawPath = publicUrl
    .slice(markerIdx + PUBLIC_ASSETS_MARKER.length)
    .split("?")[0];
  try {
    const decoded = decodeURIComponent(rawPath);
    return decoded.length > 0 ? decoded : null;
  } catch {
    return rawPath.length > 0 ? rawPath : null;
  }
}

async function removeUnusedPublicAssets(
  supabase: Awaited<ReturnType<typeof createClient>>,
  previousUrls: (string | null | undefined)[],
  activeUrls: (string | null | undefined)[]
) {
  const stillInUse = new Set(
    activeUrls.filter((u): u is string => Boolean(u))
  );
  const pathsToDelete = Array.from(
    new Set(
      previousUrls
        .filter((url): url is string => typeof url === "string" && url.length > 0)
        .filter((url) => !stillInUse.has(url))
        .map(extractPublicAssetPath)
        .filter((path): path is string => Boolean(path))
    )
  );

  if (pathsToDelete.length > 0) {
    await supabase.storage.from("public-assets").remove(pathsToDelete);
  }
}

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

async function uploadProkerAsset(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  pathPrefix: string
): Promise<{ url?: string; path?: string; error?: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Ukuran setiap gambar maksimal 5 MB." };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Gambar harus berformat JPG, PNG, atau WebP." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const uniqueSuffix = `${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;
  const filePath = `prokers/${pathPrefix}-${uniqueSuffix}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("public-assets")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { error: `Gagal mengunggah gambar: ${uploadError.message}` };
  }

  const { data: urlData } = supabase.storage
    .from("public-assets")
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl, path: filePath };
}

function parseRundownLines(text: string): ProkerRundownJson[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sepIdx = line.indexOf("|");
      if (sepIdx === -1) {
        return { time: "AGENDA", activity: line };
      }
      return {
        time: line.slice(0, sepIdx).trim() || "AGENDA",
        activity: line.slice(sepIdx + 1).trim(),
      };
    })
    .filter((item) => item.activity.length > 0);
}

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
    rundown_text: formData.get("rundown_text") || "",
    registration_link: formData.get("registration_link") || "",
    contact_name: formData.get("contact_name") || "",
    contact_role: formData.get("contact_role") || "",
    contact_phone: formData.get("contact_phone") || "",
    existing_cover_url: formData.get("existing_cover_url") || "",
    existing_gallery_json: formData.get("existing_gallery_json") || "[]",
    remove_cover: formData.get("remove_cover") === "true",
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
  const isEdit = Boolean(parsed.data.id);

  let existingRow: {
    cover_image_url: string | null;
    gallery_images: string[] | null;
  } | null = null;
  if (isEdit && parsed.data.id) {
    const { data } = await supabase
      .from("work_programs")
      .select("cover_image_url, gallery_images")
      .eq("id", parsed.data.id)
      .maybeSingle();
    existingRow = data;
  }

  const newlyUploadedPaths: string[] = [];
  let coverUrl: string | null = parsed.data.remove_cover
    ? null
    : parsed.data.existing_cover_url || null;

  const coverFile = formData.get("cover_file");
  if (coverFile instanceof File && coverFile.size > 0) {
    const uploadRes = await uploadProkerAsset(supabase, coverFile, parsed.data.slug);
    if (uploadRes.error || !uploadRes.url) {
      return { success: false, message: uploadRes.error ?? "Gagal mengunggah poster." };
    }
    if (uploadRes.path) newlyUploadedPaths.push(uploadRes.path);
    coverUrl = uploadRes.url;
  }

  // Preserve remaining gallery URLs and append newly uploaded gallery files
  let preservedGallery: string[] = [];
  try {
    const rawGallery = JSON.parse(parsed.data.existing_gallery_json || "[]");
    if (Array.isArray(rawGallery)) {
      preservedGallery = rawGallery.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0
      );
    }
  } catch {
    preservedGallery = [];
  }

  const uploadedGalleryUrls: string[] = [];
  const rawGalleryFiles = formData.getAll("gallery_files");
  for (const entry of rawGalleryFiles) {
    if (entry instanceof File && entry.size > 0) {
      const uploadRes = await uploadProkerAsset(
        supabase,
        entry,
        `${parsed.data.slug}-gal`
      );
      if (uploadRes.error) {
        if (newlyUploadedPaths.length > 0) {
          await supabase.storage.from("public-assets").remove(newlyUploadedPaths);
        }
        return { success: false, message: uploadRes.error };
      }
      if (uploadRes.path) newlyUploadedPaths.push(uploadRes.path);
      if (uploadRes.url) {
        uploadedGalleryUrls.push(uploadRes.url);
      }
    }
  }

  const combinedGallery = Array.from(
    new Set([...preservedGallery, ...uploadedGalleryUrls])
  );

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

  const rundown = parseRundownLines(parsed.data.rundown_text ?? "");

  const contactName = parsed.data.contact_name?.trim() ?? "";
  const contactPhone = parsed.data.contact_phone?.trim() ?? "";
  const contactPerson: ProkerContactJson | null =
    contactName && contactPhone
      ? {
          name: contactName,
          role: parsed.data.contact_role?.trim() || "Narahubung Kegiatan",
          contact: normalizeWhatsappUrl(contactPhone),
        }
      : null;

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
    rundown,
    cover_image_url: coverUrl,
    gallery_images: combinedGallery,
    registration_link: parsed.data.registration_link || null,
    contact_person: contactPerson,
    is_featured: parsed.data.is_featured,
    is_white_background: parsed.data.is_white_background,
  };

  const { error } =
    isEdit && parsed.data.id
      ? await supabase.from("work_programs").update(payload).eq("id", parsed.data.id)
      : await supabase.from("work_programs").insert(payload);

  if (error) {
    if (newlyUploadedPaths.length > 0) {
      await supabase.storage.from("public-assets").remove(newlyUploadedPaths);
    }
    return {
      success: false,
      message: `Gagal menyimpan program kerja: ${error.message}`,
    };
  }

  if (existingRow) {
    await removeUnusedPublicAssets(
      supabase,
      [existingRow.cover_image_url, ...(existingRow.gallery_images ?? [])],
      [coverUrl, ...combinedGallery]
    );
  }

  updateTag("prokers");
  updateTag("divisions");
  revalidatePath("/proker");
  revalidatePath(`/proker/${parsed.data.slug}`);
  revalidatePath("/struktur");
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
  updateTag("divisions");
  revalidatePath("/proker");
  revalidatePath("/struktur");
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
  const { data: existingRow } = await supabase
    .from("work_programs")
    .select("cover_image_url, gallery_images")
    .eq("id", idCheck.data)
    .maybeSingle();

  const { error } = await supabase
    .from("work_programs")
    .delete()
    .eq("id", idCheck.data);

  if (error) {
    return { success: false, message: `Gagal menghapus program kerja: ${error.message}` };
  }

  if (existingRow) {
    await removeUnusedPublicAssets(
      supabase,
      [existingRow.cover_image_url, ...(existingRow.gallery_images ?? [])],
      []
    );
  }

  updateTag("prokers");
  updateTag("divisions");
  revalidatePath("/proker");
  revalidatePath("/struktur");
  revalidatePath("/");
  revalidatePath("/vault");

  return { success: true, message: "Program kerja berhasil dihapus." };
}
