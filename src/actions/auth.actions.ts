"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  error?: string;
}

const INTERNAL_AUTH_DOMAIN = "himatika.internal";
const USERNAME_PATTERN = /^[a-z0-9._-]+$/;
const emailSchema = z.string().email();

/**
 * Resolve a committee username (e.g. "admin", "bendahara", "medkraf") or full email
 * into the canonical Supabase Auth email address.
 */
function resolveLoginEmail(rawIdentifier: string): string | null {
  const normalized = rawIdentifier.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes("@")) {
    return emailSchema.safeParse(normalized).success ? normalized : null;
  }

  if (USERNAME_PATTERN.test(normalized)) {
    return `${normalized}@${INTERNAL_AUTH_DOMAIN}`;
  }

  return null;
}

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username jabatan atau email pengurus wajib diisi.")
    .transform((val, ctx) => {
      const resolved = resolveLoginEmail(val);
      if (!resolved) {
        ctx.addIssue({
          code: "custom",
          message:
            "Gunakan username jabatan (admin, bendahara, medkraf) atau format email yang valid.",
        });
        return z.NEVER;
      }
      return resolved;
    }),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

/**
 * Authenticate HIMATIKA committee member via Supabase SSR cookie session.
 */
export async function loginUser(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawIdentifier =
    formData.get("identifier") ?? formData.get("email") ?? "";

  const parsed = loginSchema.safeParse({
    identifier: rawIdentifier,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Data login tidak valid.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.identifier,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      error:
        error?.message === "Invalid login credentials"
          ? "Username/email atau kata sandi pengurus tidak sesuai. Silakan periksa kembali."
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
