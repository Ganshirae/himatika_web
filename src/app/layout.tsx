import type { Metadata } from "next";
import { Anton, JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";

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
  title: "HIMATIKA TRILOGI — Official Portal",
  description: "Official portal of Himpunan Mahasiswa Teknik Informatika Universitas Trilogi.",
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
      <body className="bg-canvas text-main font-sans antialiased selection:bg-accent-cyan/20 selection:text-accent-cyan">
        {children}
      </body>
    </html>
  );
}
