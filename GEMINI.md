# AGENT WORK RULES & GUIDELINES: HIMATIKA REVAMP
> **File Acuan Aturan Kerja (System Rules) untuk AI Agent / Pair Programmer**  
> **Lingkup Proyek:** `himatika_web`  
> **Status:** Berlaku Aktif (*Always Enforced*)  

---

## 1. Identitas Proyek & Prinsip Utama

1. **Visi Proyek**: 
   Membangun portal digital resmi Himpunan Mahasiswa Teknik Informatika (HIMATIKA) Universitas Trilogi dengan standar visual *Awwwards / Developer Portfolio*.
2. **Kiblat Desain (Referensi Wajib)**: 
   Mengacu secara ketat pada estetika [mikkisindhunata.com](https://mikkisindhunata.com/) (*Cinematic Brutalist-Editorial, Dark Obsidian, High-Contrast Typography, Monospaced Technical Precision*).
3. **Hirarki Dokumen Acuan (Golden Source of Truth)**:
   Setiap langkah pengerjaan kode, arsitektur, dan desain **WAJIB** merujuk pada empat dokumen inti di root repositori:
   * 📘 [`PROJECT.md`](./PROJECT.md) — Lingkup fitur, 8 divisi resmi, dan tujuan bisnis ormawa.
   * 🎨 [`DESIGN.md`](./DESIGN.md) — Token warna, formula CSS `clamp()`, aturan border hairline, dan spesifikasi antarmuka.
   * ⚙️ [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Arsitektur Next.js (App Router), Supabase PostgreSQL, RLS security, dan data flow.
   * 📋 [`TASK.md`](./TASK.md) — Urutan tiket kerja fase 0 sampai 8 dan pelacak checklist progres.

---

## 2. Aturan Keamanan & Protokol Database (Supabase Guardrails)

> [!CAUTION]
> **PROTOKOL STANDBY SUPABASE**:  
> Agent **DILARANG KERAS** menjalankan migrasi DDL, eksekusi SQL, manipulasi skema, atau mutasi data ke project remote Supabase **tanpa izin dan konfirmasi eksplisit dari pengguna**. Token yang tersimpan di `mcp_config.json` hanya boleh digunakan setelah pengguna menyatakan perintah eksekusi secara langsung.

1. **Row Level Security (RLS) Wajib Aktif**:
   * Setiap tabel yang dibuat di Supabase (`divisions`, `work_programs`, `finance_categories`, `finance_records`) **wajib** memiliki `enable row level security`.
   * Data kas pada tabel `finance_records` **TIDAK BOLEH** bisa diakses publik (hanya `authenticated` users).
2. **Pengelolaan Kunci Rahasia (Secret Management)**:
   * `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan di Server Actions atau Route Handlers di server. **DILARANG** membocorkannya ke komponen client (`'use client'`) atau variabel berawalan `NEXT_PUBLIC_`.
3. **Autentikasi Aman**:
   * Gunakan pustaka resmi `@supabase/ssr` dengan PKCE flow berbasis HTTP-only cookies. Dilarang menyimpan token sesi login di `localStorage`.

---

## 3. Aturan Desain & Rekayasa Frontend (Anti AI-Slop Enforced)

1. **Larangan Desain & Copywriting Generik (Zero AI-Slop & Humanized Copy)**:
   * ❌ **DILARANG**: Menggunakan warna biru cyan neon (`#00e5ff` / `#38bdf8`) yang membuat web terkesan "AI-slop". Gunakan **HIMATIKA Royal Blue (`#2563eb` / `#1d4ed8` / `#3b82f6`)** sesuai almamater resmi.
   * ❌ **DILARANG**: Mengubah foto dokumentasi kegiatan menjadi hitam-putih (*monochrome/B&W*). Foto kegiatan **WAJIB** tampil berwarna asli (*full color*) beresolusi tinggi dengan kontras tajam.
   * ❌ **DILARANG**: Menggunakan notasi garis miring ganda (`//`) bergaya sci-fi pada copy publik (contoh terlarang: `[01 // DIREKTORI]`, `SHOWCASE // 01`, `ADA PERTANYAAN? // HUBUNGI KAMI`). Gunakan penamaan bersih dan berbobot seperti `NAVIGASI`, `PROGRAM UNGGULAN`, `HUBUNGI KAMI`.
   * ❌ **DILARANG**: Menambahkan teks robotik, status militer, atau koordinat palsu (contoh terlarang: `SYS: ONLINE`, `COORDS: -6.255 // STATUS: DEPLOYED`, `STD: CINEMATIC BRUTALIST`). Area tengah navbar **WAJIB** berupa *Pure Negative Space* (murni kosong dan bersih).
   * ❌ **DILARANG**: Menulis teks dengan gaya birokratis AI-slop atau buzzword korporat kaku (seperti *episentrum*, *adaptif terhadap disrupsi*, *civitas akademika*, *komputasi solutif*, *standar operasional*). Gunakan Bahasa Indonesia yang hangat, membumi, dan berkarakter mahasiswa.
   * ❌ **DILARANG**: Menggunakan istilah "Kabinet" atau "Kabinet Aktif". Gunakan identitas resmi organisasi: **HIMATIKA UNIVERSITAS TRILOGI** atau **HIMATIKA TRILOGI**.
   * ❌ **DILARANG**: Menggunakan card putih rounded pill dengan bayangan buram (*soft drop shadow*) ala Bootstrap generik atau stok foto klise.

2. **Standar Estetika yang Diwajibkan**:
   * ✔️ **Palette**: Dark Obsidian (`#050505`, `#0c0c0e`), hairline border `1px solid rgba(255,255,255,0.08)`, dan aksen **HIMATIKA Royal Blue (`#2563eb`)**.
   * ✔️ **Tipografi**:
     * Judul/Headline: `Anton` (All-caps, masif, tracking ketat).
     * Data/Status/Nomor/Metadata: `JetBrains Mono` (Monospaced, uppercase, presisi, format `01 / 05`).
     * Body Text: `Poppins` (Clean, abu-abu lembut `#a1a1aa`, nyaman dibaca).
   * ✔️ **Program Kolaboratif Lintas Divisi**: Untuk proker yang diadakan pimpinan/himpunan di mana seluruh divisi berkontribusi (seperti T-Camp, Kolaborasi Komunitas), gunakan label tag resmi: `KOLABORASI SEMUA DIVISI` dengan aksen badge biru almamater lembut.
   * ✔️ **Penanganan Aset Berlatar Putih**: Untuk logo atau poster berlatar belakang putih murni (seperti `kolaborasi.png`), gunakan wadah latar putih bersih dengan `object-contain` dan nonaktifkan efek dark vignette agar logo tampil tajam tanpa kusam.

3. **Aturan Struktur Organisasi & Halaman Khusus (`/struktur`)**:
   * Struktur kepengurusan memiliki halaman rute tersendiri yang mandiri di [`/struktur`](file:///C:/Users/Haerul/himatika_web/src/app/struktur/page.tsx) (bukan di dalam `/about`).
   * Menggunakan **Interactive Circuit/Blueprint Diagram** dengan visual bus sirkuit SVG.
   * Foto koordinator divisi muncul secara interaktif melalui efek **3D Photo Flip & Glitch Reveal** saat kursor mengarah ke kartu, sementara kartu tetap stabil (tidak membalikkan teks) dan dapat diklik di mana saja.
   * Rincian tugas pokok & fungsi (Tupoksi) serta susunan staf ditampilkan melalui *slide-over drawer* (`DivisionDrawer.tsx`) saat node organisasi diklik.

4. **Standar Responsivitas & Efisiensi Mobile**:
   * Semua ukuran teks judul wajib menggunakan formula CSS `clamp()` yang ada di [`DESIGN.md`](./DESIGN.md) agar tidak meluap (*overflow*) di layar HP.
   * Navigasi mobile berupa *fullscreen brutalist drawer* dengan teks menu vertikal masif font `Anton` tanpa notasi slash.

5. **Autentikasi Internal (Portal Pengurus)**:
   * Tombol akses internal menggunakan ikon profil **User (`<User />`)** di navbar kanan yang mengarahkan ke `/login` untuk pengurus terotorisasi (Bendahara & Medkraf). Subtitle "Dept. of Informatics" pada brand mark dihilangkan.

---

## 4. Standar Kode & Praktik Rekayasa Perangkat Lunak

1. **Framework & Struktur Next.js**:
   * Menggunakan **Next.js 14/15 App Router** dengan TypeScript ketat (`strict: true`, nol tipe `any`).
   * Utamakan **React Server Components (RSC)** secara default. Gunakan directive `'use client'` hanya pada daun terluar komponen yang benar-benar membutuhkan state browser (`useState`, `useEffect`, GSAP, atau event listener).
2. **Pembersihan Siklus Animasi (GSAP Cleanliness)**:
   * Setiap inisialisasi GSAP di komponen React wajib dibungkus dengan `gsap.context()` dan di-cleanup pada return `useEffect` (`ctx.revert()`) untuk mencegah kebocoran memori (*memory leak*) dan *hydration error*.
3. **Pola Mutasi Data**:
   * Gunakan **Server Actions** (`src/actions/`) untuk operasi mutasi data (login, input kas, filter) dengan validasi skema data Zod sebelum diteruskan ke Supabase.
4. **Integritas Dokumentasi & Pelacakan Tugas**:
   * Setiap kali suatu subtugas di [`TASK.md`](./TASK.md) selesai dikerjakan dan diverifikasi, Agent wajib memperbarui tanda centang `[x]` pada dokumen tersebut.
   * Pertahankan komentar kode penting dan struktur dokumentasi proyek.

---

## 5. Protokol Komunikasi & Sikap Agent

1. **Bahasa Komunikasi**: 
   Berkomunikasi secara profesional, suportif, dan lugas menggunakan **Bahasa Indonesia**.
2. **Transparansi Kerja**: 
   Sebelum mengeksekusi perubahan file besar atau menjalankan instalasi, berikan penjelasan ringkas mengenai apa yang akan diubah dan alasannya.
3. **Verifikasi Hasil Kerja**: 
   Jangan berasumsi kode bekerja sebelum menjalankan verifikasi nyata (mengecek file, menjalankan build/lint, atau memastikan perintah terminal exit dengan code 0).
4. **Peka Konteks Kampus**: 
   Pahami bahwa proyek ini dikelola oleh mahasiswa organisasi. Buat struktur kode yang teratur, bersih, dan mudah dilanjutkan oleh generasi pengurus himpunan berikutnya.
