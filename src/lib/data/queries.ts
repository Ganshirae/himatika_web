import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { ALL_PROKERS, type ProkerItem } from "@/lib/data/proker";
import { FLAGSHIP_PROKERS, type FeaturedProker } from "@/lib/data/flagship-proker";
import { ORG_NODES, type OrgNode } from "@/lib/data/organization";
import {
  DEFAULT_SITE_ABOUT,
  mapSiteAboutRow,
  type SiteAboutContent,
} from "@/lib/data/about";
import {
  DEFAULT_HERO_SLIDES,
  mapHeroSlideRow,
  type HeroSlideItem,
} from "@/lib/data/hero-slides";
import type {
  DivisionRow,
  FinanceCategoryRow,
  FinancialSummary,
  HeroSlideRow,
  PublicFinanceRecordRow,
  SiteAboutRow,
  WorkProgramRow,
} from "@/types/database.types";
import type { PublicTransactionItem } from "@/types/finance.types";

function mapRowToProkerItem(row: WorkProgramRow, index: number): ProkerItem {
  const fullDesc = row.full_content
    ? row.full_content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [row.short_desc];

  return {
    id: row.id,
    number: row.highlight_number || String(index + 1).padStart(2, "0"),
    title: row.title,
    slug: row.slug,
    divisionCode: row.division_code || "KOLABORASI",
    divisionName: row.division_name || "KOLABORASI SEMUA DIVISI",
    status: row.status,
    executionDate: row.execution_label || row.execution_date || "PERIODE 2026/2027",
    location: row.location || "Universitas Trilogi",
    targetAudience: row.target_audience || "Mahasiswa Teknik Informatika",
    shortDesc: row.short_desc,
    fullDesc,
    objectives: row.objectives ?? [],
    rundown: Array.isArray(row.rundown) ? row.rundown : [],
    coverImage: row.cover_image_url || undefined,
    isWhiteBackground: Boolean(row.is_white_background),
    galleryImages: row.gallery_images ?? [],
    registrationLink: row.registration_link ?? undefined,
    contactPerson: row.contact_person ?? undefined,
    isFeatured: Boolean(row.is_featured),
  };
}

function mapRowToOrgNode(
  row: DivisionRow,
  liveProkers: ProkerItem[]
): OrgNode {
  const level = (row.level === 1 || row.level === 2 || row.level === 3 ? row.level : 3) as
    | 1
    | 2
    | 3;

  // Match work programs belonging to this division (Presidium also includes KOLABORASI initiatives)
  const matchedProkers = liveProkers
    .filter(
      (p) =>
        p.divisionCode === row.code ||
        (row.code === "PRESIDIUM" && p.divisionCode === "KOLABORASI")
    )
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      status: p.status,
    }));

  return {
    id: row.id,
    code: row.code,
    name: row.name,
    shortTitle: row.short_title || row.name.toUpperCase(),
    level,
    levelName: row.level_name || "DIVISI PELAKSANA",
    shortDesc: row.short_desc || "",
    tupoksi: row.tupoksi ?? [],
    leaderTitle: row.leader_title || "Koordinator Divisi",
    leaderName: row.leader_name,
    leaderImage: row.leader_image ?? undefined,
    leaders: Array.isArray(row.leaders) ? row.leaders : [],
    members: Array.isArray(row.member_groups) ? row.member_groups : [],
    activeProkers: matchedProkers,
    focusAreas: row.focus_areas ?? [],
  };
}

/**
 * Fetch public-safe financial summary, non-sensitive transactions, and categories.
 */
export async function getPublicFinanceData(): Promise<{
  summary: FinancialSummary;
  transactions: PublicTransactionItem[];
  categories: FinanceCategoryRow[];
}> {
  "use cache";
  cacheLife("minutes");
  cacheTag("finance");

  const supabase = createPublicClient();

  const [summaryRes, recordsRes, categoriesRes] = await Promise.all([
    supabase.rpc("get_financial_summary"),
    supabase
      .from("v_public_finance_records")
      .select("id, title, amount, type, category_id, category_name, transaction_date, created_at")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("finance_categories").select("id, name, type").order("name", { ascending: true }),
  ]);

  const rawSummary = Array.isArray(summaryRes.data)
    ? summaryRes.data[0]
    : summaryRes.data;

  const summary: FinancialSummary = {
    total_income: Number(rawSummary?.total_income ?? 0),
    total_expense: Number(rawSummary?.total_expense ?? 0),
    current_balance: Number(rawSummary?.current_balance ?? 0),
  };

  const transactions: PublicTransactionItem[] = (
    (recordsRes.data ?? []) as PublicFinanceRecordRow[]
  ).map((row) => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    type: row.type,
    categoryId: row.category_id,
    categoryName: row.category_name || "Lainnya",
    transactionDate: row.transaction_date,
    createdAt: row.created_at,
  }));

  const categories = (categoriesRes.data ?? []) as FinanceCategoryRow[];

  return { summary, transactions, categories };
}

/**
 * Fetch all work programs from Supabase with fallback to static catalog.
 */
export async function getPublicProkers(): Promise<ProkerItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("prokers");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("work_programs")
      .select("*")
      .order("highlight_number", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return ALL_PROKERS;
    }

    return (data as WorkProgramRow[]).map(mapRowToProkerItem);
  } catch {
    return ALL_PROKERS;
  }
}

export async function getPublicProkerBySlug(slug: string): Promise<ProkerItem | null> {
  const prokers = await getPublicProkers();
  return prokers.find((item) => item.slug === slug) ?? null;
}

/**
 * Fetch featured flagship prokers for the Home ShowcaseSlider.
 */
export async function getFeaturedProkers(): Promise<FeaturedProker[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("prokers");

  const prokers = await getPublicProkers();
  const featured = prokers.filter((p) => p.isFeatured);
  if (featured.length === 0) {
    return FLAGSHIP_PROKERS;
  }

  return featured.map((p, idx) => ({
    id: p.id,
    number: String(idx + 1).padStart(2, "0"),
    title: p.title,
    slug: p.slug,
    divisionCode: p.divisionCode,
    divisionName: p.divisionName,
    status: p.status,
    executionDate: p.executionDate,
    shortDesc: p.shortDesc,
    coverImage: p.coverImage,
    isWhiteBackground: Boolean(p.isWhiteBackground),
  }));
}

/**
 * Fetch organizational nodes/divisions from Supabase with fallback to static blueprint.
 */
export async function getPublicOrgNodes(): Promise<OrgNode[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("divisions");
  cacheTag("prokers");

  try {
    const supabase = createPublicClient();
    const [{ data, error }, liveProkers] = await Promise.all([
      supabase
        .from("divisions")
        .select("*")
        .order("order_index", { ascending: true }),
      getPublicProkers(),
    ]);

    if (error || !data || data.length === 0) {
      return ORG_NODES;
    }

    return (data as DivisionRow[]).map((row) => mapRowToOrgNode(row, liveProkers));
  } catch {
    return ORG_NODES;
  }
}

/**
 * Fetch editable /about profile, vision, missions, and active period with static fallback.
 */
export async function getSiteAbout(): Promise<SiteAboutContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag("about");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_about")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_SITE_ABOUT;
    }

    return mapSiteAboutRow(data as SiteAboutRow);
  } catch {
    return DEFAULT_SITE_ABOUT;
  }
}

/**
 * Fetch active Hero Background Slideshow items for the home page, with static fallback.
 */
export async function getPublicHeroSlides(): Promise<HeroSlideItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("hero-slides");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_HERO_SLIDES;
    }

    return (data as HeroSlideRow[]).map(mapHeroSlideRow);
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}
