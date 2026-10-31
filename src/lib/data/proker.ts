export type ProkerStatus = "upcoming" | "ongoing" | "completed";

export interface RundownItem {
  time: string;
  activity: string;
}

export interface ProkerItem {
  id: string;
  number: string;
  title: string;
  slug: string;
  divisionCode: string;
  divisionName: string;
  status: ProkerStatus;
  executionDate: string;
  location: string;
  targetAudience: string;
  shortDesc: string;
  fullDesc: string[];
  objectives: string[];
  rundown?: RundownItem[];
  coverImage: string;
  isWhiteBackground?: boolean;
  galleryImages?: string[];
  registrationLink?: string;
  contactPerson?: {
    name: string;
    role: string;
    contact: string;
  };
  isFeatured?: boolean;
}

export const ALL_PROKERS: ProkerItem[] = [
  {
    id: "proker-01",
    number: "01",
    title: "T-CAMP 2026: SOLIDARITAS & KEPEMIMPINAN",
    slug: "t-camp-2026",
    divisionCode: "KOLABORASI",
    divisionName: "KOLABORASI SEMUA DIVISI",
    status: "upcoming",
    executionDate: "NOVEMBER 2026",
    location: "Kawasan Agrowisata & Villa Bukit Pelangi, Bogor",
    targetAudience: "Mahasiswa Baru Teknik Informatika Universitas Trilogi",
    shortDesc:
      "Program pembinaan karakter dan kepemimpinan mahasiswa Teknik Informatika untuk mempererat solidaritas, etika berorganisasi, dan kebersamaan angkatan.",
    fullDesc: [
      "T-Camp (Trilogi Informatics Camp) merupakan agenda pembinaan karakter dan kebersamaan tahunan terbesar di lingkungan HIMATIKA Universitas Trilogi. Acara ini dirancang sebagai wadah pembentukan karakter, kepemimpinan, dan etika berorganisasi bagi mahasiswa baru Teknik Informatika.",
      "Selama kegiatan berlangsung, peserta dibimbing langsung oleh pengurus himpunan, alumni, serta dosen pendamping melalui berbagai sesi materi interaktif, simulasi kepemimpinan, dan kegiatan team-building di alam terbuka.",
      "Melalui T-Camp, diharapkan lahir generasi mahasiswa Teknik Informatika yang memiliki integritas tinggi, jiwa solidaritas yang kokoh, serta rasa memiliki terhadap almamater dan himpunan.",
    ],
    objectives: [
      "Mengenalkan nilai-nilai luhur dan budaya kekeluargaan di lingkungan HIMATIKA Universitas Trilogi.",
      "Menumbuhkan jiwa kepemimpinan, tanggung jawab, dan kemampuan komunikasi antar-mahasiswa.",
      "Mempererat tali persaudaraan dan solidaritas antar-angkatan mahasiswa Teknik Informatika.",
      "Membekali peserta dengan keterampilan problem-solving dan kerja sama tim dalam menghadapi dinamika perkuliahan.",
    ],
    rundown: [
      { time: "06.30 - 08.00", activity: "Kumpul & Registrasi Peserta di Kampus Trilogi" },
      { time: "08.00 - 10.30", activity: "Perjalanan Menuju Lokasi Camp & Pembagian Barak" },
      { time: "10.30 - 12.00", activity: "Upacara Pembukaan & Sambutan Kaprodi Teknik Informatika" },
      { time: "13.00 - 15.30", activity: "Sesi Materi 1: Kepemimpinan & Manajemen Organisasi" },
      { time: "16.00 - 17.30", activity: "Simulasi Team Building & Problem Solving Games" },
      { time: "19.30 - 22.00", activity: "Malam Keakraban, Sharing Alumni, & Api Unggun Solidaritas" },
      { time: "06.00 - 08.00", activity: "Senam Pagi, Sarapan Sehat, & Outbound Tracking" },
      { time: "09.30 - 11.30", activity: "Inaugurasi Angkatan & Penutupan Resmi" },
    ],
    coverImage: "/image/tcamp2024.jpg",
    galleryImages: [
      "/image/tcamp2024.jpg",
      "/image/t-camp.jpg",
      "/image/fotokarya1.jpg",
    ],
    registrationLink: "https://forms.gle/himatika-tcamp-2026",
    contactPerson: {
      name: "Galang Jenar (BPSDM)",
      role: "Ketua Pelaksana T-Camp",
      contact: "https://wa.me/6281234567890",
    },
    isFeatured: true,
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
    location: "Atrium Utama & Laboratorium Komputer Universitas Trilogi",
    targetAudience: "Mahasiswa Trilogi, Pelajar SMA/SMK, & Komunitas Teknologi",
    shortDesc:
      "Pameran inovasi teknologi tahunan, kompetisi karya software mahasiswa, turnamen esports kampus, dan showcase produk akhir berbasis teknologi tepat guna.",
    fullDesc: [
      "Trilogi IT Expo merupakan festival teknologi kebanggaan mahasiswa Teknik Informatika yang diselenggarakan setiap akhir tahun oleh Divisi Pengembangan Minat dan Bakat (PMB).",
      "Acara ini mempertemukan hasil karya inovasi mahasiswa, kompetisi pengembangan perangkat lunak (Software Project Showcase), turnamen e-sports tingkat pelajar se-Jabodetabek, dan talkshow teknologi bersama para praktisi industri digital.",
      "IT Expo menjadi jembatan antara kampus dan dunia industri untuk membuktikan bahwa mahasiswa Teknik Informatika Universitas Trilogi mampu menghasilkan solusi teknologi yang aplikatif dan berdaya saing tinggi.",
    ],
    objectives: [
      "Menyediakan panggung showcase bagi karya inovatif mahasiswa Teknik Informatika kepada khalayak luas.",
      "Menumbuhkan semangat kompetisi sehat melalui turnamen e-sports dan lomba karya software.",
      "Membuka peluang kerja sama antara mahasiswa bertalenta dengan perusahaan teknologi rekanan.",
      "Mempromosikan Program Studi Teknik Informatika Universitas Trilogi ke siswa-siswi SMA/SMK sederajat.",
    ],
    rundown: [
      { time: "08.30 - 09.30", activity: "Opening Ceremony, Tarian Tradisional, & Ribbon Cutting" },
      { time: "09.30 - 12.00", activity: "Exhibition Hall Open: Showcase 25+ Software Mahasiswa" },
      { time: "10.00 - 15.00", activity: "Penyisihan Turnamen E-Sports (Mobile Legends & Valorant)" },
      { time: "13.00 - 15.00", activity: "Tech Talk: Menjawab Tantangan AI di Industri Digital" },
      { time: "15.30 - 17.00", activity: "Grand Final E-Sports & Awarding Inovasi Terbaik" },
    ],
    coverImage: "/image/t-expo.jpg",
    galleryImages: [
      "/image/t-expo.jpg",
      "/image/texpo2.jpg",
      "/image/fotokarya2.jpg",
    ],
    registrationLink: "https://forms.gle/trilogi-it-expo-2026",
    contactPerson: {
      name: "Adi Rahmansyah (PMB)",
      role: "Koordinator Event IT Expo",
      contact: "https://wa.me/6281234567891",
    },
    isFeatured: true,
  },
  {
    id: "proker-03",
    number: "03",
    title: "TECH WORKSHOP & CODING BOOTCAMP",
    slug: "tech-workshop-bootcamp",
    divisionCode: "RISET",
    divisionName: "RISET DAN KEILMUAN",
    status: "ongoing",
    executionDate: "OKTOBER - NOVEMBER 2026",
    location: "Lab Komputer 3 & Hybrid Google Meet",
    targetAudience: "Seluruh Mahasiswa Teknik Informatika (Tingkat 1 - 4)",
    shortDesc:
      "Pelatihan intensif pengembangan Full-Stack Web modern, Artificial Intelligence engineering, dan DevOps cloud bersama instruktur ahli dan praktisi industri teknologi.",
    fullDesc: [
      "Tech Workshop & Coding Bootcamp adalah program unggulan dari Divisi Riset dan Keilmuan yang diselenggarakan secara serial sepanjang semester.",
      "Kurikulum workshop dirancang mengikuti standar industri terkini, mencakup fondasi TypeScript, framework Next.js modern, arsitektur microservices, integrasi model AI/LLM, hingga deployment otomatis menggunakan Docker dan CI/CD.",
      "Peserta tidak hanya mendengarkan teori, melainkan langsung mengerjakan studi kasus nyata (hands-on coding project) dengan pendampingan intensif dari mentor berpengalaman.",
    ],
    objectives: [
      "Meningkatkan keterampilan teknikal mahasiswa dalam rekayasa perangkat lunak modern.",
      "Menjembatani kurikulum perkuliahan dengan standar kebutuhan nyata di industri teknologi informasi.",
      "Membantu mahasiswa membangun portofolio proyek software yang solid untuk persiapan karir.",
      "Mempersiapkan tim delegasi mahasiswa untuk menghadapi ajang kompetisi IT nasional (Gemastik & Hackathon).",
    ],
    rundown: [
      { time: "Sesi 01", activity: "Full-Stack Web Modern: Next.js 15, TypeScript & Tailwind CSS" },
      { time: "Sesi 02", activity: "Backend Engineering: Supabase PostgreSQL, Authentication, & Row Level Security" },
      { time: "Sesi 03", activity: "Prinsip AI Engineering: Integrasi LLM, Prompt Engineering, & Vector Search" },
      { time: "Sesi 04", activity: "Project Showcase & Code Review bersama Lead Engineer Partner" },
    ],
    coverImage: "/image/workshop.webp",
    galleryImages: [
      "/image/workshop.webp",
      "/image/fotokarya1.jpg",
      "/image/fotokarya2.jpg",
    ],
    registrationLink: "https://forms.gle/tech-workshop-himatika",
    contactPerson: {
      name: "Kurnia (Riset & Keilmuan)",
      role: "Fasilitator Workshop",
      contact: "https://wa.me/6281234567892",
    },
    isFeatured: true,
  },
  {
    id: "proker-04",
    number: "04",
    title: "INDUSTRIAL IMMERSION & COMPANY VISIT",
    slug: "company-visit-industrial",
    divisionCode: "HUMAS",
    divisionName: "HUBUNGAN MASYARAKAT",
    status: "completed",
    executionDate: "24 SEPTEMBER 2026",
    location: "MNC Center Kebon Sirih & Jakarta Smart City Balai Kota",
    targetAudience: "Mahasiswa Aktif Teknik Informatika Universitas Trilogi",
    shortDesc:
      "Kunjungan industri ke perusahaan teknologi nasional (seperti MNC Group dan Jakarta Smart City) untuk memperluas wawasan karir dan dunia kerja profesional.",
    fullDesc: [
      "Industrial Immersion & Company Visit merupakan inisiatif rutin Divisi Hubungan Masyarakat untuk mengajak mahasiswa melihat secara langsung ekosistem kerja profesional di industri teknologi dan media nasional.",
      "Dalam edisi kali ini, delegasi HIMATIKA mengunjungi kantor pusat MNC Group dan Jakarta Smart City (JSC). Mahasiswa berkesempatan meninjau ruang kendali server, data center, studio siaran digital, serta berdiskusi langsung dengan Head of Technology mengenai implementasi teknologi skala besar.",
      "Kunjungan ini memberikan gambaran nyata mengenai jenjang karir software engineer, data analyst, dan infrastructure engineer di perusahaan tier-1 Indonesia.",
    ],
    objectives: [
      "Memberikan pemahaman langsung tentang kultur kerja, alur operasional, dan standar industri teknologi.",
      "Membuka jaringan komunikasi dan relasi antara mahasiswa dengan praktisi industri.",
      "Memfasilitasi program magang (internship) dan lowongan pekerjaan bagi lulusan Teknik Informatika.",
      "Menginspirasi mahasiswa dalam memilih spesialisasi karir teknologi yang diminati.",
    ],
    rundown: [
      { time: "07.30 - 08.30", activity: "Kumpul di Kampus Trilogi & Briefing Keberangkatan" },
      { time: "08.30 - 09.30", activity: "Perjalanan Menuju Gedung MNC Kebon Sirih" },
      { time: "09.30 - 11.30", activity: "Office Tour MNC: Studio Digital, Data Center, & Media Room" },
      { time: "11.30 - 13.00", activity: "Ishoma & Perjalanan Menuju Jakarta Smart City" },
      { time: "13.00 - 15.00", activity: "Sharing Session: Transformasi Digital DKI Jakarta bersama Tim JSC" },
      { time: "15.00 - 15.30", activity: "Penyerahan Plakat Penghargaan & Foto Bersama" },
    ],
    coverImage: "/image/Company Visit MNC.jpg",
    galleryImages: [
      "/image/Company Visit MNC.jpg",
      "/image/comvis JSC.jpg",
      "/image/comvis mnc.jpg",
      "/image/office tour animation.jpg",
    ],
    contactPerson: {
      name: "Dimas Srimuladi (Humas)",
      role: "Koordinator Hubungan Industri",
      contact: "https://wa.me/6281234567893",
    },
    isFeatured: true,
  },
  {
    id: "proker-05",
    number: "05",
    title: "DUKUNGAN KARIR & ALUMNI MENTORSHIP",
    slug: "dukungan-karir-mentorship",
    divisionCode: "HUMAS",
    divisionName: "HUBUNGAN MASYARAKAT",
    status: "completed",
    executionDate: "15 AGUSTUS 2026",
    location: "Ruang Teater Universitas Trilogi & Zoom Webinar",
    targetAudience: "Mahasiswa Tingkat Akhir & Calon Wisudawan Teknik Informatika",
    shortDesc:
      "Program pembekalan karir profesional, bedah CV ATS-friendly, simulasi technical interview, dan sharing session bersama alumni sukses di industri teknologi.",
    fullDesc: [
      "Program Dukungan Karir diselenggarakan untuk mendampingi mahasiswa tingkat akhir dalam mempersiapkan transisi mulus dari bangku perkuliahan ke dunia kerja profesional.",
      "Menghadirkan alumni-alumni Teknik Informatika Universitas Trilogi yang kini telah berkiprah sebagai Tech Lead, Senior Software Engineer, dan UI/UX Designer di berbagai startup unicorn dan multinasional.",
      "Kegiatan mencakup sesi bedah resume dan portofolio GitHub secara one-on-one, tips menghadapi live coding challenge, serta strategi negosiasi kontrak kerja pertama.",
    ],
    objectives: [
      "Meningkatkan daya saing lulusan Teknik Informatika di pasar tenaga kerja teknologi.",
      "Membantu mahasiswa menyusun portofolio teknikal dan CV yang memenuhi standar rekrutmen global.",
      "Memperkuat ikatan alumni sebagai jejaring pendukung bagi mahasiswa yang baru lulus.",
      "Memberikan pemahaman tentang tren gaji, etika profesional, dan roadmap karir masa kini.",
    ],
    rundown: [
      { time: "09.00 - 09.30", activity: "Registrasi Peserta & Sambutan Ketua Himpunan" },
      { time: "09.30 - 10.45", activity: "Sesi 1: Menembus Screening CV & Portofolio Engineering" },
      { time: "10.45 - 12.00", activity: "Sesi 2: Rahasia Menghadapi Technical Coding Interview" },
      { time: "13.00 - 15.00", activity: "1-on-1 Mentorship Corner & Bedah Portofolio bersama Alumni" },
    ],
    coverImage: "/image/dukungan karir.jpg",
    galleryImages: [
      "/image/dukungan karir.jpg",
      "/image/fotokarya1.jpg",
    ],
    contactPerson: {
      name: "Dimas Srimuladi (Humas)",
      role: "Narahubung Karir & Alumni",
      contact: "https://wa.me/6281234567893",
    },
    isFeatured: false,
  },
  {
    id: "proker-06",
    number: "06",
    title: "KOLABORASI TEKNOLOGI & KOMUNITAS",
    slug: "kolaborasi-teknologi",
    divisionCode: "KOLABORASI",
    divisionName: "KOLABORASI SEMUA DIVISI",
    status: "ongoing",
    executionDate: "PERIODE AKTIF 2026/2027",
    location: "Kampus Universitas Trilogi & Komunitas Rekanan",
    targetAudience: "Mahasiswa Informatika, Sistem Informasi, & Komunitas Developer Luar",
    shortDesc:
      "Inisiatif kerja sama HIMATIKA bersama himpunan mahasiswa kampus lain dan komunitas developer luar (seperti GDSC) untuk mengadakan workshop bareng, sharing session, dan karya kolaborasi.",
    fullDesc: [
      "HIMATIKA meyakini bahwa lompatan inovasi terbaik lahir dari keterbukaan untuk berkolaborasi. Program ini merupakan payung kerja sama strategis antara HIMATIKA Trilogi, HIMASI (Himpunan Mahasiswa Sistem Informasi), dan komunitas developer global seperti Google Developer Student Clubs (GDSC).",
      "Melalui program kolaborasi ini, ketiga entitas menyatukan sumber daya untuk menggelar workshop lintas displin ilmu, kompetisi internal bersama, serta proyek perangkat lunak open-source yang dapat dimanfaatkan oleh civitas akademika.",
      "Program ini melibatkan kontribusi aktif dari seluruh divisi di kepengurusan HIMATIKA, mulai dari perizinan BPH, publikasi Medkraf, logistik Sarlog, relasi Humas, hingga substansi materi oleh Divisi Riset.",
    ],
    objectives: [
      "Membangun sinergi harmonis antara program studi di rumpun ilmu komputer dan teknologi informasi.",
      "Memperluas jejaring koneksi mahasiswa dengan komunitas developer di luar kampus.",
      "Menghadirkan pembicara dan mentor teknologi berskala nasional melalui kolaborasi terpadu.",
      "Menciptakan proyek software kolaboratif yang berdampak nyata bagi masyarakat.",
    ],
    rundown: [
      { time: "Tahap 1", activity: "Penyusunan Nota Kesepahaman & Jadwal Kolaborasi Antar-Ormawa" },
      { time: "Tahap 2", activity: "Joint Workshop: Cloud Computing & Web Architecture bersama GDSC" },
      { time: "Tahap 3", activity: "Collaborative Hackathon: Solusi Cerdas Lingkungan Kampus" },
      { time: "Tahap 4", activity: "Evaluasi Bersama & Serah Terima Hasil Karya Digital" },
    ],
    coverImage: "/image/kolaborasi.png",
    isWhiteBackground: true,
    galleryImages: [
      "/image/kolaborasi.png",
      "/image/fotokarya2.jpg",
    ],
    registrationLink: "https://forms.gle/kolaborasi-teknologi-2026",
    contactPerson: {
      name: "Musyaffa Salman (Kahim)",
      role: "Penanggung Jawab Kemitraan",
      contact: "https://wa.me/6281234567894",
    },
    isFeatured: true,
  },
  {
    id: "proker-07",
    number: "07",
    title: "INFORMATICS STUDY CLUB: AI & FULL-STACK",
    slug: "study-club-ai-fullstack",
    divisionCode: "RISET",
    divisionName: "RISET DAN KEILMUAN",
    status: "ongoing",
    executionDate: "SETIAP SABTU (MINGGUAN)",
    location: "Laboratorium Multimedia & Discord Community Server",
    targetAudience: "Mahasiswa Aktif yang Tertarik Mendalami Coding & AI",
    shortDesc:
      "Kelompok belajar mingguan yang membahas algoritma pemrograman, web development, dan machine learning praktis dari level dasar hingga mahir.",
    fullDesc: [
      "Informatics Study Club adalah ruang belajar santai namun konsisten yang dikelola oleh Divisi Riset dan Keilmuan.",
      "Diadakan setiap akhir pekan, kelompok belajar ini mendiskusikan kurikulum bertingkat mulai dari struktur data, algoritma pemecahan masalah, arsitektur REST API, hingga implementasi library machine learning populer seperti PyTorch dan HuggingFace.",
      "Mahasiswa dapat bebas bertanya, berdiskusi mengenai tugas kuliah, atau berkolaborasi membuat proyek portofolio bersama rekan sebaya.",
    ],
    objectives: [
      "Membiasakan mahasiswa untuk konsisten melatih kemampuan coding di luar jam kuliah formal.",
      "Menyediakan forum tanya-jawab ramah bagi mahasiswa yang mengalami kesulitan mata kuliah pemrograman.",
      "Mengasah pemahaman logika dan problem-solving secara bertahap.",
    ],
    coverImage: "/image/fotokarya1.jpg",
    galleryImages: ["/image/fotokarya1.jpg", "/image/workshop.webp"],
    contactPerson: {
      name: "Kurnia (Riset & Keilmuan)",
      role: "Koordinator Study Club",
      contact: "https://wa.me/6281234567892",
    },
    isFeatured: false,
  },
  {
    id: "proker-08",
    number: "08",
    title: "INFORMATICS E-SPORTS CHAMPIONSHIP",
    slug: "esports-championship",
    divisionCode: "PMB",
    divisionName: "PENGEMBANGAN MINAT & BAKAT",
    status: "ongoing",
    executionDate: "OKTOBER 2026",
    location: "Online Tournament & Stage Final Kampus",
    targetAudience: "Mahasiswa Universitas Trilogi & Komunitas Esports Kampus",
    shortDesc:
      "Turnamen olahraga elektronik antar-kelas dan angkatan untuk menyalurkan bakat gaming kompetitif dalam cabang Mobile Legends dan Valorant.",
    fullDesc: [
      "Informatics E-Sports Championship adalah turnamen e-sports internal yang diselenggarakan oleh Divisi Pengembangan Minat dan Bakat (PMB) untuk mewadahi minat besar mahasiswa di industri game kompetitif.",
      "Selain melatih sportivitas dan kerjasama tim, turnamen ini juga menjadi ajang seleksi bagi atlet esports perwakilan Universitas Trilogi untuk bertanding di kompetisi tingkat nasional.",
    ],
    objectives: [
      "Menyalurkan hobi dan bakat mahasiswa di bidang game kompetitif ke arah yang positif dan terstruktur.",
      "Menjaring bibit atlet esports berbakat untuk mewakili kampus.",
      "Membangun keakraban antar-angkatan melalui kompetisi yang seru dan sportif.",
    ],
    coverImage: "/image/fotokarya2.jpg",
    galleryImages: ["/image/fotokarya2.jpg", "/image/t-expo.jpg"],
    contactPerson: {
      name: "Adi Rahmansyah (PMB)",
      role: "Koordinator E-Sports",
      contact: "https://wa.me/6281234567891",
    },
    isFeatured: false,
  },
  {
    id: "proker-09",
    number: "09",
    title: "UPGRADING INTERNAL & LEADERSHIP CAMP",
    slug: "upgrading-leadership",
    divisionCode: "BPSDM",
    divisionName: "BADAN PENGEMBANGAN SDM",
    status: "completed",
    executionDate: "JUNI 2026",
    location: "Ruang Rapat Kampus & Wisma Kalibata",
    targetAudience: "Seluruh Badan Pengurus Harian & Pengurus Divisi HIMATIKA",
    shortDesc:
      "Pelatihan internal pengurus untuk menyelaraskan visi, melatih kemampuan manajemen waktu, komunikasi kepemimpinan, dan evaluasi paruh periode.",
    fullDesc: [
      "Upgrading Internal merupakan agenda wajib bagi seluruh jajaran pengurus HIMATIKA untuk menjaga soliditas dan motivasi kerja organisasi.",
      "Materi upgrading diisi oleh para alumni senior dan pembina kemahasiswaan dengan fokus pada manajemen konflik, efektivitas rapat organisasi, dan teknik negosiasi kepanitiaan.",
    ],
    objectives: [
      "Mengevaluasi kinerja divisi pada paruh pertama masa kepengurusan.",
      "Meningkatkan kapasitas manajerial dan komunikasi tiap koordinator bidang.",
      "Menjaga keharmonisan dan semangat pengurus dalam merealisasikan seluruh program kerja.",
    ],
    coverImage: "/image/t-camp.jpg",
    galleryImages: ["/image/t-camp.jpg", "/image/tcamp2024.jpg"],
    contactPerson: {
      name: "Galang Jenar (BPSDM)",
      role: "Koordinator BPSDM",
      contact: "https://wa.me/6281234567890",
    },
    isFeatured: false,
  },
  {
    id: "proker-10",
    number: "10",
    title: "RAPAT KERJA TAHUNAN (RAKER) 2026",
    slug: "raker-tahunan-2026",
    divisionCode: "PRESIDIUM",
    divisionName: "PRESIDIUM UTAMA",
    status: "completed",
    executionDate: "MEI 2026",
    location: "Auditorium Lantai 2 Universitas Trilogi",
    targetAudience: "Seluruh Pengurus Resmi & Dewan Pembina HIMATIKA",
    shortDesc:
      "Forum perumusan dan penetapan seluruh agenda kerja, garis besar haluan organisasi, dan anggaran belanja kepengurusan satu periode penuh.",
    fullDesc: [
      "Rapat Kerja Tahunan (RAKER) adalah musyawarah resmi pembuka masa kepengurusan HIMATIKA Universitas Trilogi.",
      "Dalam forum ini, seluruh ketua divisi memaparkan rancangan program kerja, target sasaran peserta, jadwal eksekusi, serta perkiraan anggaran biaya untuk disahkan bersama oleh Presidium Utama dan Badan Pengurus Harian.",
    ],
    objectives: [
      "Menetapkan kalender program kerja resmi HIMATIKA untuk periode 2026/2027.",
      "Menyelaraskan alur koordinasi antar-divisi agar tidak terjadi tumpang tindih agenda.",
      "Mengesahkan rancangan anggaran belanja organisasi yang transparan dan akuntabel.",
    ],
    coverImage: "/image/office tour animation.jpg",
    galleryImages: ["/image/office tour animation.jpg", "/image/fotokarya1.jpg"],
    contactPerson: {
      name: "Musyaffa Salman (Kahim)",
      role: "Presidium Utama",
      contact: "https://wa.me/6281234567894",
    },
    isFeatured: false,
  },
  {
    id: "proker-11",
    number: "11",
    title: "CONTENT CREATION & TECH REELS SERIES",
    slug: "content-creation-reels",
    divisionCode: "MEDKRAF",
    divisionName: "MEDIA KREATIF",
    status: "ongoing",
    executionDate: "RUTIN BULANAN",
    location: "Studio Media Kreatif & Media Sosial Resmi HIMATIKA",
    targetAudience: "Netizen, Pelajar, & Mahasiswa Pengguna Instagram/TikTok",
    shortDesc:
      "Produksi konten visual edukatif, video pendek tips teknologi, tips ngoding, dan dokumentasi sorotan acara himpunan di platform media sosial.",
    fullDesc: [
      "Divisi Media Kreatif secara konsisten memproduksi konten visual bertaraf profesional untuk meningkatkan visibilitas dan citra positif HIMATIKA Universitas Trilogi di dunia maya.",
      "Format konten meliputi reels tips pemrograman, carousel infografis teknologi masa depan, kuis seputar IT, dan liputan live event kampus.",
    ],
    objectives: [
      "Menyebarkan literasi teknologi yang ringan, relevan, dan mudah dipahami publik.",
      "Meningkatkan engagement dan jumlah pengikut media sosial resmi HIMATIKA.",
      "Mengasah kreativitas tim Media Kreatif dalam desain grafis, editing video, dan copywriting.",
    ],
    coverImage: "/image/fotokarya2.jpg",
    galleryImages: ["/image/fotokarya2.jpg", "/image/fotokarya1.jpg"],
    contactPerson: {
      name: "Fadly Akbar (Medkraf)",
      role: "Koordinator Medkraf",
      contact: "https://wa.me/6281234567895",
    },
    isFeatured: false,
  },
  {
    id: "proker-12",
    number: "12",
    title: "DELEGASI HACKATHON & GEMASTIK PREP CAMP",
    slug: "delegasi-hackathon-prep",
    divisionCode: "RISET",
    divisionName: "RISET DAN KEILMUAN",
    status: "upcoming",
    executionDate: "JANUARI 2027",
    location: "Laboratorium Komputer & Coworking Space",
    targetAudience: "Mahasiswa Terpilih Delegasi Lomba IT Nasional",
    shortDesc:
      "Program pendampingan khusus dan inkubasi ide bagi tim mahasiswa yang akan berlaga di kompetisi bergengsi Pagelaran Mahasiswa Nasional (GEMASTIK) dan Hackathon.",
    fullDesc: [
      "Program inkubasi intensif untuk membimbing mahasiswa berprestasi dalam merancang proposal karya inovasi, menyusun prototype aplikasi, dan melatih teknik presentasi (pitching) di hadapan dewan juri kompetisi IT nasional.",
    ],
    objectives: [
      "Meningkatkan raihan medali dan prestasi mahasiswa Teknik Informatika Universitas Trilogi di kancah nasional.",
      "Memberikan pendampingan teknis dan finansial bagi delegasi lomba kampus.",
      "Melahirkan inovasi software yang layak diajukan sebagai karya paten atau startup rintisan.",
    ],
    coverImage: "/image/workshop.webp",
    galleryImages: ["/image/workshop.webp", "/image/fotokarya1.jpg"],
    contactPerson: {
      name: "Kurnia (Riset & Keilmuan)",
      role: "Koordinator Riset",
      contact: "https://wa.me/6281234567892",
    },
    isFeatured: false,
  },
];

export const DIVISION_FILTER_OPTIONS = [
  { label: "SEMUA DIVISI", value: "ALL" },
  { label: "KOLABORASI SEMUA DIVISI", value: "KOLABORASI" },
  { label: "PRESIDIUM", value: "PRESIDIUM" },
  { label: "BPSDM", value: "BPSDM" },
  { label: "MINAT & BAKAT", value: "PMB" },
  { label: "RISET & KEILMUAN", value: "RISET" },
  { label: "HUMAS", value: "HUMAS" },
  { label: "SARLOG", value: "SARLOG" },
  { label: "MEDIA KREATIF", value: "MEDKRAF" },
];
