import type { AboutMissionJson, SiteAboutRow } from "@/types/database.types";

export interface SiteAboutContent {
  introPrimary: string;
  introSecondary: string;
  visionText: string;
  periodLabel: string;
  logoImageUrl: string;
  missions: AboutMissionJson[];
}

export const DEFAULT_SITE_ABOUT: SiteAboutContent = {
  introPrimary:
    "Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi adalah organisasi kemahasiswaan resmi yang menjadi wadah pemersatu, inkubasi keilmuan, dan ruang kreasi bagi seluruh mahasiswa Teknik Informatika.",
  introSecondary:
    "Berakar pada semangat teknopreneur, kolaborasi, dan kemandirian, HIMATIKA berkomitmen mendampingi mahasiswa dari ranah akademik hingga kesiapan profesional di industri teknologi digital.",
  visionText:
    "MENJADIKAN HIMATIKA UNIVERSITAS TRILOGI SEBAGAI RUANG TUMBUH BAGI MAHASISWA TEKNIK INFORMATIKA YANG UNGGUL, BERINTEGRITAS, INOVATIF, DAN SIAP BERKONTRIBUSI DI INDUSTRI TEKNOLOGI.",
  periodLabel: "PERIODE 2026/2027",
  logoImageUrl: "/image/Logo Himatika.webp",
  missions: [
    {
      num: "01",
      tag: "AKADEMIK & RISET",
      title: "PENGUASAAN KEILMUAN & RISET",
      desc: "Mengembangkan keilmuan mahasiswa melalui workshop pemrograman, studi teknologi terkini, riset software, dan persiapan delegasi kompetisi IT.",
    },
    {
      num: "02",
      tag: "KARAKTER & SOLIDARITAS",
      title: "KEPEMIMPINAN & KEKELUARGAAN",
      desc: "Membentuk kepemimpinan yang beretika serta mempererat rasa kekeluargaan dan solidaritas antar-angkatan mahasiswa Teknik Informatika.",
    },
    {
      num: "03",
      tag: "KEMITRAAN AKTIF",
      title: "KOLABORASI INDUSTRI & ALUMNI",
      desc: "Membangun relasi aktif dengan industri teknologi, komunitas open-source, dan ikatan alumni untuk membuka peluang riset, magang, dan karir.",
    },
    {
      num: "04",
      tag: "TECHNOPRENEURSHIP",
      title: "INOVASI & KONTRIBUSI NYATA",
      desc: "Mendorong lahirnya karya teknologi tepat guna, penyelenggaraan Trilogi IT Expo tahunan, serta menumbuhkan jiwa technopreneurship mahasiswa.",
    },
  ],
};

export function mapSiteAboutRow(row: SiteAboutRow | null | undefined): SiteAboutContent {
  if (!row) return DEFAULT_SITE_ABOUT;
  const missions =
    Array.isArray(row.missions) && row.missions.length > 0
      ? row.missions
      : DEFAULT_SITE_ABOUT.missions;

  return {
    introPrimary: row.intro_primary || DEFAULT_SITE_ABOUT.introPrimary,
    introSecondary: row.intro_secondary || DEFAULT_SITE_ABOUT.introSecondary,
    visionText: row.vision_text || DEFAULT_SITE_ABOUT.visionText,
    periodLabel: row.period_label || DEFAULT_SITE_ABOUT.periodLabel,
    logoImageUrl: row.logo_image_url || DEFAULT_SITE_ABOUT.logoImageUrl,
    missions,
  };
}
