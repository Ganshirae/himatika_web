import type { createClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const PUBLIC_ASSETS_MARKER = "/storage/v1/object/public/public-assets/";

/**
 * Validate and upload an image file into the `public-assets` bucket under the given folder/prefix.
 */
export async function uploadPublicAsset(
  supabase: ServerSupabaseClient,
  file: File,
  folder: string,
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
  const filePath = `${folder}/${pathPrefix}-${uniqueSuffix}.${ext}`;

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

/**
 * Extract the bucket-relative object path from a Supabase `public-assets` public URL.
 */
export function extractPublicAssetPath(
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

/**
 * Delete orphaned `public-assets` Storage objects when URLs are replaced or removed.
 */
export async function removeUnusedPublicAssets(
  supabase: ServerSupabaseClient,
  previousUrls: (string | null | undefined)[],
  activeUrls: (string | null | undefined)[]
) {
  const stillInUse = new Set(
    activeUrls.filter((u): u is string => typeof u === "string" && u.length > 0)
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
