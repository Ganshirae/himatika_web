"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, ArrowUpRight, X } from "lucide-react";
import { useLenisScroll } from "./SmoothScroller";
import ScrambleText from "./ScrambleText";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { num: "01", label: "BERANDA", href: "/" },
  { num: "02", label: "PROGRAM KERJA", href: "/proker" },
  { num: "03", label: "TENTANG KAMI", href: "/about" },
  { num: "04", label: "PORTAL PENGURUS", href: "/login", isAuth: true },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { stopScroll, startScroll } = useLenisScroll();

  useEffect(() => {
    if (isOpen) {
      stopScroll();
      document.body.style.overflow = "hidden";
    } else {
      startScroll();
      document.body.style.overflow = "";
    }

    return () => {
      startScroll();
      document.body.style.overflow = "";
    };
  }, [isOpen, stopScroll, startScroll]);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-canvas/95 backdrop-blur-2xl text-main p-6 sm:p-8 md:hidden transition-all duration-300"
    >
      {/* Top Bar: Brand & Close Button */}
      <div className="flex items-center justify-between border-b border-hairline pb-5">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/image/logohima.png"
              alt="HIMATIKA Logo"
              fill
              sizes="28px"
              className="object-contain"
              priority
            />
          </div>
            <span className="font-display text-base tracking-tight text-main group-hover:text-blue-400 transition-colors">
              HIMATIKA TRILOGI
            </span>
          </Link>

        <button
          onClick={onClose}
          aria-label="Tutup Menu"
          className="flex items-center gap-2 border border-hairline hover:border-blue-500/50 px-3 py-1.5 bg-surface/80 text-secondary hover:text-blue-400 transition-colors"
        >
          <span className="font-mono text-xs tracking-wider">CLOSE</span>
          <X className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Middle: Giant Brutalist Navigation Items */}
      <nav className="my-auto py-8 flex flex-col gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex items-baseline justify-between py-2 border-b border-hairline/40 transition-colors"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-muted tracking-widest group-hover:text-blue-400 transition-colors">
                  {item.num} //
                </span>
                <span
                  className={`font-display text-3xl sm:text-4xl tracking-tight transition-all duration-200 ${
                    isActive
                      ? "text-blue-400 translate-x-1"
                      : "text-main group-hover:text-blue-400 group-hover:translate-x-1"
                  }`}
                >
                  <ScrambleText text={item.label} />
                </span>
              </div>

              {item.isAuth ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 border border-blue-500/40 bg-blue-500/10 text-blue-400">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-wider">MASUK</span>
                </div>
              ) : (
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-blue-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Bar: System Status & External Links */}
      <div className="border-t border-hairline pt-5 flex flex-col gap-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-secondary">HIMATIKA TRILOGI // 2026-2027</span>
          </div>
          <span>JKT, ID</span>
        </div>

        <div className="flex items-center justify-between pt-1 font-mono text-xs text-secondary">
          <a
            href="https://instagram.com/himatikator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            [INSTAGRAM]
          </a>
          <a
            href="https://github.com/himatikator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            [GITHUB]
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            [LINKEDIN]
          </a>
        </div>
      </div>
    </div>
  );
}
