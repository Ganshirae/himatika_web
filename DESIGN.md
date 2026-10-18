# DESIGN SYSTEM & UI/UX SPECIFICATIONS: HIMATIKA WEB REVAMP
> **Dokumen Spesifikasi Visual, Interaksi, dan Arsitektur Komponen**  
> **Referensi Utama:** [mikkisindhunata.com](https://mikkisindhunata.com/)  
> **Tema:** *Cinematic Brutalist-Editorial & Cyber-Minimalism*  
> **Target Pengguna:** Mahasiswa Teknik Informatika, Dosen, Stakeholder Kampus, Industri Rekanan  

---

## 1. Filosofi Desain & Creative Direction

### 1.1 Konsep Visual: *Cinematic Brutalist-Editorial*
Menolak estetika website ormawa kampus pada umumnya yang serba putih, penuh *gradient* warna-warni generik, dan ilustrasi kartun vektor datar. Desain ini dibangun dengan prinsip:
1. **Tipografi Ekstrem**: Teks bukan sekadar pembawa informasi, melainkan elemen grafis utama. Judul dibuat masif, tegas, dan memenuhi pandangan mata (*all-caps condensed*).
2. **Monospace Engineering**: Semua data kuantitatif, status sistem, waktu, dan metadata disajikan dengan font mesin/kode (`JetBrains Mono`). Ini menciptakan identitas langsung ke dunia pemrograman dan informatika.
3. **High-Contrast Dark Canvas**: Latar belakang hitam pekat (`#050505`) berpadu dengan garis batas tipis presisi (`1px hairline borders`), menghadirkan nuansa studio film atau konsol terminal canggih.
4. **Motion dengan Bobot**: Animasi tidak dibuat ramai atau mengganggu, melainkan halus, sinematik, dan terkalibrasi (menggunakan *inertial smooth scrolling* dan transisi teks teracak).

---

## 2. Design Tokens & Fondasi Visual

### 2.1 Palet Warna & Semantic Tokens (Anti AI-Slop)

> [!IMPORTANT]
> Seluruh warna cyan neon buatan (`#00e5ff`) telah dieliminasi total demi menjaga integritas visual agar tidak terkesan murahan ("AI-slop"). Palet diselaraskan dengan warna biru almamater resmi HIMATIKA & Universitas Trilogi.

```css
:root {
  /* Surface / Backgrounds */
  --bg-canvas: #050505;          /* Latar belakang utama (OLED True Black) */
  --bg-surface: #0c0c0e;         /* Latar belakang card / modul / drawer */
  --bg-surface-hover: #141418;   /* State hover pada baris/kartu */
  --bg-overlay: rgba(5, 5, 5, 0.85); /* Backdrop modal/drawer dengan blur */

  /* Text & Foreground */
  --text-main: #f4f4f6;          /* Putih tajam untuk judul & konten utama */
  --text-secondary: #a1a1aa;     /* Titanium Slate untuk paragraf deskripsi */
  --text-muted: #71717a;         /* Abu-abu redup untuk metadata & micro-copy */

  /* Accent Colors (HIMATIKA Official Palette) */
  --accent-blue: #2563eb;        /* Royal Blue identitas HIMATIKA & Trilogi */
  --accent-blue-hover: #3b82f6;  /* Blue glow interaktif untuk hover state */
  --accent-green: #10b981;       /* Hijau status: Terlaksana / Uang Masuk */
  --accent-red: #ef4444;         /* Merah status: Uang Keluar / Alert */

  /* Borders & Dividers */
  --border-hairline: rgba(255, 255, 255, 0.08); /* Garis batas default 1px */
  --border-active: rgba(255, 255, 255, 0.25);   /* Garis batas fokus/aktif */
  --border-blue: rgba(37, 99, 235, 0.4);        /* Garis highlight biru aksen */
}
```

### 2.2 Hierarki Tipografi Fluid (Formula CSS `clamp()`)

Menggunakan rumus fluid agar ukuran huruf proporsional otomatis di monitor 4K, laptop, maupun layar smartphone 390px:

| Tingkatan | Font Family | Formula CSS `clamp()` | Karakter & Kegunaan |
| :--- | :--- | :--- | :--- |
| **Hero Display** | `Anton` | `clamp(2.75rem, 8vw, 7.5rem)` | All-Caps, Line-height: `0.9`, Judul utama halaman Beranda |
| **Section Title** | `Anton` | `clamp(2rem, 5vw, 4.5rem)` | All-Caps, Judul tiap seksi (ABOUT, PROKER, THE VAULT) |
| **Card Title** | `Poppins` SemiBold | `clamp(1.15rem, 2vw, 1.75rem)` | Judul nama Program Kerja & Divisi |
| **Tech Label** | `JetBrains Mono` Medium | `clamp(0.7rem, 1vw, 0.875rem)` | Uppercase, Tracking: `0.15em`, Label nomor `01/06`, Badge status |
| **Body Text** | `Poppins` Regular | `clamp(0.875rem, 1.1vw, 1.05rem)` | Line-height: `1.65`, Paragraf deskripsi panjang |
| **Micro Data** | `JetBrains Mono` Light | `0.75rem` (12px fixed) | Tanggal, timestamp transaksi, kode divisi |

### 2.3 Grid, Layout, & Spacing Rules
* **Container Width**: Max `1440px` dengan *gutter padding*:
  * Desktop: `padding: 0 3.5rem` (56px)
  * Tablet: `padding: 0 2rem` (32px)
  * Mobile: `padding: 0 1.25rem` (20px)
* **Hairline Border Rule**: Setiap modul dipisahkan oleh garis tipis solid `1px solid var(--border-hairline)`. Tidak ada box-shadow buram bergaya material design.
* **Negative Space**: Komposisi ruang bernapas murni dipertahankan pada area sentral navbar dan jeda antar seksi.
* **Aspect Ratios Media**:
  * Hero Slideshow: Full-screen `100vw` × `100vh` (Object-fit cover)
  * Proker Card Media: `16:9` (Landscape) atau `4:3`
  * Bukti Kuitansi Keuangan: `1:1` thumbnail dengan modal preview ukuran asli

### 2.4 Z-Index Layering Matrix
```text
z-index: 100  -> Mobile Fullscreen Navigation Drawer / Modal Drawers
z-index: 50   -> Global Header Fixed Navbar / Slide-over Division Drawer
z-index: 10   -> Interactive Controls (Slider prev/next, Floating Action Button)
z-index: 1    -> Main Content Stream
z-index: 0    -> Background Slideshow & Canvas Grid Noise
```

---

## 3. Spesifikasi Komponen & Halaman

### 3.1 Global Header (Navbar)

```text
[ DESKTOP VIEWPORT ]
+-----------------------------------------------------------------------------------------+
| [LOGO + HIMATIKA TRILOGI]         [ PURE NEGATIVE SPACE ]         [BERANDA] [PROKER] [TENTANG] [(User)] |
+-----------------------------------------------------------------------------------------+
```

* **Struktur**:
  * **Sisi Kiri**: Logo resmi HIMATIKA + Teks merek `HIMATIKA TRILOGI` (Font `Anton`). Teks merek dilengkapi animasi interaktif **ScrambleText** saat kursor mendekat. Subtitle "Dept. of Informatics" ditiadakan demi kesederhanaan visual.
  * **Sisi Tengah**: **Pure Negative Space** (murni kosong dan bersih tanpa teks status robotik "SYS: ONLINE").
  * **Sisi Kanan**: Menu navigasi publik: `BERANDA` (`/`), `PROKER` (`/proker`), `TENTANG` (`/about`), dan tombol ikon profil minimalis **User Profile (`<User />`)** yang mengarahkan ke Portal Pengurus (`/login`).
* **Adaptasi Mobile**:
  * Menu navigasi desktop disembunyikan.
  * Menampilkan tombol hamburger minimalis 2 garis tipis.
  * Ketika ditekan: Membuka *fullscreen brutalist drawer* dengan menu vertikal raksasa font `Anton` beranimasi acak huruf.

---

### 3.2 Halaman Beranda (Home / Landing)

#### A. Hero Cinematic Section
* **Latar Belakang**:
  * Slideshow otomatis foto dokumentasi kegiatan asli HIMATIKA beresolusi tinggi dan **berwarna penuh (*full color*)** (bukan hitam-putih buatan).
  * Dilengkapi efek transisi *Ken Burns zoom* perlahan dan vignette halus di tepi layar agar teks putih selalu terbaca tajam dan berwibawa.
* **Tipografi Lockup**:
  * Baris 1: `HIMPUNAN MAHASISWA` (Monospace `JetBrains Mono`, tracking lebar).
  * Baris 2: `TEKNIK INFORMATIKA` (Masif font `Anton`, `clamp(3.5rem, 9vw, 8.5rem)`).
  * Baris 3: `UNIVERSITAS TRILOGI` (Font `Anton`, diwarnai **Biru Tua HIMATIKA `#2563eb`** sesuai lambang universitas).
* **Bottom Controls**:
  * Indikator scroll di sudut kiri bawah: `SCROLL TO EXPLORE` dengan garis penunjuk animasi.

#### B. Featured Showcase Slider (Program Kerja Pilihan)
* **Layout**: Split komposisi 2 sisi (55% visual preview + 45% metadata):
  * **Sisi Kiri (55%)**: Foto dokumentasi asli kegiatan berwarna tajam (T-Camp, IT Expo, Workshop, Company Visit MNC).
  * **Sisi Kanan (45%)**: Counter monospaced (`01 / 04`), nama divisi, judul kegiatan, deskripsi ringkas, dan tombol tautan detail.
* **Navigasi Slider**:
  * Progress bar linear dinamis yang terisi halus saat slide berganti.
  * Tombol navigasi panah kiri/kanan dengan hover styling.
  * Dukungan sentuhan gestur **horizontal touch swipe** pada smartphone.

#### C. Quick Metrics Blueprint
* Menampilkan 4 metrik historis: Tahun Berdiri (`2015`), 8 Divisi Resmi (`08`), 24+ Program Kerja (`24+`), dan 500+ Kader & Alumni (`500+`).

---

### 3.3 Halaman Tentang Kami: Interactive Org Blueprint (Tanpa Foto Individu)

> **Prinsip Fundamental**: Mengeliminasi kartu foto individu untuk menghindari tampilan yang tidak seragam dan memberikan kesan sistem arsitektur komputer murni.

```mermaid
graph TD
    classDef leader fill:#0c0c0e,stroke:#2563eb,stroke-width:2px,color:#f4f4f6;
    classDef bph fill:#0c0c0e,stroke:#ffffff,stroke-width:1px,color:#f4f4f6;
    classDef div fill:#0c0c0e,stroke:rgba(255,255,255,0.15),stroke-width:1px,color:#a1a1aa;

    KAHIM["KAHIM & WAKAHIM<br/><small style='color:#3b82f6'>PRESIDIUM UTAMA</small>"]:::leader
    
    KAHIM --> BPH_SEK["SEKRETARIS<br/><small>Administrasi & Kearsipan</small>"]:::bph
    KAHIM --> BPH_BEN["BENDAHARA<br/><small>Keuangan & Anggaran</small>"]:::bph

    KAHIM --> DIV_PSDM["BPSDM<br/><small>Pengembangan SDM</small>"]:::div
    KAHIM --> DIV_HUMAS["HUMAS<br/><small>Relasi Publik & Industri</small>"]:::div
    KAHIM --> DIV_RISET["RISET & KEILMUAN<br/><small>Akademik & Riset AI</small>"]:::div
    KAHIM --> DIV_PMB["MINAT & BAKAT<br/><small>IT Expo & Esports</small>"]:::div
    KAHIM --> DIV_SARLOG["SARANA & LOGISTIK<br/><small>Inventaris & Fasilitas</small>"]:::div
    KAHIM --> DIV_MEDKRAF["MEDIA KREATIF<br/><small>Desain & Multimedia</small>"]:::div
```

#### Spesifikasi Visual Node Diagram:
* **Gaya Garis**: Jalur sirkuit bus (*motherboard circuit bus*) dengan connector dots biru menyala dan divider garis putus-putus presisi.
* **Dual View Modes**: Pengguna dapat berganti antara tampilan **Circuit Bus** dan **Grid Matrix**.
* **Kotak Node (Bagan)**:
  * Bentuk: Persegi panjang berpresisi sudut tegas dengan crosshairs pojok.
  * Status Normal: Background `#0c0c0e`, border hairline tipis, teks abu-abu terang.
  * Status Hover: Border menyala aksen biru HIMATIKA (`#2563eb`), teks judul membesar sedikit, kursor berubah menjadi pointer.
* **Mekanisme Interaksi Drawer (Slide-Over Panel - `DivisionDrawer.tsx`)**:
  * Ketika pengunjung mengklik salah satu node divisi (misal: **MEDIA KREATIF** atau **PRESIDIUM**):
  * Layar tidak berpindah halaman. Dari sisi kanan meluncur panel hitam selebar 540px di desktop (atau fullscreen di ponsel).
  * Isi Drawer:
    * Tag Level & Kode: `[INSPECTION PANEL // SPEC: MEDKRAF]`.
    * Nama lengkap dan ringkasan peran.
    * 01 // Tugas Pokok & Fungsi (Tupoksi) dalam format poin-poin bernomor.
    * 02 // Struktur Pimpinan, nama koordinator, dan jumlah personel staf.
    * 03 // Program Kerja naungan divisi terkait (dengan tautan langsung ke katalog proker).
    * 04 // Bidang Fokus (#VISUAL DESIGN, #MULTIMEDIA, dll).
    * Tombol tutup cepat via tombol `[ESC]` atau tombol klik.

---

### 3.4 Halaman Khusus Program Kerja (`/proker`)

* **Sticky Filter Bar**:
  * Filter Status: `[SEMUA]` `[UPCOMING]` `[ONGOING]` `[COMPLETED]`.
  * Filter Divisi: Dropdown monospaced untuk memfilter berdasarkan 8 divisi HIMATIKA.
* **Katalog Layout (Brutalist Card Grid)**:
  * Grid 2 kolom di desktop, 1 kolom di HP.
  * Setiap kartu memiliki border tipis, rasio 16:9 untuk visual banner.
  * Di pojok kiri atas kartu terdapat tag monospaced: `[STATUS: COMPLETED]` atau `[DATE: 12.11.2026]`.
  * Di bawah kartu tertera judul besar font `Anton SC` dan tombol panah `PELAJARI DETAIL [→]`.
* **Halaman / Modal Detail Proker**:
  * Ketika dibuka, menampilkan deskripsi lengkap, tujuan kegiatan, dokumentasi foto (jika sudah terlaksana), dan susunan panitia penanggung jawab.

---

### 3.5 The Vault: Portal Keuangan Kas Internal (`/vault`)

Khusus diperuntukkan bagi pengurus internal HIMATIKA (terproteksi Supabase Auth & RLS).

#### A. Antarmuka Login (Restricted Terminal)
* Latar belakang gelap dengan kotak otentikasi minimalis di tengah layar.
* Header: `[RESTRICTED AREA // HIMATIKA CLEARANCE LEVEL 1]`.
* Input Form: Email dan Password dengan border garis tipis yang menyala saat aktif.
* Pesan Keamanan: *Unauthorized access attempts are monitored and logged.*

#### B. Dashboard Keuangan (Setelah Login Berhasil)
* **Baris Metrik Ringkasan (KPI Cards)**:
  * **Saldo Kas Saat Ini**: Angka monospaced masif (contoh: `Rp 14.850.000`), teks hijau menyala.
  * **Total Kas Masuk**: Ditampilkan dengan ikon panah masuk hijau.
  * **Total Kas Keluar**: Ditampilkan dengan ikon panah keluar merah.
* **Tabel Buku Kas Interaktif**:
  * Kolom: `Tanggal`, `Keterangan Transaksi`, `Kategori`, `Nominal`, `Penginput`, `Bukti Nota`.
  * Tombol **"Lihat Nota"**: Menampilkan pop-up gambar kuitansi yang tersimpan di Supabase Private Storage.
* **Formulir Input Kas (Khusus Bendahara)**:
  * Modal input cepat untuk mencatat transaksi baru lengkap dengan tombol drag-and-drop unggah foto struk/kuitansi.

---

## 4. Koreografi Gerak & Interaksi (Motion Design)

### 4.1 Lenis Smooth Scroll Configuration
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing eksponensial lembut
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1.0,
  smoothTouch: false, // Matikan emulasi scroll di layar sentuh untuk menjaga performa native HP
});
```

### 4.2 GSAP ScrollTrigger & SplitText Timelines
* **Headline Reveal**: Huruf-huruf judul terpecah menjadi `span` terpisah dan muncul bergeser ke atas secara bertahap (*stagger 0.03s*) saat pertama kali masuk ke viewport.
* **Fade-up Container**: Setiap kartu program kerja dan seksi halaman masuk dengan transisi `opacity: 0 -> 1` dan `translateY: 40px -> 0px` dengan durasi 0.8s kurva `power3.out`.
* **Interactive Hover Magnetic**: Tombol bulat (seperti panah slider atau close button drawer) memiliki efek magnetik lembut mengikuti posisi kursor pengguna sejauh maksimal 8px.

### 4.3 Optimasi Responsif Mobile
* Animasi berat berbasis JS dimatikan atau disederhanakan pada layar dengan lebar `< 768px`.
* Mengganti animasi mouse hover dengan feedback sentuhan instan CSS `:active { opacity: 0.7; transform: scale(0.98); }`.
* Menghindari efek yang memicu *reflow layout* terus menerus; hanya menganimasikan properti GPU-accelerated: `transform` dan `opacity`.

---

## 5. Matriks Breakpoint Perangkat

| Breakpoint | Target Perangkat | Penyesuaian Layout Spesifik |
| :--- | :--- | :--- |
| **Desktop Ultra** (`≥ 1440px`) | Monitor Studio & PC Desktop | Max width `1440px`, cursor magnetik aktif, typography masif `8vw`. |
| **Laptop / Desktop** (`1024px – 1439px`) | MacBook, Laptop Umum | Skala container `1100px`, padding samping 40px, slider 2 kolom. |
| **Tablet** (`768px – 1023px`) | iPad, Galaxy Tab | Navbar beralih ke semi-compact, showcase proker ditumpuk vertikal dengan swipe touch. |
| **Mobile** (`< 768px`) | iPhone, Android Smartphone | Fullscreen hamburger drawer, Single-column card grid, Diagram beralih ke daftar pohon interaktif/akordeon vertikal, video autoplay dikompresi maksimal. |

---

## 6. Standar Aset & Optimasi Media

1. **Video Background**:
   * Format: `.webm` (primer) dengan fallback `.mp4` (H.264 profil baseline).
   * Resolusi: Maksimal 1080p untuk desktop, 720p untuk mobile.
   * Frame Rate: 24 FPS (memberikan kesan film/cinematic).
   * Bitrate Target: Di bawah 1.5 Mbps, ukuran file maksimal 3.5 MB.
2. **Gambar & Banner**:
   * Disajikan via Supabase Storage Image Transformation URL:
     * Thumbnail Mobile: `width=480&format=webp&quality=80`
     * Detail Desktop: `width=1280&format=webp&quality=85`
3. **Ikon Grafis**:
   * Menggunakan pustaka minimalis **Lucide React**. Ketebalan garis diatur konsisten `stroke-width: 1.5px` untuk mempertahankan gaya monospaced yang tajam.

---

## 7. Status Dokumen
* Dokumen ini adalah acuan mutlak implementasi visual dan komponen antarmuka.
* Setiap tahap koding komponen frontend diwajibkan mengacu pada token warna, hierarki tipografi, dan aturan interaksi di atas.
