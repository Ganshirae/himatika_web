"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canManageOrganization, getCurrentPengurus } from "@/lib/auth/session";
import type { ActionResult } from "@/types/finance.types";

const divisionUpdateSchema = z.object({
  id: z.string().uuid("ID divisi tidak valid."),
  name: z.string().trim().min(3, "Nama divisi minimal 3 karakter.").max(120),
  short_title: z.string().trim().min(2).max(60),
  short_desc: z.string().trim().min(10, "Deskripsi minimal 10 karakter.").max(400),
  leader_title: z.string().trim().min(2).max(80),
  leader_name: z.string().trim().min(2, "Nama pimpinan wajib diisi.").max(120),
  tupoksi_text: z.string().trim().min(5, "Tupoksi wajib diisi."),
  focus_areas_text: z.string().trim(),
  member_groups_json: z.string().trim(),
});

const memberGroupArraySchema = z.array(
  z.object({
    role: z.string().trim().min(1),
    count: z.coerce.number().int().min(0).max(200),
  })
);

/**
 * Update organizational node/division leadership, tupoksi, member counts, and focus areas.
 */
export async function updateDivisionStructure(
  formData: FormData
): Promise<ActionResult> {
  const pengurus = await getCurrentPengurus();
  if (!pengurus || !canManageOrganization(pengurus.profile.role)) {
    return {
      success: false,
      message: "Akses ditolak. Hanya Admin (BPH) yang dapat mengubah struktur organisasi.",
    };
  }

  const parsed = divisionUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    short_title: formData.get("short_title"),
    short_desc: formData.get("short_desc"),
    leader_title: formData.get("leader_title"),
    leader_name: formData.get("leader_name"),
    tupoksi_text: formData.get("tupoksi_text"),
    focus_areas_text: formData.get("focus_areas_text") || "",
    member_groups_json: formData.get("member_groups_json") || "[]",
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

  const tupoksi = parsed.data.tupoksi_text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const focusAreas = parsed.data.focus_areas_text
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

  const supabase = await createClient();

  const { data: currentDiv } = await supabase
    .from("divisions")
    .select("leaders, leader_image")
    .eq("id", parsed.data.id)
    .maybeSingle();

  const existingLeaders = Array.isArray(currentDiv?.leaders)
    ? (currentDiv.leaders as { name: string; role: string; image: string }[])
    : [];

  const updatedLeaders =
    existingLeaders.length === 1
      ? [
          {
            ...existingLeaders[0],
            name: parsed.data.leader_name,
            role: parsed.data.leader_title,
          },
        ]
      : existingLeaders;

  const { error } = await supabase
    .from("divisions")
    .update({
      name: parsed.data.name,
      short_title: parsed.data.short_title,
      short_desc: parsed.data.short_desc,
      leader_title: parsed.data.leader_title,
      leader_name: parsed.data.leader_name,
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
    message: "Struktur divisi berhasil diperbarui.",
  };
}
