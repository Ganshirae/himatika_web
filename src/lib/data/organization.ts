export interface LeaderInfo {
  name: string;
  role: string;
  image: string;
}

export interface OrgNode {
  id: string;
  code: string;
  name: string;
  shortTitle: string;
  level: 1 | 2 | 3;
  levelName: string;
  shortDesc: string;
  tupoksi: string[];
  leaderTitle: string;
  leaderName: string;
  leaderImage?: string;
  leaders?: LeaderInfo[];
  members: { role: string; count: number }[];
  activeProkers: {
    title: string;
    slug: string;
    status: "upcoming" | "ongoing" | "completed";
  }[];
  focusAreas: string[];
}

export const ORG_NODES: OrgNode[] = [
  {
    id: "node-presidium",
    code: "PRESIDIUM",
    name: "Presidium Utama (Ketua & Wakil Ketua Himpunan)",
    shortTitle: "KAHIM & WAKAHIM",
    level: 1,
    levelName: "PRESIDIUM UTAMA",
    shortDesc:
      "Pimpinan organisasi yang bertanggung jawab atas arah kebijakan, koordinasi seluruh bidang kerja, dan representasi resmi HIMATIKA Universitas Trilogi.",
    tupoksi: [
      "Memimpin jalannya organisasi dan bertanggung jawab atas seluruh program kerja HIMATIKA.",
      "Menentukan arah kebijakan strategis organisasi serta mengoordinasikan seluruh badan dan divisi kepengurusan.",
      "Mewakili HIMATIKA dalam forum internal Universitas Trilogi maupun eksternal antar-perguruan tinggi.",
      "Menjaga ketercapaian visi, misi, dan nilai kekeluargaan organisasi sepanjang periode kepengurusan.",
    ],
    leaderTitle: "Presidium Utama",
    leaderName: "Musyaffa Salman Alfarizi & Yudistira",
    leaderImage: "/image/fais.png",
    leaders: [
      {
        name: "Musyaffa Salman Alfarizi",
        role: "Ketua Himpunan",
        image: "/image/fais.png",
      },
      {
        name: "Yudistira",
        role: "Wakil Ketua Himpunan",
        image: "/image/yudis.png",
      },
    ],
    members: [
      { role: "Ketua Himpunan", count: 1 },
      { role: "Wakil Ketua Himpunan", count: 1 },
    ],
    activeProkers: [
      {
        title: "Rapat Kerja Tahunan (RAKER) 2026",
        slug: "raker-tahunan-2026",
        status: "completed",
      },
      {
        title: "Musyawarah Anggota & Sidang Umum",
        slug: "musyawarah-anggota-sidang",
        status: "upcoming",
      },
      {
        title: "Laporan Pertanggungjawaban (LPJ) Akhir",
        slug: "lpj-akhir-periode",
        status: "upcoming",
      },
    ],
    focusAreas: [
      "KEPEMIMPINAN ORGANISASI",
      "ARAH STRATEGIS",
      "KOORDINASI TIM",
    ],
  },
  {
    id: "node-bph-sek",
    code: "BPH_SEK",
    name: "Sekretaris Organisasi",
    shortTitle: "SEKRETARIS",
    level: 2,
    levelName: "BADAN PENGURUS HARIAN",
    shortDesc:
      "Pengelola administrasi persuratan, pengarsipan dokumen, pendataan anggota, dan koordinasi perizinan kegiatan organisasi.",
    tupoksi: [
      "Mengelola administrasi surat-menyurat, arsip data, dan notulensi rapat organisasi.",
      "Menyusun format proposal kegiatan, laporan pertanggungjawaban (LPJ), dan persuratan resmi himpunan.",
      "Mengelola data keanggotaan aktif serta dokumentasi legalitas kepengurusan.",
      "Mengkoordinasikan alur perizinan kegiatan dengan pihak Program Studi dan Dekanat.",
    ],
    leaderTitle: "Sekretaris I",
    leaderName: "Riska Febriyanti",
    leaderImage: "/image/riska.png",
    leaders: [
      {
        name: "Riska Febriyanti",
        role: "Sekretaris I",
        image: "/image/riska.png",
      },
    ],
    members: [
      { role: "Sekretaris I (Administrasi & Persuratan)", count: 1 },
      { role: "Sekretaris II (Kearsipan & Notulensi)", count: 1 },
    ],
    activeProkers: [
      {
        title: "Digitalisasi Arsip & Persuratan HIMA",
        slug: "digitalisasi-arsip-persuratan",
        status: "ongoing",
      },
      {
        title: "Standarisasi SOP Proposal & LPJ Kegiatan",
        slug: "standarisasi-sop-kegiatan",
        status: "completed",
      },
    ],
    focusAreas: ["ADMINISTRASI ORGANISASI", "KARSIPAN DIGITAL", "PERIZINAN KEGIATAN"],
  },
  {
    id: "node-bph-ben",
    code: "BPH_BEN",
    name: "Bendahara Umum",
    shortTitle: "BENDAHARA",
    level: 2,
    levelName: "BADAN PENGURUS HARIAN",
    shortDesc:
      "Pengelola keuangan himpunan, perancangan anggaran biaya kegiatan, dan penyusunan laporan kas yang transparan.",
    tupoksi: [
      "Mengelola pemasukan dan pengeluaran kas himpunan serta perencanaan rencana anggaran biaya (RAB).",
      "Mencatat pembukuan keuangan secara rapi, terbuka, dan dapat diakses pengurus.",
      "Memeriksa bukti transaksi pemasukan dan pengeluaran pada setiap kegiatan himpunan.",
      "Menyusun laporan keuangan rutin dan laporan pertanggungjawaban kas periode aktif.",
    ],
    leaderTitle: "Bendahara I",
    leaderName: "Ananda Tri Handayani",
    leaderImage: "/image/nanda.png",
    leaders: [
      {
        name: "Ananda Tri Handayani",
        role: "Bendahara I",
        image: "/image/nanda.png",
      },
    ],
    members: [
      { role: "Bendahara I (Arus Kas Masuk & Verifikasi)", count: 1 },
      { role: "Bendahara II (Pengeluaran & Anggaran Event)", count: 1 },
    ],
    activeProkers: [
      {
        title: "Transparansi Kas & Pembukuan HIMA",
        slug: "the-vault-transparansi-kas",
        status: "ongoing",
      },
      {
        title: "Rancangan Anggaran Biaya (RAB) Kegiatan",
        slug: "rab-terintegrasi-2026",
        status: "completed",
      },
    ],
    focusAreas: ["MANAJEMEN KAS", "TRANSPARANSI KEUANGAN", "ANGGARAN KEGIATAN"],
  },
  {
    id: "node-bpsdm",
    code: "BPSDM",
    name: "Badan Pengembangan Sumber Daya Manusia",
    shortTitle: "BPSDM",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Divisi kaderisasi dan pengembangan karakter anggota, berfokus pada pembinaan kepemimpinan, etika berorganisasi, serta solidaritas mahasiswa Teknik Informatika.",
    tupoksi: [
      "Merancang dan melaksanakan alur kaderisasi mahasiswa baru Teknik Informatika.",
      "Menyelenggarakan pelatihan kepemimpinan, team-building, dan pengembangan kapasitas anggota.",
      "Mengevaluasi kinerja pengurus serta menjaga suasana kekeluargaan di internal organisasi.",
      "Mengembangkan program pendampingan (mentorship) antar-angkatan mahasiswa.",
    ],
    leaderTitle: "Koordinator BPSDM",
    leaderName: "Galang Jenar Mahesadewa",
    leaderImage: "/image/galang.png",
    leaders: [
      {
        name: "Galang Jenar Mahesadewa",
        role: "Koordinator BPSDM",
        image: "/image/galang.png",
      },
    ],
    members: [
      { role: "Ketua Divisi", count: 1 },
      { role: "Staff Divisi Kaderisasi & Monitoring", count: 4 },
    ],
    activeProkers: [
      {
        title: "T-CAMP 2026: Kaderisasi & Leadership",
        slug: "t-camp-2026",
        status: "upcoming",
      },
      {
        title: "Upgrading Internal & Leadership Camp",
        slug: "upgrading-leadership",
        status: "completed",
      },
      {
        title: "Gathering & Bonding Mahasiswa TI",
        slug: "gathering-bonding-ti",
        status: "upcoming",
      },
    ],
    focusAreas: ["KADERISASI", "KEPEMIMPINAN", "KEKELUARGAAN & MENTORSHIP"],
  },
  {
    id: "node-humas",
    code: "HUMAS",
    name: "Hubungan Masyarakat & Kemitraan",
    shortTitle: "HUMAS",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Penghubung komunikasi eksternal organisasi dengan industri teknologi, instansi profesional, ikatan alumni, dan himpunan mahasiswa lainnya.",
    tupoksi: [
      "Membangun dan memelihara hubungan kerja sama dengan dunia industri, instansi, dan ikatan alumni.",
      "Menjadi narahubung utama kegiatan eksternal, kunjungan industri, dan studi banding antar-kampus.",
      "Memfasilitasi peluang sponsorship acara, lowongan kerja, serta program magang bagi mahasiswa.",
      "Mengelola komunikasi publik dan penyampaian informasi himpunan kepada masyarakat luas.",
    ],
    leaderTitle: "Koordinator Humas",
    leaderName: "Dimas Srimuladi",
    leaderImage: "/image/dimas.png",
    leaders: [
      {
        name: "Dimas Srimuladi",
        role: "Koordinator Humas",
        image: "/image/dimas.png",
      },
    ],
    members: [
      { role: "Ketua Divisi", count: 1 },
      { role: "Staff Eksternal & Hubungan Industri", count: 4 },
    ],
    activeProkers: [
      {
        title: "Industrial Immersion & Company Visit",
        slug: "company-visit-industrial",
        status: "completed",
      },
      {
        title: "Studi Banding Ormawa Informatika Antar-Kampus",
        slug: "studi-banding-ormawa",
        status: "upcoming",
      },
      {
        title: "Alumni Connect & Sharing Session",
        slug: "alumni-connect-session",
        status: "ongoing",
      },
    ],
    focusAreas: ["HUBUNGAN EKSTERNAL", "KEMITRAAN INDUSTRI", "KOMUNIKASI PUBLIK"],
  },
  {
    id: "node-riset",
    code: "RISET",
    name: "Riset dan Keilmuan",
    shortTitle: "RISET & KEILMUAN",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Pusat kegiatan akademik, eksplorasi pemrograman, riset teknologi kecerdasan buatan, serta pembinaan mahasiswa dalam kompetisi IT.",
    tupoksi: [
      "Membangun budaya riset dan belajar bersama di bidang rekayasa software, AI, dan teknologi digital.",
      "Mengadakan workshop teknologi berkala, coding bootcamp, dan kelompok belajar (study club) intensif.",
      "Membimbing, melatih, dan mengirimkan delegasi mahasiswa ke kompetisi IT tingkat nasional.",
      "Menyediakan materi belajar terbuka dan dokumentasi teknologi bagi mahasiswa Teknik Informatika.",
    ],
    leaderTitle: "Koordinator Riset Keilmuan",
    leaderName: "Kurnia",
    leaderImage: "/image/naya.png",
    leaders: [
      {
        name: "Kurnia",
        role: "Koordinator Riset Keilmuan",
        image: "/image/naya.png",
      },
    ],
    members: [
      { role: "Ketua Divisi", count: 1 },
      { role: "Staff Riset & Fasilitator Keilmuan", count: 5 },
    ],
    activeProkers: [
      {
        title: "Tech Workshop & Coding Bootcamp",
        slug: "tech-workshop-bootcamp",
        status: "ongoing",
      },
      {
        title: "Informatics Study Club: AI & Full-Stack",
        slug: "study-club-ai-fullstack",
        status: "ongoing",
      },
      {
        title: "Delegasi Hackathon & Gemastik Prep Camp",
        slug: "delegasi-hackathon-prep",
        status: "upcoming",
      },
    ],
    focusAreas: [
      "SOFTWARE & WEB",
      "ARTIFICIAL INTELLIGENCE",
      "KOMPETISI IT",
    ],
  },
  {
    id: "node-pmb",
    code: "PMB",
    name: "Pengembangan Minat dan Bakat",
    shortTitle: "MINAT & BAKAT",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Wadah minat dan bakat non-akademik mahasiswa di bidang esports, olahraga, seni digital, serta penanggung jawab festival TRILOGI IT EXPO.",
    tupoksi: [
      "Menampung dan menyalurkan minat bakat mahasiswa di bidang turnamen esports, olahraga, dan seni digital.",
      "Mengorganisasi penyelenggaraan festival tahunan Trilogi IT Expo & Innovation Fest.",
      "Mengadakan kegiatan olahraga dan fun games internal untuk mempererat kebersamaan mahasiswa.",
      "Menyiapkan perwakilan kontingen mahasiswa Teknik Informatika dalam ajang kompetisi olahraga kampus.",
    ],
    leaderTitle: "Koordinator PM & B",
    leaderName: "Adi Rahmansyah",
    leaderImage: "/image/adi.png",
    leaders: [
      {
        name: "Adi Rahmansyah",
        role: "Koordinator PM & B",
        image: "/image/adi.png",
      },
    ],
    members: [
      { role: "Ketua Divisi", count: 1 },
      { role: "Staff Divisi Olahraga & Event Creator", count: 4 },
    ],
    activeProkers: [
      {
        title: "Trilogi IT Expo & Innovation Fest",
        slug: "trilogi-it-expo",
        status: "upcoming",
      },
      {
        title: "Informatics E-Sports Championship",
        slug: "esports-championship",
        status: "ongoing",
      },
      {
        title: "Trilogi Informatics Fun Sport Series",
        slug: "informatics-fun-sport",
        status: "completed",
      },
    ],
    focusAreas: ["TRILOGI IT EXPO", "E-SPORTS & GAMING", "SENI & OLAHRAGA"],
  },
  {
    id: "node-sarlog",
    code: "SARLOG",
    name: "Sarana dan Logistik",
    shortTitle: "SARANA & LOGISTIK",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Penanggung jawab perlengkapan acara, inventaris fasilitas himpunan, serta pemeliharaan ruang sekretariat bersama.",
    tupoksi: [
      "Mendata dan memelihara aset fisik, perangkat keras, dan inventaris fasilitas himpunan.",
      "Menyiapkan pengadaan perlengkapan dan kebutuhan logistik untuk kelancaran seluruh kegiatan.",
      "Menjaga kerapian, kebersihan, dan kenyamanan ruang sekretariat HIMATIKA.",
      "Melakukan pengecekan rutin berkala terhadap kondisi peralatan penunjang operasional himpunan.",
    ],
    leaderTitle: "Koordinator Logistik",
    leaderName: "Muhamad Syafareno",
    leaderImage: "/image/reno.png",
    leaders: [
      {
        name: "Muhamad Syafareno",
        role: "Koordinator Logistik",
        image: "/image/reno.png",
      },
    ],
    members: [
      { role: "Ketua Divisi", count: 1 },
      { role: "Staff Inventaris & Logistik Operasional", count: 3 },
    ],
    activeProkers: [
      {
        title: "Inventarisasi Aset Digital & Fisik Lab",
        slug: "inventarisasi-aset",
        status: "completed",
      },
      {
        title: "Revitalisasi Ruang Sekretariat Bersama",
        slug: "revitalisasi-sekretariat",
        status: "ongoing",
      },
      {
        title: "Logistik & Perlengkapan Operasional Terpadu",
        slug: "logistik-terpadu",
        status: "ongoing",
      },
    ],
    focusAreas: ["INVENTARIS HIMPUNAN", "LOGISTIK ACARA", "RUANG SEKRETARIAT"],
  },
  {
    id: "node-medkraf",
    code: "MEDKRAF",
    name: "Media Kreatif & Publikasi",
    shortTitle: "MEDIA KREATIF",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Pengelola konten kreatif, media sosial resmi, desain visual, serta dokumentasi kegiatan HIMATIKA Universitas Trilogi.",
    tupoksi: [
      "Merancang desain grafis dan identitas visual untuk seluruh publikasi resmi himpunan.",
      "Mengelola saluran media sosial resmi (Instagram, LinkedIn, YouTube, dan TikTok) secara konsisten.",
      "Menjalankan dokumentasi foto dan video pada setiap agenda kegiatan himpunan.",
      "Membuat konten kreatif informatif dan edukasi seputar teknologi bagi mahasiswa.",
    ],
    leaderTitle: "Koordinator Media Kreatif",
    leaderName: "Fadly Akbar Alamsyah",
    leaderImage: "/image/fadly.png",
    leaders: [
      {
        name: "Fadly Akbar Alamsyah",
        role: "Koordinator Media Kreatif",
        image: "/image/fadly.png",
      },
    ],
    members: [
      { role: "Ketua Divisi", count: 1 },
      { role: "Staff Desain Grafis & Videografer", count: 4 },
    ],
    activeProkers: [
      {
        title: "Content Creation & Tech Reels Series",
        slug: "content-creation-reels",
        status: "ongoing",
      },
      {
        title: "Dokumentasi Multimedia Terpadu Event",
        slug: "multimedia-documentation",
        status: "ongoing",
      },
      {
        title: "Informatics Podcast & Insight Corner",
        slug: "informatics-podcast",
        status: "upcoming",
      },
    ],
    focusAreas: ["DESAIN GRAFIS", "DOKUMENTASI & MULTIMEDIA", "MEDIA SOSIAL"],
  },
];
