import type { HeroSlideRow } from "@/types/database.types";

export interface HeroSlideItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideItem[] = [
  {
    id: "default-1",
    image: "/image/tcamp2024.webp",
    title: "T-CAMP SOLIDARITAS",
    category: "BPSDM",
  },
  {
    id: "default-2",
    image: "/image/Company Visit MNC.webp",
    title: "COMPANY VISIT MNC",
    category: "HUMAS",
  },
  {
    id: "default-3",
    image: "/image/t-expo.webp",
    title: "TRILOGI IT EXPO",
    category: "PMB",
  },
  {
    id: "default-4",
    image: "/image/workshop.webp",
    title: "TECH WORKSHOP",
    category: "RISET",
  },
];

/**
 * Convert a Supabase `hero_slides` row into the UI slide shape consumed by HeroSection.
 */
export function mapHeroSlideRow(row: HeroSlideRow): HeroSlideItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image_url,
  };
}
