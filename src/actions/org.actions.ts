"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageOrganization, getCurrentPengurus } from "@/lib/auth/session";
import type { ActionResult } from "@/types/finance.types";
import type { DivisionLeaderJson } from "@/types/database.types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const divisionUpdateSchema = z.object({
  id: z.string().uuid("ID divisi tidak valid."),
  name: z.string().trim().min(3, "Nama divisi minimal 3 karakter.").max(120),
  short_title: z.string().trim().min(2).max(60),
  short_desc: z.string().trim().min(10, "Deskripsi minimal 10 karakter.").max(400),
  leader_title: z.string().trim().min(2).max(80),
  tupoksi_text: z.string().trim().min(5, "Tupoksi wajib diisi."),
  focus_areas_text: z.string().trim(),
  member_groups_json: z.string().trim(),
  leaders_json: z.string().trim(),
});

const memberGroupArraySchema = z.array(
  z.object({
    role: z.string().trim().min(1),
    count: z.coerce.number().int().min(0).max(200),
  })
);

const leadersArraySchema = z
  .array(
    z.object({
      name: z.string().trim().min(2, "Nama pimpinan minimal 2 karakter.").max(120),
      role: z.string().trim().min(2, "Jabatan pimpinan minimal 2 karakter.").max(80),
      image: z
        .string()
        .trim()
        .refine(
          (val) => val.startsWith("/image/") || /^https:\/\/.+/.test(val),
          "Path atau URL foto pimpinan tidak valid."
        ),
    })
  )
  .min(1, "Minimal satu pimpinan divisi harus tercantum.");

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Validate and upload a leader portrait to the public-assets storage bucket.
 */
async function uploadLeaderPhoto(
  supabase: ServerSupabaseClient,
  divisionCode: string,
  index: number,
  file: File
): Promise<{ url?: string; error?: string }> {
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Ukuran foto pengurus maksimal 5 MB per berkas." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Format foto pengurus harus JPG, PNG, atau WebP." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const safeCode = divisionCode.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const filePath = `divisions/${safeCode}-leader-${index}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("public-assets")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { error: `Gagal mengunggah foto pengurus: ${uploadError.message}` };
  }

  const { data: urlData } = supabase.storage
    .from("public-assets")
    .getPublicUrl(filePath);

  return { url: urlData.publicUrl };
}

/**
 * Update organizational node/division leadership, portraits, tupoksi, member counts, and focus areas.
 */
export async function updateDivisionStructure(
  formData: FormData
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageOrganization(pengurus.profile.role)) {
    return {
      success: false,
      message:
        "Akses ditolak. Hanya Admin (BPH) yang dapat mengubah struktur organisasi.",
    };
  }

  const parsed = divisionUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    short_title: formData.get("short_title"),
    short_desc: formData.get("short_desc"),
    leader_title: formData.get("leader_title"),
    tupoksi_text: formData.get("tupoksi_text"),
    focus_areas_text: formData.get("focus_areas_text") || "",
    member_groups_json: formData.get("member_groups_json") || "[]",
    leaders_json: formData.get("leaders_json") || "[]",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data divisi tidak valid.",
    };
  }

  let parsedMembers;
  try {
    const rawJson = JSON.parse(parsed.data.member_groups_json);
    const membersCheck = memberGroupArraySchema.safeParse(rawJson);
    if (!membersCheck.success) {
      return { success: false, message: "Format susunan anggota tidak valid." };
    }
    parsedMembers = membersCheck.data;
  } catch {
    return { success: false, message: "JSON susunan anggota tidak dapat dibaca." };
  }

  let parsedLeaders: DivisionLeaderJson[];
  try {
    const rawLeaders = JSON.parse(parsed.data.leaders_json);
    const leadersCheck = leadersArraySchema.safeParse(rawLeaders);
    if (!leadersCheck.success) {
      return {
        success: false,
        message:
          leadersCheck.error.issues[0]?.message ?? "Data pimpinan tidak valid.",
      };
    }
    parsedLeaders = leadersCheck.data;
  } catch {
    return { success: false, message: "Format data pimpinan tidak dapat dibaca." };
  }

  const supabase = await createClient();

  const { data: currentDiv } = await supabase
    .from("divisions")
    .select("code, leader_image")
    .eq("id", parsed.data.id)
    .maybeSingle();

  const divisionCode = currentDiv?.code || "divisi";

  const updatedLeaders: DivisionLeaderJson[] = [];
  for (let i = 0; i < parsedLeaders.length; i++) {
    const leader = parsedLeaders[i];
    let imageUrl = leader.image;

    const uploadedFile = formData.get(`leader_file_${i}`);
    if (uploadedFile instanceof File && uploadedFile.size > 0) {
      const uploadResult = await uploadLeaderPhoto(
        supabase,
        divisionCode,
        i,
        uploadedFile
      );
      if (uploadResult.error || !uploadResult.url) {
        return {
          success: false,
          message: uploadResult.error ?? "Gagal memproses foto pengurus.",
        };
      }
      imageUrl = uploadResult.url;
    }

    updatedLeaders.push({
      name: leader.name,
      role: leader.role,
      image: imageUrl,
    });
  }

  const tupoksi = parsed.data.tupoksi_text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const focusAreas = parsed.data.focus_areas_text
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

  const primaryLeaderImage =
    updatedLeaders[0]?.image ?? currentDiv?.leader_image ?? "/image/logohima.png";
  const combinedLeaderName = updatedLeaders.map((l) => l.name).join(" & ");
  const resolvedLeaderTitle =
    updatedLeaders.length === 1
      ? updatedLeaders[0].role
      : parsed.data.leader_title;

  const { error } = await supabase
    .from("divisions")
    .update({
      name: parsed.data.name,
      short_title: parsed.data.short_title,
      short_desc: parsed.data.short_desc,
      leader_title: resolvedLeaderTitle,
      leader_name: combinedLeaderName,
      leader_image: primaryLeaderImage,
      leaders: updatedLeaders,
      tupoksi,
      focus_areas: focusAreas,
      member_groups: parsedMembers,
    })
    .eq("id", parsed.data.id);

  if (error) {
    return {
      success: false,
      message: `Gagal memperbarui struktur divisi: ${error.message}`,
    };
  }

  updateTag("divisions");
  revalidatePath("/struktur");
  revalidatePath("/about");
  revalidatePath("/vault");

  return {
    success: true,
    message: "Struktur divisi dan foto pengurus berhasil diperbarui.",
  };
}
