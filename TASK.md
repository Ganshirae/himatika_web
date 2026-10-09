# TASK MASTERPLAN & EXECUTION CHECKLIST: HIMATIKA REVAMP
> **Dokumen Panduan Kerja Bertahap, Rincian Tiket Tugas, dan Pelacak Progres**  
> **Basis Rujukan:** [`PROJECT.md`](./PROJECT.md), [`DESIGN.md`](./DESIGN.md), [`ARCHITECTURE.md`](./ARCHITECTURE.md)  
> **Status:** Siap Dieksekusi (*Awaiting Green Light*)  

---

## Ringkasan Progres Utama

```text
[x] FASE 0: Persiapan Lingkungan & Prasyarat Sistem
[ ] FASE 1: Inisialisasi Fondasi Next.js & Desain Sistem
[ ] FASE 2: Komponen Global & Navigasi Sinematik
[ ] FASE 3: Halaman Beranda (Cinematic Hero & Proker Showcase)
[ ] FASE 4: Halaman Tentang Kami (Interactive Org Blueprint)
[ ] FASE 5: Katalog Program Kerja Dedikasi (/proker)
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

- [ ] **Task 1.1: Scaffolding Project Next.js**
  - [ ] Inisialisasi Next.js dengan TypeScript, Tailwind CSS, ESLint, dan App Router (`src/app/`).
  - [ ] Bersihkan boilerplate default Next.js (`page.tsx`, `globals.css`).
  - [ ] Pasang dependensi esensial:
    ```bash
    npm install @supabase/ssr @supabase/supabase-js gsap @studio-freight/lenis lucide-react clsx tailwind-merge
    ```
- [ ] **Task 1.2: Konfigurasi Tipografi & Google Fonts**
  - [ ] Setup `next/font/google` untuk memuat font:
    - `Anton` / `Anton SC` (Display Headline)
    - `JetBrains Mono` (Technical Metadata & Data)
    - `Poppins` (Body Text & Content)
  - [ ] Konfigurasi variabel CSS font di `layout.tsx` dan `tailwind.config.ts`.
- [ ] **Task 1.3: Konfigurasi Design Tokens di Tailwind**
  - [ ] Daftarkan palet warna *Dark Obsidian* (`#050505`, `#0c0c0e`, `#141418`).
  - [ ] Daftarkan warna aksen (`#00e5ff`, `#0066ff`, `#10b981`, `#ef4444`).
  - [ ] Daftarkan utility border hairline (`1px solid rgba(255,255,255,0.08)`).
- [ ] **Task 1.4: Konfigurasi Integrasi Supabase Client**
  - [ ] Buat file lingkungan `.env.local` (URL dan Anon Key Supabase).
  - [ ] Tulis utilitas `src/lib/supabase/client.ts` untuk browser client.
  - [ ] Tulis utilitas `src/lib/supabase/server.ts` untuk server components & actions.
  - [ ] Tulis utilitas `src/lib/supabase/middleware.ts` untuk session refresh.

---

### FASE 2: Komponen Global & Navigasi Sinematik
> *Tujuan: Membangun frame global yang menyatukan seluruh halaman web.*

- [ ] **Task 2.1: Provider Lenis Smooth Scroll**
  - [ ] Buat komponen pembungkus `SmoothScroller.tsx` menggunakan Lenis.
  - [ ] Pasang di Root Layout (`src/app/layout.tsx`).
- [ ] **Task 2.2: Fixed Header (Navbar Desktop & Mobile)**
  - [ ] Implementasikan layout edge-to-edge dengan border tipis bawah.
  - [ ] Sisi Kiri: Branding `HIMATIKA TRILOGI` + Logo.
  * Sisi Tengah: Status pill monospaced `● ONLINE // 2026-2027` dengan pulse animation.
  - [ ] Sisi Kanan: Menu link (`BERANDA`, `PROKER`, `TENTANG`, `THE VAULT`).
  - [ ] Integrasikan efek GSAP *ScrambleText* pada hover menu desktop.
- [ ] **Task 2.3: Mobile Fullscreen Brutalist Drawer**
  - [ ] Buat tombol hamburger 2 garis minimalis untuk viewport `< 768px`.
  - [ ] Buat overlay fullscreen hitam pekat dengan daftar menu vertikal font `Anton SC` ukuran masif.
  - [ ] Tambahkan animasi slide-in dan backdrop blur.
- [ ] **Task 2.4: Minimalist Footer**
  - [ ] Desain footer monospaced bergaris tipis: Alamat kampus Universitas Trilogi, copyright, link sosial media (Instagram, GitHub, LinkedIn), dan tautan cepat.

---

### FASE 3: Halaman Beranda (Cinematic Hero & Proker Showcase)
> *Tujuan: Membangun impresi pertama yang dramatis dan sinematik.*

- [ ] **Task 3.1: Hero Section Sinematik**
  - [ ] Buat komponen `HeroVideo.tsx` dengan video loop background (`muted autoplay loop playsinline`).
  - [ ] Tambahkan lapisan overlay gelap vignette 40% dan noise texture canvas.
  - [ ] Buat typographic lockup: `HIMPUNAN MAHASISWA` (Mono) -> `TEKNIK INFORMATIKA` (Anton SC Masif) -> `UNIVERSITAS TRILOGI`.
  - [ ] Implementasikan animasi GSAP SplitText reveal saat pertama kali halaman dimuat.
  - [ ] Pasang indikator *Scroll to Explore* di pojok kiri bawah.
- [ ] **Task 3.2: Featured Showcase Slider (Proker Pilihan)**
  - [ ] Buat slider proker split-screen (Preview visual 55% + Konten teks 45%).
  - [ ] Hubungkan slider dengan query 3–4 proker unggulan dari tabel Supabase `work_programs` (`is_featured = true`).
  - [ ] Tampilkan nomor urut monospaced (`01 / 04`), nama divisi, judul proker, dan ringkasan.
  - [ ] Buat progress bar linear dinamis dan tombol arah panah dengan efek magnetik.
  - [ ] Beri dukungan touch swipe horizontal untuk pengguna smartphone.
- [ ] **Task 3.3: Seksi Quick Metrics / Statistik HIMA**
  - [ ] Tampilkan 4 angka metrik besar (Tahun Berdiri: 2015, Anggota Aktif, Kegiatan Terlaksana, Prestasi).
  - [ ] Gunakan font `JetBrains Mono` dengan animasi penghitung angka naik (*counter ticker*).

---

### FASE 4: Halaman Tentang Kami (Interactive Org Blueprint)
> *Tujuan: Menyajikan identitas dan struktur organisasi tanpa foto konvensional.*

- [ ] **Task 4.1: Narasi Sejarah, Visi, & Misi**
  - [ ] Bangun layout tipografi editorial dua kolom untuk sejarah HIMATIKA sejak 2015.
  - [ ] Sajikan Visi dan Misi dengan format data spesifikasi teknis bergaris pembatas halus.
- [ ] **Task 4.2: Komponen Interactive Org Blueprint (Node Diagram)**
  - [ ] Bangun bagan pohon hierarki menggunakan SVG garis sirkuit/PCB:
    - Level 1: Presidium Utama (Kahim & Wakahim)
    - Level 2: Badan Pengurus Harian (Sekretaris & Bendahara)
    - Level 3: 6 Divisi Pelaksana (BPSDM, Humas, Riset & Keilmuan, PMB, Sarlog, Media Kreatif)
  - [ ] Berikan status interaktif pada setiap node (Border cyan menyala saat hover, pointer cursor).
  - [ ] Buat mode adaptasi mobile: Mengubah diagram lebar menjadi akordeon hierarki vertikal bertingkat.
- [ ] **Task 4.3: Slide-over Detail Drawer untuk Divisi**
  - [ ] Buat panel drawer yang meluncur dari kanan layar saat node divisi diklik.
  - [ ] Tampilkan data dinamis dari Supabase: Nama lengkap divisi, tupoksi, Kepala Divisi, daftar anggota, dan program kerja yang dinaungi.

---

### FASE 5: Katalog Program Kerja Dedikasi (`/proker`)
> *Tujuan: Menyediakan arsip dan jadwal kegiatan yang komprehensif.*

- [ ] **Task 5.1: Sticky Filter Bar**
  - [ ] Buat bar filter status: `[Semua]`, `[Upcoming]`, `[Ongoing]`, `[Completed]`.
  - [ ] Buat filter divisi berdasarkan 8 entitas kepengurusan.
  - [ ] Implementasikan query string URL (`/proker?status=upcoming&division=RISET`) agar state filter dapat di-bookmark.
- [ ] **Task 5.2: Brutalist Proker Card Grid**
  - [ ] Susun layout grid 2 kolom (Desktop) dan 1 kolom (Mobile).
  - [ ] Tampilkan metadata badge: Status kegiatan, tanggal pelaksanaan, divisi pelaksana.
  - [ ] Berikan efek hover zoom halus pada gambar cover proker.
- [ ] **Task 5.3: Halaman Rincian Detail Proker (`/proker/[slug]`)**
  - [ ] Konfigurasi *Dynamic Route* dengan *Static Generation (generateStaticParams)* untuk kecepatan akses.
  * Tampilkan rincian acara lengkap (deskripsi, sasaran, rundown/konten Markdown).
  - [ ] Tampilkan galeri dokumentasi foto kegiatan (jika status telah *Completed*).

---

### FASE 6: The Vault - Portal Keuangan Kas Internal (`/vault`)
> *Tujuan: Sistem transparansi pembukuan kas khusus pengurus HIMATIKA.*

- [ ] **Task 6.1: Antarmuka Terminal Login (`/login`)**
  - [ ] Bangun form login bertema *Security Clearance Level 1*.
  - [ ] Hubungkan form dengan Server Action `loginUser` (Supabase Auth).
  - [ ] Tangani penanganan pesan error (kredensial salah, akun dinonaktifkan) dengan gaya peringatan terminal.
- [ ] **Task 6.2: Route Guard di Next.js Middleware**
  - [ ] Lindungi rute `/vault/*`: Arahkan pengunjung non-login ke `/login`.
  - [ ] Cegah caching browser pada halaman privat.
- [ ] **Task 6.3: Dashboard Metrik Keuangan**
  - [ ] Panggil RPC `get_financial_summary()` untuk menampilkan:
    - Saldo Kas Aktif Saat Ini (Angka masif, warna aksen hijau)
    - Total Pemasukan Periode Ini
    - Total Pengeluaran Periode Ini
- [ ] **Task 6.4: Tabel Buku Kas Interaktif**
  - [ ] Tampilkan riwayat transaksi per tanggal: Judul transaksi, kategori kas, tipe (Masuk/Keluar), nominal Rupiah, penginput.
  - [ ] Fitur preview bukti kuitansi: Menampilkan modal gambar dari Supabase Private Storage via *Signed URL*.
- [ ] **Task 6.5: Formulir Pencatatan Transaksi Baru (Role Bendahara)**
  - [ ] Buat modal/form input transaksi: Judul, nominal, kategori, tanggal, catatan.
  - [ ] Input drag-and-drop foto bukti kuitansi/struk transfer.
  - [ ] Unggah file ke bucket `vault-receipts` dan simpan baris baru ke tabel `finance_records`.
  - [ ] Panggil `revalidatePath('/vault')` agar saldo dan tabel langsung terbarui seketika.

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
