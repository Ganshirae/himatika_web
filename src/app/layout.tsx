import type { Metadata } from "next";
import { Anton, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/common/SmoothScroller";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { SITE_URL } from "@/lib/site-url";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HIMATIKA UNIVERSITAS TRILOGI — Official Portal",
    template: "%s | HIMATIKA TRILOGI",
  },
  description:
    "Portal resmi Himpunan Mahasiswa Teknik Informatika Universitas Trilogi. Pusat informasi program kerja, arsitektur struktur organisasi, dan transparansi keuangan kas internal.",
  keywords: [
    "HIMATIKA",
    "Universitas Trilogi",
    "Teknik Informatika",
    "Ormawa Informatika",
    "Program Kerja HIMATIKA",
    "Transparansi Kas",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "HIMATIKA Universitas Trilogi",
    title: "HIMATIKA UNIVERSITAS TRILOGI — Official Portal",
    description:
      "Portal resmi Himpunan Mahasiswa Teknik Informatika Universitas Trilogi. Program kerja, struktur kepengurusan, dan transparansi kas.",
    images: [
      {
        url: "/image/tcamp2024.webp",
        width: 1200,
        height: 630,
        alt: "HIMATIKA Universitas Trilogi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HIMATIKA UNIVERSITAS TRILOGI — Official Portal",
    description:
      "Portal resmi Himpunan Mahasiswa Teknik Informatika Universitas Trilogi.",
    images: ["/image/tcamp2024.webp"],
  },
  icons: {
    icon: "/image/logohima.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${anton.variable} ${jetbrainsMono.variable} ${poppins.variable} dark`}
    >
      <body className="bg-canvas text-main font-sans antialiased selection:bg-blue-600/30 selection:text-blue-300 min-h-screen flex flex-col">
        <SmoothScroller>
          <Header />
          <main className="flex-1 pt-16 sm:pt-20 flex flex-col">
            {children}
          </main>
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  );
}
