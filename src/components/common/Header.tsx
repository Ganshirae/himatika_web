"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import ScrambleText, { ScrambleTextHandle } from "./ScrambleText";
import MobileDrawer from "./MobileDrawer";

interface NavLinkItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "BERANDA", href: "/" },
  { label: "PROKER", href: "/proker" },
  { label: "STRUKTUR", href: "/struktur" },
  { label: "TENTANG", href: "/about" },
  { label: "KONTAK", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scrambleRef = React.useRef<ScrambleTextHandle>(null);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-hairline transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Sisi Kiri: Branding & Logo dengan Efek Animasi Scramble Decoding */}
          <Link
            href="/"
            onMouseEnter={() => scrambleRef.current?.scramble()}
            className="flex items-center gap-3.5 group select-none py-1"
          >
            <div className="relative w-8 h-8 shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Image
                src="/image/logohima.png"
                alt="Logo HIMATIKA"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-base sm:text-lg tracking-tight text-main group-hover:text-blue-400 transition-colors">
              <ScrambleText ref={scrambleRef} text="HIMATIKA TRILOGI" />
            </span>
          </Link>

          {/* Sisi Tengah: Pure Negative Space (Murni Kosong & Bersih) */}

          {/* Sisi Kanan: Menu Navigasi Desktop & Tombol User Profile Internal */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <nav className="flex items-center gap-6 lg:gap-8 font-mono text-xs">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 tracking-wider uppercase transition-colors duration-200 group ${
                      isActive
                        ? "text-blue-400 font-semibold"
                        : "text-secondary hover:text-main"
                    }`}
                  >
                    <ScrambleText text={link.label} />
                    
                    {/* Active indicator underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-blue-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Tombol Akses Pengurus (Bentuk Orang/User Icon) */}
            <Link
              href="/login"
              title="Portal Pengurus (Bendahara, Media, & BPH)"
              aria-label="Portal Pengurus"
              className="group flex items-center justify-center w-8 h-8 border border-hairline hover:border-blue-500/60 bg-surface/50 hover:bg-surface transition-all duration-200"
            >
              <User className="w-3.5 h-3.5 text-secondary group-hover:text-blue-400 transition-colors" />
            </Link>
          </div>

          {/* Sisi Kanan Mobile: Hamburger Button & Quick User Icon */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              aria-label="Portal Pengurus"
              className="p-2 border border-hairline bg-surface/80 text-secondary hover:text-blue-400 transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Buka Menu Navigasi"
              aria-expanded={isDrawerOpen}
              className="group flex items-center gap-2.5 p-2 border border-hairline hover:border-blue-500/40 bg-surface/80 transition-colors"
            >
              <span className="font-mono text-[10px] tracking-wider text-muted group-hover:text-main">
                MENU
              </span>
              <div className="flex flex-col justify-center gap-1.5 w-5 h-4">
                <span className="block h-[1.5px] w-full bg-main group-hover:bg-blue-400 transition-colors" />
                <span className="block h-[1.5px] w-3/4 ml-auto bg-main group-hover:bg-blue-400 transition-colors" />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Fullscreen Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
