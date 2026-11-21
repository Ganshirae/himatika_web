const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://himatika-trilogi.vercel.app");

/**
 * Canonical public site URL for metadata, Open Graph, sitemap, and robots directives.
 */
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");
