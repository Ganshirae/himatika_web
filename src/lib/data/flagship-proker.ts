export interface FeaturedProker {
  id: string;
  number: string;
  title: string;
  slug: string;
  divisionCode: string;
  divisionName: string;
  status: "upcoming" | "ongoing" | "completed";
  executionDate: string;
  shortDesc: string;
  coverImage: string;
}

export const FLAGSHIP_PROKERS: FeaturedProker[] = [
  {
    id: "proker-01",
    number: "01",
    title: "T-CAMP 2026: KADERISASI & LEADERSHIP",
    slug: "t-camp-2026",
    divisionCode: "BPSDM",
    divisionName: "KOLABORASI SEMUA DIVISI",
    status: "upcoming",
    executionDate: "NOVEMBER 2026",
    shortDesc:
      "Program kaderisasi dan latihan kepemimpinan mahasiswa Teknik Informatika untuk mempererat solidaritas, etika berorganisasi, dan kebersamaan angkatan.",
    coverImage: "/image/tcamp2024.jpg",
  },
  {
    id: "proker-02",
    number: "02",
    title: "TRILOGI IT EXPO & INNOVATION FEST",
    slug: "trilogi-it-expo",
    divisionCode: "PMB",
    divisionName: "PENGEMBANGAN MINAT & BAKAT",
    status: "upcoming",
    executionDate: "DESEMBER 2026",
    shortDesc:
      "Pameran inovasi teknologi tahunan, kompetisi karya software mahasiswa, turnamen esports kampus, dan showcase produk akhir berbasis teknologi tepat guna.",
    coverImage: "/image/t-expo.jpg",
  },
  {
    id: "proker-03",
    number: "03",
    title: "TECH WORKSHOP & CODING BOOTCAMP",
    slug: "tech-workshop-bootcamp",
    divisionCode: "RISET",
    divisionName: "RISET DAN KEILMUAN",
    status: "ongoing",
    executionDate: "OKTOBER 2026",
    shortDesc:
      "Pelatihan intensif pengembangan Full-Stack Web modern, Artificial Intelligence engineering, dan DevOps cloud bersama instruktur ahli dan praktisi industri teknologi.",
    coverImage: "/image/workshop.webp",
  },
  {
    id: "proker-04",
    number: "04",
    title: "INDUSTRIAL IMMERSION & COMPANY VISIT",
    slug: "company-visit-industrial",
    divisionCode: "HUMAS",
    divisionName: "HUBUNGAN MASYARAKAT",
    status: "completed",
    executionDate: "SEPTEMBER 2026",
    shortDesc:
      "Kunjungan industri ke perusahaan teknologi nasional (seperti MNC Group dan Jakarta Smart City) untuk memperluas wawasan karir dan dunia kerja profesional.",
    coverImage: "/image/Company Visit MNC.jpg",
  },
  {
    id: "proker-05",
    number: "05",
    title: "KOLABORASI TEKNOLOGI & KOMUNITAS",
    slug: "kolaborasi-teknologi",
    divisionCode: "KOLABORASI",
    divisionName: "KOLABORASI SEMUA DIVISI",
    status: "ongoing",
    executionDate: "PERIODE AKTIF",
    shortDesc:
      "Inisiatif kerja sama HIMATIKA bersama himpunan mahasiswa kampus lain dan komunitas developer luar (seperti GDSC) untuk mengadakan workshop bareng, sharing session, dan karya kolaborasi.",
    coverImage: "/image/kolaborasi.png",
  },
];
