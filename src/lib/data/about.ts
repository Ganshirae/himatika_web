import type {
  AboutGalleryPhotoJson,
  AboutMissionJson,
  SiteAboutRow,
} from "@/types/database.types";

export interface SiteAboutContent {
  introPrimary: string;
  introSecondary: string;
  visionText: string;
  periodLabel: string;
  logoImageUrl: string;
  missions: AboutMissionJson[];
  galleryPhotos: AboutGalleryPhotoJson[];
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
  galleryPhotos: [
    {
      id: "about-1",
      imageUrl: "/image/tcamp2024.webp",
      tag: "SOLIDARITAS & KEPEMIMPINAN",
      caption:
        "Pembinaan karakter mahasiswa baru dalam malam puncak T-Camp HIMATIKA.",
    },
    {
      id: "about-2",
      imageUrl: "/image/Company Visit MNC.webp",
      tag: "WAWASAN INDUSTRI",
      caption:
        "Kunjungan langsung mahasiswa Teknik Informatika ke ekosistem industri teknologi nasional.",
    },
    {
      id: "about-3",
      imageUrl: "/image/t-expo.webp",
      tag: "INOVASI & KARYA",
      caption:
        "Pameran inovasi digital dan karya teknologi mahasiswa di Trilogi IT Expo.",
    },
    {
      id: "about-4",
      imageUrl: "/image/workshop.webp",
      tag: "RISET & WORKSHOP",
      caption:
        "Sesi eksplorasi pemrograman, workshop teknis, dan belajar kolaboratif bersama.",
    },
  ],
};

export function mapSiteAboutRow(row: SiteAboutRow | null | undefined): SiteAboutContent {
  if (!row) return DEFAULT_SITE_ABOUT;
  const missions =
    Array.isArray(row.missions) && row.missions.length > 0
      ? row.missions
      : DEFAULT_SITE_ABOUT.missions;
  const galleryPhotos = Array.isArray(row.gallery_photos)
    ? row.gallery_photos.filter(
        (p): p is AboutGalleryPhotoJson =>
          Boolean(p && typeof p.imageUrl === "string" && p.imageUrl.length > 0)
      )
    : DEFAULT_SITE_ABOUT.galleryPhotos;

  return {
    introPrimary: row.intro_primary || DEFAULT_SITE_ABOUT.introPrimary,
    introSecondary: row.intro_secondary || DEFAULT_SITE_ABOUT.introSecondary,
    visionText: row.vision_text || DEFAULT_SITE_ABOUT.visionText,
    periodLabel: row.period_label || DEFAULT_SITE_ABOUT.periodLabel,
    logoImageUrl: row.logo_image_url || DEFAULT_SITE_ABOUT.logoImageUrl,
    missions,
    galleryPhotos,
  };
}
