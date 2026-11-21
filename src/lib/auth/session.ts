import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, UserProfile } from "@/types/database.types";

export interface AuthenticatedPengurus {
  userId: string;
  email: string;
  profile: UserProfile;
}

/**
 * Read currently authenticated user and their RBAC profile from Supabase.
 * Returns null if unauthenticated or profile is missing/inactive.
 */
export async function getCurrentPengurus(): Promise<AuthenticatedPengurus | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, full_name, role, division_code, is_active, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || !profile.is_active) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    profile: profile as UserProfile,
  };
}

export function canManageFinance(role: AppRole): boolean {
  return role === "bendahara" || role === "admin";
}

export function canManageProker(role: AppRole): boolean {
  return role === "medkraf" || role === "admin";
}

export function canManageOrganization(role: AppRole): boolean {
  return role === "admin";
}
