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
      "Pucuk pimpinan eksekutif tertinggi yang bertanggung jawab atas penentuan arah strategis, pengawasan seluruh divisi, dan representasi resmi HIMATIKA Universitas Trilogi.",
    tupoksi: [
      "Memegang kekuasaan eksekutif tertinggi dan bertanggung jawab secara umum atas seluruh agenda HIMATIKA.",
      "Menentukan arah kebijakan strategis organisasi serta mengoordinasikan seluruh badan dan divisi kepengurusan.",
      "Mewakili HIMATIKA dalam forum internal Universitas Trilogi maupun eksternal antar-perguruan tinggi nasional.",
      "Memastikan ketercapaian visi, misi, dan nilai dasar organisasi sepanjang periode kepengurusan.",
    ],
    leaderTitle: "Presidium Kabinet",
    leaderName: "Ketua & Wakil Ketua Himpunan",
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
      "KEBIJAKAN STRATEGIS",
      "ORGANIZATIONAL GOVERNANCE",
      "STRATEGIC LEADERSHIP",
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
      "Pengelola sentral tata kelola administrasi organisasi, kearsipan persuratan legal, perizinan proposal, dan basis data keanggotaan himpunan.",
    tupoksi: [
      "Bertanggung jawab atas tata kelola administrasi surat-menyurat, arsip data, dan notulensi organisasi.",
      "Menyusun dan menegakkan standarisasi format proposal, laporan kegiatan (LPJ), dan persuratan resmi himpunan.",
      "Mengelola basis data keanggotaan aktif serta dokumentasi legalitas kepengurusan.",
      "Mengkoordinasikan alur birokrasi perizinan kegiatan dengan pihak Program Studi dan Dekanat.",
    ],
    leaderTitle: "Sekretaris Umum",
    leaderName: "Koordinator Administrasi",
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
    focusAreas: ["TATA KELOLA ADMINISTRASI", "LEGALITAS", "KARSIPAN DIGITAL"],
  },
  {
    id: "node-bph-ben",
    code: "BPH_BEN",
    name: "Bendahara Umum",
    shortTitle: "BENDAHARA",
    level: 2,
    levelName: "BADAN PENGURUS HARIAN",
    shortDesc:
      "Pengendali sistem sirkulasi kas himpunan, perancangan rencana anggaran biaya (RAB), dan penjamin transparansi finansial melalui The Vault.",
    tupoksi: [
      "Mengelola sirkulasi keuangan kas himpunan, perencanaan anggaran biaya (RAB), dan pencatatan buku kas masuk/keluar.",
      "Menerapkan transparansi pembukuan melalui portal The Vault yang dapat diaudit secara berkala.",
      "Memverifikasi keabsahan bukti transaksi pengeluaran dan pemasukan pada setiap kepanitiaan kegiatan.",
      "Menyusun laporan arus kas bulanan serta laporan pertanggungjawaban keuangan semesteran.",
    ],
    leaderTitle: "Bendahara Umum",
    leaderName: "Koordinator Keuangan",
    members: [
      { role: "Bendahara I (Arus Kas Masuk & Verifikasi)", count: 1 },
      { role: "Bendahara II (Pengeluaran & Anggaran Event)", count: 1 },
    ],
    activeProkers: [
      {
        title: "Audit & Transparansi Kas (The Vault Portal)",
        slug: "the-vault-transparansi-kas",
        status: "ongoing",
      },
      {
        title: "Rancangan Anggaran Biaya (RAB) Terintegrasi",
        slug: "rab-terintegrasi-2026",
        status: "completed",
      },
    ],
    focusAreas: ["MANAJEMEN KAS", "TRANSPARANSI KEUANGAN", "AUDIT FINANSIAL"],
  },
  {
    id: "node-bpsdm",
    code: "BPSDM",
    name: "Badan Pengembangan Sumber Daya Manusia",
    shortTitle: "BPSDM",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Divisi kaderisasi dan pembinaan karakter, bertugas mencetak kader mahasiswa Teknik Informatika yang loyal, beretika rekayasa tinggi, dan memiliki kapabilitas kepemimpinan.",
    tupoksi: [
      "Merancang dan mengeksekusi kurikulum kaderisasi mahasiswa baru Teknik Informatika secara berkelanjutan.",
      "Menyelenggarakan pelatihan kepemimpinan, team-building, dan peningkatan kapasitas manajerial anggota.",
      "Melakukan evaluasi kinerja berkala pengurus serta memelihara iklim keharmonisan internal organisasi.",
      "Mengembangkan program pendampingan (mentorship) antar-angkatan mahasiswa Teknik Informatika.",
    ],
    leaderTitle: "Kepala Divisi BPSDM",
    leaderName: "Koordinator Divisi",
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
    focusAreas: ["KADERISASI", "KEPEMIMPINAN", "MENTORSHIP & BONDING"],
  },
  {
    id: "node-humas",
    code: "HUMAS",
    name: "Hubungan Masyarakat & Kemitraan",
    shortTitle: "HUMAS",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Garda terdepan diplomasi eksternal, menjembatani kemitraan strategis dengan ekosistem industri teknologi, instansi profesional, alumni, dan ormawa lintas kampus.",
    tupoksi: [
      "Membangun dan memelihara hubungan kemitraan strategis dengan industri teknologi, instansi, dan ikatan alumni.",
      "Menjadi narahubung utama kegiatan eksternal, studi banding antar-himpunan, dan diplomasi ormawa.",
      "Memfasilitasi peluang kerja sama sponsorship, magang industri, dan lowongan kerja bagi anggota.",
      "Menyusun program komunikasi publik dan respon terhadap isu-isu seputar teknologi informasi.",
    ],
    leaderTitle: "Kepala Divisi Humas",
    leaderName: "Koordinator Divisi",
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
    focusAreas: ["DIPLOMASI EKSTERNAL", "JEJARING INDUSTRI", "KOMUNIKASI PUBLIK"],
  },
  {
    id: "node-riset",
    code: "RISET",
    name: "Riset dan Keilmuan",
    shortTitle: "RISET & KEILMUAN",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Pusat pengembangan akademik, riset rekayasa perangkat lunak, kecerdasan buatan, dan inkubasi delegasi kompetisi IT bergengsi tingkat nasional.",
    tupoksi: [
      "Mendorong atmosfer akademik dan budaya riset di bidang rekayasa software, AI, keamanan siber, dan cloud computing.",
      "Mengadakan coding bootcamp berkala, workshop teknis praktis, dan study club algoritma pemecahan masalah.",
      "Membimbing, melatih, dan mendelegasikan mahasiswa dalam kompetisi IT (Gemastik, Hackathon, ICPC).",
      "Mengelola repository riset dan materi belajar terbuka (open knowledge) untuk mahasiswa Teknik Informatika.",
    ],
    leaderTitle: "Kepala Divisi Riset",
    leaderName: "Koordinator Divisi",
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
      "SOFTWARE ENGINEERING",
      "ARTIFICIAL INTELLIGENCE",
      "KOMPETISI TEKNOLOGI",
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
      "Fasilitator aspirasi dan bakat non-akademik mahasiswa di ranah esports, turnamen olahraga, seni digital, dan penyelenggara festival tahunan TRILOGI IT EXPO.",
    tupoksi: [
      "Mewadahi dan menyalurkan potensi non-akademik mahasiswa di bidang esports kompetitif, olahraga, dan seni digital.",
      "Mengorganisasi festival teknologi tahunan berskala besar (Trilogi IT Expo & Innovation Fest).",
      "Menyelenggarakan kompetisi olahraga dan esports internal untuk mempererat solidaritas angkatan.",
      "Mempersiapkan tim kontingen perwakilan Teknik Informatika dalam ajang pekan olahraga universitas.",
    ],
    leaderTitle: "Kepala Divisi PMB",
    leaderName: "Koordinator Divisi",
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
      "Pengendali kesiapan infrastruktur fisik, manajemen inventaris perangkat keras laboratorium himpunan, kesekretariatan, dan rantai pasok logistik seluruh kegiatan.",
    tupoksi: [
      "Mengelola inventaris aset fisik, perangkat keras kesekretariatan, dan fasilitas laboratorium HIMA.",
      "Menyediakan pengadaan logistik, perlengkapan teknis, dan kebutuhan operasional untuk seluruh program kerja.",
      "Menjaga keteraturan, kebersihan, dan kenyamanan ruang sekretariat HIMATIKA sebagai sentral kerja tim.",
      "Melakukan audit rutin kondisi aset serta pemeliharaan sarana prasarana penunjang kegiatan.",
    ],
    leaderTitle: "Kepala Divisi Sarlog",
    leaderName: "Koordinator Divisi",
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
    focusAreas: ["MANAJEMEN INVENTARIS", "LOGISTIK ACARA", "FASILITAS SEKRETARIAT"],
  },
  {
    id: "node-medkraf",
    code: "MEDKRAF",
    name: "Media Kreatif & Publikasi",
    shortTitle: "MEDIA KREATIF",
    level: 3,
    levelName: "DIVISI PELAKSANA",
    shortDesc:
      "Pengrajin identitas visual, perancang konten grafis, pengelola media sosial resmi, dan sutradara dokumentasi sinematik seluruh peristiwa HIMATIKA.",
    tupoksi: [
      "Merancang identitas visual, grafis, dan estetika seluruh publikasi resmi HIMATIKA Universitas Trilogi.",
      "Mengelola akun media sosial resmi (Instagram @himatikatrilogi, LinkedIn, YouTube, TikTok).",
      "Menjalankan liputan multimedia, dokumentasi foto & video beresolusi tinggi, serta pembuatan konten teknologi edukatif.",
      "Memelihara konsistensi brand guidelines himpunan dalam setiap materi komunikasi digital.",
    ],
    leaderTitle: "Kepala Divisi Medkraf",
    leaderName: "Koordinator Divisi",
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
    focusAreas: ["DESAIN GRAFIS & BRANDING", "MULTIMEDIA PRODUCTION", "SOSIAL MEDIA MGMT"],
  },
];
