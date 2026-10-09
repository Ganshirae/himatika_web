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

## 3. Aturan Desain & Rekayasa Frontend (Anti AI-Slop)

1. **Larangan Desain Generik (Zero AI-Slop)**:
   * ❌ **DILARANG**: Menggunakan card putih rounded pill dengan bayangan buram (*soft drop shadow*) ala Bootstrap generik.
   * ❌ **DILARANG**: Memasang ilustrasi kartun vektor datar atau stok foto laptop di meja yang klise.
   * ❌ **DILARANG**: Menggunakan animasi berlebihan yang membuat lag di perangkat ponsel.
2. **Standar Estetika yang Diwajibkan**:
   * ✔️ **Palette**: Dark Obsidian (`#050505`, `#0c0c0e`), hairline border `1px solid rgba(255,255,255,0.08)`, dan aksen *Electric Cyan* (`#00e5ff`) serta *HIMATIKA Blue* (`#0066ff`).
   * ✔️ **Tipografi**:
     * Judul/Headline: `Anton SC` (All-caps, masif, tracking ketat).
     * Data/Status/Nomor/Metadata: `JetBrains Mono` (Monospaced, uppercase, presisi).
     * Body Text: `Poppins` (Clean, abu-abu lembut `#a1a1aa`, nyaman dibaca).
3. **Aturan Struktur Organisasi (About Us)**:
   * Diagram kepengurusan **WAJIB** berupa **Interactive Blueprint / Node Tree Diagram** (alur jalur sirkuit/Git branch).
   * **DILARANG** menampilkan deretan foto profil individu pengurus konvensional. Rincian nama pengurus ditampilkan melalui *slide-over drawer* saat node divisi diklik.
4. **Standar Responsivitas & Efisiensi Mobile**:
   * Semua ukuran teks judul wajib menggunakan formula CSS `clamp()` yang ada di [`DESIGN.md`](./DESIGN.md) agar tidak meluap (*overflow*) di layar HP.
   * Video hero background wajib menyertakan atribut: `muted autoplay loop playsinline` dengan ukuran terkompresi < 3.5MB dan poster fallback.
   * Navigasi mobile wajib berupa *fullscreen brutalist drawer* dengan teks menu vertikal masif.

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
