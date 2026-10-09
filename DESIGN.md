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

### 2.1 Palet Warna & Semantic Tokens

```css
:root {
  /* Surface / Backgrounds */
  --bg-canvas: #050505;          /* Latar belakang utama (OLED True Black) */
  --bg-surface: #0c0c0e;         /* Latar belakang card / modul */
  --bg-surface-hover: #141418;   /* State hover pada baris/kartu */
  --bg-overlay: rgba(5, 5, 5, 0.85); /* Backdrop modal/drawer dengan blur */

  /* Text & Foreground */
  --text-main: #f4f4f6;          /* Putih tajam untuk judul & konten utama */
  --text-secondary: #a1a1aa;     /* Abu-abu netral untuk paragraf deskripsi */
  --text-muted: #52525b;         /* Abu-abu redup untuk metadata & disabled */

  /* Accent Colors */
  --accent-blue: #0066ff;        /* Biru primer identitas HIMATIKA */
  --accent-cyan: #00e5ff;        /* Cyan neon untuk live indicator & hover state */
  --accent-green: #10b981;       /* Hijau status: Terlaksana / Uang Masuk */
  --accent-red: #ef4444;         /* Merah status: Uang Keluar / Alert */

  /* Borders & Dividers */
  --border-hairline: rgba(255, 255, 255, 0.08); /* Garis batas default */
  --border-active: rgba(255, 255, 255, 0.25);   /* Garis batas fokus/aktif */
  --border-cyan: rgba(0, 229, 255, 0.4);        /* Garis highlight aksen */
}
```

### 2.2 Hierarki Tipografi Fluid (Formula CSS `clamp()`)

Menggunakan rumus fluid agar ukuran huruf proporsional otomatis di monitor 4K, laptop, maupun layar smartphone 390px:

| Tingkatan | Font Family | Formula CSS `clamp()` | Karakter & Kegunaan |
| :--- | :--- | :--- | :--- |
| **Hero Display** | `Anton SC` | `clamp(2.75rem, 8vw, 7.5rem)` | All-Caps, Line-height: `0.9`, Judul utama halaman Beranda |
| **Section Title** | `Anton SC` | `clamp(2rem, 5vw, 4.5rem)` | All-Caps, Judul tiap seksi (ABOUT, PROKER, THE VAULT) |
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
* **Aspect Ratios Media**:
  * Hero Teaser Video: Full-screen `100vw` × `100vh` (Object-fit cover)
  * Proker Card Media: `16:9` (Landscape) atau `4:3`
  * Bukti Kuitansi Keuangan: `1:1` thumbnail dengan modal preview ukuran asli

### 2.4 Z-Index Layering Matrix
```text
z-index: 999  -> Custom Cursor Pointer (Desktop only)
z-index: 100  -> Mobile Fullscreen Navigation Drawer / Modal Drawers
z-index: 50   -> Global Header Fixed Navbar
z-index: 10   -> Interactive Controls (Slider prev/next, Floating Action Button)
z-index: 1    -> Main Content Stream
z-index: 0    -> Background Looping Video & Canvas Grid Noise
```

---

## 3. Spesifikasi Komponen & Halaman

### 3.1 Global Header (Navbar)

```text
[ DESKTOP VIEWPORT ]
+-----------------------------------------------------------------------------------------+
| [HIMATIKA TRILOGI]      [SYS: 2026/2027 // DEPT. INFORMATICS]      [BERANDA] [PROKER] [TENTANG] [VAULT] |
+-----------------------------------------------------------------------------------------+
```

* **Struktur**:
  * **Sisi Kiri**: Teks `HIMATIKA TRILOGI` (Font `Anton SC` ukuran kecil `1.1rem`) + Logo monokrom SVG 24px.
  * **Sisi Tengah**: Monospace status pill: `● ONLINE // PERIODE 2026-2027`. Titik hijau berkedip perlahan (*pulse effect*).
  * **Sisi Kanan**: Menu navigasi: `BERANDA`, `PROKER`, `TENTANG KAMI`, dan tombol gated `[THE VAULT]`.
* **Interaksi Hover (Scramble Text)**:
  * Menggunakan plugin GSAP Scramble Text. Saat mouse melewati link menu (misal: "PROKER"), karakternya beracak cepat (`#$X_!`) selama 0.3 detik sebelum kembali ke teks asli.
* **Adaptasi Mobile**:
  * Sisi tengah disembunyikan.
  * Sisi kanan menampilkan tombol hamburger minimalis 2 garis tipis.
  * Ketika ditekan: Layar ditutupi *fullscreen black overlay* dengan teks menu vertikal masif berukuran `3rem` font `Anton SC`.

---

### 3.2 Halaman Beranda (Home / Landing)

#### A. Hero Cinematic Section
* **Latar Belakang**:
  * Video loop kompresi tinggi `.webm` berdurasi 8-12 detik tanpa audio (`muted autoplay loop playsinline`).
  * Lapisan *vignette* tipis di sekeliling layar dan overlay hitam transparan 40% agar teks di atasnya selalu terbaca tajam.
  * *Fallback*: Jika koneksi HP lambat atau mode hemat daya aktif, tampilkan gambar poster bertekstur *grain/noise* gelap.
* **Tipografi Lockup**:
  * Baris 1: `HIMPUNAN MAHASISWA` (Monospace `0.85rem`, tracking lebar)
  * Baris 2: `TEKNIK INFORMATIKA` (Masif font `Anton SC`, `8vw`)
  * Baris 3: `UNIVERSITAS TRILOGI` (Font `Anton SC`, warna abu-abu muda)
* **Bottom Controls**:
  * Indikator scroll di sudut kiri bawah: Tulisan `SCROLL TO EXPLORE` dengan garis penunjuk beranimasi ke bawah.
  * Tombol audio toggle (opsional jika video memiliki ambient audio) di sudut kanan bawah.

#### B. Featured Showcase Slider (Program Kerja Pilihan)
Terinspirasi dari slider portofolio Mikki:
* **Layout**: Split komposisi 2 sisi:
  * Sisi Kiri (55%): Preview video/gambar berputar dinamis dalam bingkai persegi panjang bersudut tegas.
  * Sisi Kanan (45%):
    * Counter Monospace besar: `01 / 04`
    * Kategori Divisi: `[DIVISI RISET & KEILMUAN]`
    * Judul Kegiatan: `INFORMATICS FESTIVAL 2026`
    * Ringkasan 2 kalimat.
    * Tombol garis outline: `LIHAT PROKER ->`
* **Navigasi Slider**:
  * Progress bar tipis sepanjang 100px yang terisi secara dinamis saat slide berganti.
  * Tombol navigasi arah panah kiri/kanan (`<` dan `>`) dengan efek hover lingkaran transparan.
  * Mobile: Mendukung gestur swipe jari horizontal.

---

### 3.3 Halaman Tentang Kami: Interactive Org Chart (Blueprint Diagram)

> **Catatan Kunci**: Mengeliminasi kartu foto individu untuk menghindari tampilan yang tidak seragam dan memberikan kesan sistem arsitektur komputer murni.

```mermaid
graph TD
    classDef leader fill:#0f0f11,stroke:#00e5ff,stroke-width:1.5px,color:#f4f4f6;
    classDef bph fill:#0f0f11,stroke:#ffffff,stroke-width:1px,color:#f4f4f6;
    classDef div fill:#0a0a0c,stroke:rgba(255,255,255,0.15),stroke-width:1px,color:#a1a1aa;

    KAHIM["KAHIM & WAKAHIM<br/><small style='color:#00e5ff'>PRESIDIUM UTAMA</small>"]:::leader
    
    KAHIM --> BPH_SEK["SEKRETARIS<br/><small>Administrasi & Kearsipan</small>"]:::bph
    KAHIM --> BPH_BEN["BENDAHARA<br/><small>Keuangan & Anggaran</small>"]:::bph

    KAHIM --> DIV_PSDM["BPSDM<br/><small>Pengembangan SDM</small>"]:::div
    KAHIM --> DIV_HUMAS["HUMAS<br/><small>Relasi Publik</small>"]:::div
    KAHIM --> DIV_RISET["RISET & KEILMUAN<br/><small>Akademik & Riset</small>"]:::div
    KAHIM --> DIV_PMB["MINAT & BAKAT<br/><small>Hobi & Olahraga</small>"]:::div
    KAHIM --> DIV_SARLOG["SARANA & LOGISTIK<br/><small>Inventaris & Ops</small>"]:::div
    KAHIM --> DIV_MEDKRAF["MEDIA KREATIF<br/><small>Visual & Sosmed</small>"]:::div
```

#### Spesifikasi Visual Node Diagram:
* **Gaya Garis**: Garis penghubung tipis abu-abu putus-putus (`dashed 1px rgba(255,255,255,0.15)`) menyerupai jalur sirkuit PCB (*motherboard*) atau diagram Git commit graph.
* **Kotak Node (Bagan)**:
  * Bentuk: Persegi panjang dengan border tajam (`border-radius: 0px` atau maksimal `2px`).
  * Status Normal: Background `#0c0c0e`, border tipis, teks abu-abu terang.
  * Status Hover: Border menyala aksen cyan (`#00e5ff`), teks judul membesar sedikit, kursor berubah menjadi pointer.
* **Mekanisme Interaksi Drawer (Slide-Over Panel)**:
  * Ketika pengunjung mengklik salah satu kotak divisi (misalnya: **MEDIA KREATIF**):
  * Layar tidak berpindah halaman. Dari sisi kanan layar meluncur panel hitam (*drawer* selebar 450px di desktop, atau *bottom sheet* di HP).
  * Isi Drawer:
    * Kode & Nama Lengkap Divisi: `[DIV_08] MEDIA KREATIF`.
    * Deskripsi Tugas Pokok & Fungsi (Tupoksi) Divisi.
    * Kepala Divisi: Nama & NIM.
    * Daftar Staf/Anggota: Ditampilkan dalam bentuk tabel monospaced rapi bergaris tipis.
    * Daftar Program Kerja yang dipegang oleh divisi tersebut (dengan link langsung ke katalog proker).

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
