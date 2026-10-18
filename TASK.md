# TASK MASTERPLAN & EXECUTION CHECKLIST: HIMATIKA REVAMP
> **Dokumen Panduan Kerja Bertahap, Rincian Tiket Tugas, dan Pelacak Progres**  
> **Basis Rujukan:** [`PROJECT.md`](./PROJECT.md), [`DESIGN.md`](./DESIGN.md), [`ARCHITECTURE.md`](./ARCHITECTURE.md)  
> **Status:** Siap Dieksekusi (*Awaiting Green Light*)  

---

## Ringkasan Progres Utama

```text
[x] FASE 0: Persiapan Lingkungan & Prasyarat Sistem
[x] FASE 1: Inisialisasi Fondasi Next.js & Desain Sistem
[x] FASE 2: Komponen Global & Navigasi Sinematik
[x] FASE 3: Halaman Beranda (Cinematic Hero & Proker Showcase 5 Item)
[x] FASE 4: Halaman Tentang Kami (/about) & Halaman Dedikasi Struktur (/struktur)
[x] AUDIT: Pembersihan Menyeluruh "AI Slop" & Humanisasi Copywriting Seluruh Web
[x] FITUR: Integrasi Proker "Kolaborasi Teknologi & Komunitas" & Tag "Kolaborasi Semua Divisi"
[ ] FASE 5: Katalog Program Kerja Dedikasi (/proker) [DIJADWALKAN BESOK]
[ ] FASE 6: The Vault - Portal Keuangan Kas Internal (/vault)
[ ] FASE 7: Optimasi Kinerja, Audit Mobile, & UI/UX Polish
[ ] FASE 8: Deployment & Peluncuran Produksi
```

---

## Rincian Tiket Kerja per Fase

### FASE 0: Persiapan Lingkungan & Prasyarat Sistem
> *Tujuan: Menyiapkan runtime lokal di mesin Windows dan menghubungkan Supabase via MCP.*

- [x] **Task 0.1: Instalasi Node.js LTS**
  - [x] Instal Node.js versi LTS di sistem Windows via `winget install OpenJS.NodeJS.LTS`.
- [x] **Task 0.2: Konfirmasi Proyek Supabase**
  - [x] Konfirmasi nama proyek: **`Website_Himatika`** (ID: `urlpknogetgjfmwdbymk`).
  - [x] Uji koneksi MCP Supabase: **Berhasil terhubung** (Status: `ACTIVE_HEALTHY`, URL: `https://urlpknogetgjfmwdbymk.supabase.co`).
- [x] **Task 0.3: Eksekusi Skema Basis Data di Supabase**
  - [x] Jalankan DDL migrasi SQL: Buat enum `proker_status`, `finance_type`.
  - [x] Buat tabel `divisions`, `work_programs`, `finance_categories`, `finance_records`.
  - [x] Masukkan *seed data* resmi untuk 8 divisi HIMATIKA (8 baris aktif).
  - [x] Masukkan *seed data* kategori keuangan (8 kategori kas).
  - [x] Buat database view `v_financial_summary` dan fungsi RPC `get_financial_summary()`.
  - [x] Aktifkan *Row Level Security (RLS)* dan pasang kebijakan keamanan data (Public & Authenticated).
  - [x] Buat bucket storage: `public-assets` (Publik) dan `vault-receipts` (Privat).

---

### FASE 1: Inisialisasi Fondasi Next.js & Desain Sistem
> *Tujuan: Menginisialisasi arsitektur Next.js 14/15 App Router dan menyusun token desain.*

- [x] **Task 1.1: Scaffolding Project Next.js**
  - [x] Inisialisasi Next.js (App Router, TypeScript, Turbopack, Tailwind CSS).
  - [x] Bersihkan boilerplate default Next.js (`page.tsx`, `globals.css`).
  - [x] Pasang dependensi esensial (`@supabase/ssr`, `@supabase/supabase-js`, `gsap`, `lenis`, `lucide-react`, `clsx`, `tailwind-merge`).
  - [x] Verifikasi build produksi awal: Sukses tanpa error (`npm run build`).
- [x] **Task 1.2: Konfigurasi Tipografi & Google Fonts**
  - [x] Setup `next/font/google` di `src/app/layout.tsx`:
    - `Anton` (Display Headline)
    - `JetBrains_Mono` (Technical Metadata & Data)
    - `Poppins` (Body Text & Content)
  - [x] Konfigurasi variabel CSS font di `layout.tsx` (`--font-anton`, `--font-mono`, `--font-poppins`).
- [x] **Task 1.3: Konfigurasi Design Tokens di Tailwind**
  - [x] Daftarkan palet warna *Dark Obsidian* (`#050505`, `#0c0c0e`, `#141418`) di `@theme` `globals.css`.
  - [x] Daftarkan warna aksen (`#00e5ff`, `#0066ff`, `#10b981`, `#ef4444`).
  - [x] Daftarkan utility border hairline (`border-hairline`, `1px solid rgba(255,255,255,0.08)`).
- [x] **Task 1.4: Konfigurasi Integrasi Supabase Client**
  - [x] Buat file lingkungan `.env.local` (URL dan Anon Key Supabase).
  - [x] Tulis utilitas `src/lib/supabase/client.ts` untuk browser client (`@supabase/ssr`).
  - [x] Tulis utilitas `src/lib/supabase/server.ts` untuk server components & actions.
  - [x] Tulis utilitas `src/lib/supabase/middleware.ts` & `src/middleware.ts` untuk session refresh dan route guard `/vault`.
  - [x] Tulis utilitas `src/lib/utils.ts` (`cn` dan `formatRupiah`).

---

### FASE 2: Komponen Global & Navigasi Sinematik
> *Tujuan: Membangun frame global yang menyatukan seluruh halaman web.*

- [x] **Task 2.1: Provider Lenis Smooth Scroll**
  - [x] Buat komponen pembungkus `SmoothScroller.tsx` menggunakan Lenis dan React Context.
  - [x] Pasang di Root Layout (`src/app/layout.tsx`) dengan automatic route change scroll reset.
- [x] **Task 2.2: Fixed Header (Navbar Desktop & Mobile)**
  - [x] Implementasikan layout edge-to-edge dengan border hairline bawah dan backdrop blur.
  - [x] Sisi Kiri: Branding `HIMATIKA TRILOGI` + Logo resmi monokrom responsif.
  - [x] Sisi Tengah: Status pill monospaced `● ONLINE // 2026-2027` dengan pulse animation hijau neon.
  - [x] Sisi Kanan: Menu link (`BERANDA`, `PROKER`, `TENTANG`, `KONTAK`) dengan active route line dan tombol User Profile icon (`<User />`) ke `/login`.
  - [x] Integrasikan efek decoding *ScrambleText* pada hover menu desktop.
- [x] **Task 2.3: Mobile Fullscreen Brutalist Drawer**
  - [x] Buat tombol hamburger 2 garis minimalis untuk viewport `< 768px`.
  - [x] Buat overlay fullscreen hitam pekat dengan daftar menu vertikal font `Anton` ukuran masif.
  - [x] Tambahkan animasi decoding ScrambleText, status bar, and direct social links.
  - [x] Integrasikan penguncian scroll Lenis saat drawer dibuka.
- [x] **Task 2.4: Minimalist Footer**
  - [x] Desain footer monospaced bergaris tipis: Alamat kampus Universitas Trilogi, koordinat geografis, copyright, 8 divisi resmi, tautan direktori, link sosial media, dan tombol interaktif *Back To Top*.

---

### FASE 3: Halaman Beranda (Cinematic Hero & Proker Showcase)
> *Tujuan: Membangun impresi pertama yang dramatis dan sinematik.*

- [x] **Task 3.1: Hero Section Sinematik**
  - [x] Buat komponen `HeroSection.tsx` dengan video loop background (`muted autoplay loop playsinline`) dan poster fallback `tcamp2024.jpg`.
  - [x] Tambahkan lapisan overlay gelap vignette, hairline grid, dan film noise SVG texture.
  - [x] Buat typographic lockup: `HIMPUNAN MAHASISWA` (Mono) -> `TEKNIK INFORMATIKA` (Anton Masif) -> `UNIVERSITAS TRILOGI`.
  - [x] Implementasikan animasi GSAP reveal timeline saat pertama kali halaman dimuat.
  - [x] Pasang indikator *Scroll to Explore* di pojok kiri bawah terhubung ke Lenis scroll.
- [x] **Task 3.2: Featured Showcase Slider (5 Proker Unggulan)**
  - [x] Buat slider proker split-screen (Preview visual 55% + Konten teks 45%).
  - [x] Hubungkan slider dengan dataset 5 program kerja unggulan resmi HIMATIKA:
    1. `T-CAMP 2026: KADERISASI & LEADERSHIP` (`/image/tcamp2024.jpg`) — Tag: `KOLABORASI SEMUA DIVISI`
    2. `TRILOGI IT EXPO & INNOVATION FEST` (`/image/t-expo.jpg`) — Tag: `PENGEMBANGAN MINAT & BAKAT`
    3. `TECH WORKSHOP & CODING BOOTCAMP` (`/image/workshop.webp`) — Tag: `RISET & KEILMUAN`
    4. `INDUSTRIAL IMMERSION & COMPANY VISIT` (`/image/Company Visit MNC.jpg`) — Tag: `HUBUNGAN MASYARAKAT`
    5. `KOLABORASI TEKNOLOGI & KOMUNITAS` (`/image/kolaborasi.png`) — Tag: `KOLABORASI SEMUA DIVISI`
  - [x] Tampilkan nomor urut monospaced ringkas (`01 / 05` hingga `05 / 05`), judul proker, dan ringkasan.
  - [x] Wadah latar putih bersih khusus untuk logo `kolaborasi.png` dengan `object-contain`.
  - [x] Styling khusus badge biru lembut untuk proker berkategori `KOLABORASI SEMUA DIVISI`.
  - [x] Tombol `LIHAT DETAIL PROGRAM →` dan progress bar linear dinamis.
  - [x] Dukungan touch swipe horizontal untuk pengguna smartphone.
- [x] **Task 3.3: Seksi Quick Metrics / Statistik HIMA**
  - [x] *(Dihapus/Deprecated sesuai permintaan pengguna untuk layout beranda yang lebih minimalis, fokus langsung ke Proker & Blueprint)*.

---

### FASE 4: Halaman Tentang Kami (`/about`) & Halaman Dedikasi Struktur (`/struktur`)
> *Tujuan: Menyajikan identitas resmi, visi, misi, dan struktur diagram kepengurusan interaktif.*

- [x] **Task 4.1: Halaman Tentang Kami Ringkas & Terkurasi (`/about`)**
  - [x] Desain "Opsi 1" terverifikasi: Logo resmi HIMATIKA mandiri (besar hingga 320px) berdampingan natural dengan teks identitas.
  - [x] Menghilangkan bingkai kotak luar dan crosshair di sekeliling logo.
  - [x] Mengatasi jarak/gap berlebih dengan flex layout `items-center gap-8 lg:gap-12 max-w-6xl`.
  - [x] Visi Kami: *"Menjadikan HIMATIKA Universitas Trilogi sebagai ruang tumbuh bagi mahasiswa Teknik Informatika yang unggul, berintegritas, inovatif, dan siap berkontribusi di industri teknologi."* (Bebas buzzword klise AI).
  - [x] Empat pilar Misi Utama ditulis ulang secara membumi (Akademik & Riset, Kepemimpinan & Solidaritas, Kemitraan Aktif, Inovasi & Kontribusi Nyata).
  - [x] Menghapus status bar operasional pabrik dari kartu misi.
  - [x] Kotak konversi Program Kerja & Struktur ke `/proker` dan `/struktur`.
- [x] **Task 4.2: Halaman Baru Struktur Pengurus & Diagram Interaktif (`/struktur`)**
  - [x] Buat halaman rute baru `/struktur` (`src/app/struktur/page.tsx`).
  - [x] Tambahkan link navigasi `STRUKTUR` pada desktop header (`Header.tsx`) dan mobile drawer (`MobileDrawer.tsx`).
  - [x] Integrasikan foto asli seluruh koordinator/kadiv dari arsip kepengurusan (`fais.png`, `yudis.png`, `riska.png`, `nanda.png`, `galang.png`, `dimas.png`, `naya.png`, `adi.png`, `reno.png`, `fadly.png`).
  - [x] **Interaksi Hover 3D Flip & Glitch:** Pada saat cursor mengarah ke kartu, foto muncul dengan 3D perspective flip (`rotateY(-90deg) -> 0deg`) dan scanline sweep biru elektrik.
  - [x] Kartu tetap 100% stabil (tidak berputar membalikkan teks) dan dapat diklik di mana saja untuk membuka drawer rincian.
  - [x] Menghapus instruksi bantuan kursor yang tidak perlu demi estetika minimalis dan bersih.
- [x] **Task 4.3: Slide-over Detail Drawer untuk Divisi (`DivisionDrawer.tsx`)**
  - [x] Panel drawer meluncur dari kanan layar saat node divisi diklik.
  - [x] Menampilkan foto pimpinan divisi, tugas pokok dan fungsi (TUPOKSI) yang telah di-humanisasi, susunan anggota pengurus (`{count} Anggota`), dan daftar proker terkait.
  - [x] Menghapus notasi slash dan label sci-fi (`04 // FOCUS DOMAIN` diganti menjadi `BIDANG FOKUS UTAMA`).

---

### FASE 4.5: Audit Menyeluruh Copywriting & Eliminasi "AI Slop"
> *Tujuan: Menghapus seluruh jargon robotik, sintaks slash ganda (//), dan bahasa birokratis kaku di seluruh website.*

- [x] **Task 4.5.1: Audit Beranda (`/`)**
  - [x] `PORTAL RESMI 2026/2027` -> `HIMATIKA UNIVERSITAS TRILOGI`.
  - [x] Subtext hero disederhanakan menjadi bahasa ramah mahasiswa.
  - [x] `SCROLL KE BAWAH` -> `EKSPLORASI`.
  - [x] `SHOWCASE // 01` -> `PROGRAM UNGGULAN`.
  - [x] `PROGRAM: 01 OF 04` -> `01 / 05`.
  - [x] `NAVIGASI SLIDER` -> `PROGRAM KERJA`.
- [x] **Task 4.5.2: Audit Tentang Kami (`/about`)**
  - [x] `IDENTITAS RESMI ORGANISASI // UNIVERSITAS TRILOGI` -> `TENTANG HIMATIKA TRILOGI`.
  - [x] Visi & 4 Misi dibersihkan dari kata *episentrum*, *adaptif terhadap disrupsi*, *civitas akademika*, *komputasi solutif*.
  - [x] Dihapus: `// ARAH & TUJUAN UTAMA`, `// LANGKAH REALISASI`, `STANDAR OPERASIONAL`, `AKTIF BERJALAN`.
- [x] **Task 4.5.3: Audit Struktur & Drawer (`/struktur`)**
  - [x] `HIMATIKA UNIVERSITAS TRILOGI // PERIODE AKTIF` -> `PERIODE AKTIF 2026/2027`.
  - [x] `RINCIAN DIVISI //` -> `DETAIL BIDANG`.
  - [x] `{count} Personel` -> `{count} Anggota`.
  - [x] Normalisasi seluruh deskripsi & tupoksi Presidium, BPH, dan 6 Divisi di `src/lib/data/organization.ts`.
- [x] **Task 4.5.4: Audit Kontak (`/contact` & `ContactSection.tsx`)**
  - [x] `ADA PERTANYAAN? // HUBUNGI KAMI` -> `ADA PERTANYAAN?`.
  - [x] `KONTAK & HUBUNGI KAMI` -> `HUBUNGI KAMI`.
  - [x] Menghapus badge `RESPON CEPAT` dari formulir.
- [x] **Task 4.5.5: Audit Footer & Mobile Drawer**
  - [x] Menghapus koordinat GPS dan status militer `COORDS: ... // STATUS: DEPLOYED` -> `JAKARTA SELATAN, INDONESIA`.
  - [x] `[01 // DIREKTORI]`, `[02 // ENTIITAS]`, `[03 // JARINGAN]` -> `NAVIGASI`, `DIVISI KAMI`, `MEDIA SOSIAL`.
  - [x] Menghapus metadata internal `STD: CINEMATIC BRUTALIST // VERCEL EDGE`.
  - [x] Menghapus slash pada penomoran drawer mobile (`01 //` -> `01`).

---

### FASE 5: Katalog Program Kerja Dedikasi (`/proker`) [DIJADWALKAN BESOK]
> *Tujuan: Menyediakan arsip dan jadwal kegiatan yang komprehensif, mencakup 6 proker web lama + agenda divisi.*

- [ ] **Task 5.1: Sticky Filter Bar**
  - [ ] Buat bar filter status: `[Semua]`, `[Upcoming]`, `[Ongoing]`, `[Completed]`.
  - [ ] Buat filter divisi berdasarkan 8 entitas kepengurusan + filter `KOLABORASI SEMUA DIVISI`.
  - [ ] Implementasikan query string URL (`/proker?status=upcoming&division=RISET`) agar state filter dapat di-bookmark.
- [ ] **Task 5.2: Brutalist Proker Card Grid**
  - [ ] Susun layout grid 2 kolom (Desktop) dan 1 kolom (Mobile).
  - [ ] Tampilkan 6 proker utama dari arsip lama:
    1. `T-Camp` (Kaderisasi & Karakter - Kolaborasi Semua Divisi)
    2. `T-Expo` (Trilogi IT Expo & Innovation Fest - PMB)
    3. `Workshop Teknologi` (Coding Bootcamp & AI - Riset)
    4. `Company Visit` (Kunjungan Industri MNC/JSC - Humas)
    5. `Dukungan Karir` (Alumni Sharing & CV Workshop - Humas/BPSDM)
    6. `Kolaborasi Teknologi` (Kerja Sama Ormawa & Komunitas GDSC - Kolaborasi Semua Divisi)
  - [ ] Tampilkan metadata badge: Status kegiatan, tanggal pelaksanaan, divisi pelaksana (dengan styling khusus untuk proker kolaboratif).
  - [ ] Efek hover zoom halus pada gambar cover proker.
- [ ] **Task 5.3: Halaman Rincian Detail Proker (`/proker/[slug]`)**
  - [ ] Konfigurasi *Dynamic Route* dengan *Static Generation (generateStaticParams)* untuk kecepatan akses instan.
  - [ ] Tampilkan rincian acara lengkap (deskripsi naratif, sasaran peserta, dokumentasi foto, rundown/konten Markdown).
  - [ ] Pasang tombol CTA Pendaftaran Interaktif (`[DAFTAR SEKARANG ->]` via link Google Form / Contact WhatsApp panitia) jika status `Upcoming`.
  - [ ] Tampilkan galeri dokumentasi foto kegiatan jika status telah `Completed`.

---

### FASE 6: Portal Pengurus (The Vault & Unified CMS) (`/vault`)
> *Tujuan: Sistem kendali terpadu pengurus untuk transparansi kas, publikasi kegiatan, dan pembaruan struktur organisasi.*

- [ ] **Task 6.1: Antarmuka Terminal Login (`/login`)**
  - [ ] Selesaikan form login bertema *Security Clearance Level 1*.
  - [ ] Hubungkan form dengan Server Action `loginUser` (Supabase Auth).
  - [ ] Tangani penanganan pesan error (kredensial salah, akun dinonaktifkan) dengan gaya peringatan terminal.
- [ ] **Task 6.2: Route Guard di Next.js Middleware**
  - [ ] Lindungi rute `/vault/*`: Arahkan pengunjung non-login ke `/login`.
  - [ ] Cegah caching browser pada halaman privat.
- [ ] **Task 6.3: Dashboard Metrik Keuangan (The Vault)**
  - [ ] Panggil RPC `get_financial_summary()` untuk menampilkan:
    - Saldo Kas Aktif Saat Ini (Angka masif, warna aksen hijau)
    - Total Pemasukan Periode Ini
    - Total Pengeluaran Periode Ini
- [ ] **Task 6.4: Tabel Buku Kas Interaktif & Upload Kuitansi (Role Bendahara)**
  - [ ] Tampilkan riwayat transaksi per tanggal: Judul transaksi, kategori kas, tipe (Masuk/Keluar), nominal Rupiah, penginput.
  - [ ] Fitur preview bukti kuitansi via *Signed URL* (Supabase Private Storage).
  - [ ] Formulir input transaksi baru + drag-and-drop foto bukti kuitansi.
- [ ] **Task 6.5: Modul Manajemen Program Kerja (CMS Proker)**
  - [ ] Antarmuka Tambah & Edit Program Kerja: Judul, divisi, status (`Upcoming`/`Ongoing`/`Completed`), tanggal, link pendaftaran, dan upload poster/cover ke Supabase Storage.
  - [ ] Kemampuan ubah status proker ke `Completed` beserta upload dokumentasi kegiatan.
- [ ] **Task 6.6: Modul Manajemen Struktur & Divisi (CMS Organisasi)**
  - [ ] Antarmuka pengubahan nama pimpinan (Kahim, Wakahim, Koordinator Divisi).
  - [ ] Kelola daftar anggota dan alokasi personel staf tiap divisi.
  - [ ] Edit tupoksi dan bidang fokus divisi yang langsung merefleksikan perubahan ke `/about`.

---

### FASE 7: Optimasi Kinerja, Audit Mobile, & UI/UX Polish
> *Tujuan: Memastikan standar "Jos Los Gandos" dan performa tanpa cela.*

- [ ] **Task 7.1: Audit Responsivitas Layar Ponsel**
  - [ ] Uji tampilan di resolusi 360px, 390px, 414px (iPhone & Android).
  - [ ] Pastikan tidak ada *horizontal scroll overflow* liar di body.
  - [ ] Pastikan video looping tidak macet di iOS Safari (`playsinline muted`).
- [ ] **Task 7.2: Optimasi Performa & Web Vitals**
  - [ ] Kompresi semua aset gambar lokal ke format WebP.
  - [ ] Audit Google Lighthouse: Target skor > 90 pada Performance, Accessibility, Best Practices, dan SEO.
- [ ] **Task 7.3: Micro-Interactions & Polishing**
  - [ ] Kalibrasi timing animasi GSAP (maksimal durasi transisi 0.8s agar terasa responsif).
  - [ ] Pastikan transisi antar halaman terasa instan dan bebas lag.

---

### FASE 8: Deployment & Peluncuran Produksi
> *Tujuan: Merilis website ke domain publik.*

- [ ] **Task 8.1: Setup Environment Production**
  - [ ] Atur environment variables Supabase di platform hosting produksi.
- [ ] **Task 8.2: Deploy & Build Verification ke Vercel**
  - [ ] Hubungkan repositori GitHub dengan Vercel Dashboard.
  - [ ] Pasang environment variables Supabase di Vercel Settings.
  - [ ] Jalankan `npm run build` dan verifikasi deployment sukses di jaringan Edge Vercel.
- [ ] **Task 8.3: Serah Terima & Dokumentasi Penggunaan**
  - [ ] Uji coba login akun bendahara pertama kali di server produksi.
  - [ ] Selesai!

---

## Pertanyaan Optimalisasi untuk Anda:
Agar langkah kerja di atas berjalan paling mulus, ada **2 hal praktis** yang dapat Anda pertimbangkan:
1. **Instalasi Node.js**: Karena di komputer Anda saat ini Node.js belum terpasang di sistem PATH, apakah Anda mengizinkan saya untuk menginstalnya sekarang via `winget` (`winget install OpenJS.NodeJS.LTS`)?
2. **Platform Hosting**: Untuk deploy nantinya, apakah Anda ingin menggunakan **Vercel** (paling direkomendasikan & instan untuk Next.js) atau tetap menggunakan **Firebase Hosting** yang sudah ada di repo lama?
