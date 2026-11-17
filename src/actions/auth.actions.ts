"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  error?: string;
}

const loginSchema = z.object({
  email: z.string().trim().email("Format email pengurus tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

/**
 * Authenticate HIMATIKA committee member via Supabase SSR cookie session.
 */
export async function loginUser(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data login tidak valid.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      error:
        error?.message === "Invalid login credentials"
          ? "Email atau kata sandi pengurus tidak sesuai. Silakan periksa kembali."
          : error?.message ?? "Gagal melakukan autentikasi.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      error:
        "Akun Anda belum terdaftar sebagai pengurus aktif di user_profiles. Hubungi admin HIMATIKA.",
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return {
      error: "Akun pengurus ini sedang dinonaktifkan.",
    };
  }

  redirect("/vault");
}

/**
 * Terminate current pengurus session and redirect back to login portal.
 */
export async function logoutUser(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
