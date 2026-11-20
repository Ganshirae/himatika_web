"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { useLenisScroll } from "@/components/common/SmoothScroller";

// Authentic HIMATIKA Activity Photos (Full Color Slideshow)
const HERO_SLIDES = [
  {
    image: "/image/tcamp2024.webp",
    title: "T-CAMP SOLIDARITAS",
    category: "BPSDM",
  },
  {
    image: "/image/Company Visit MNC.webp",
    title: "COMPANY VISIT MNC",
    category: "HUMAS",
  },
  {
    image: "/image/t-expo.webp",
    title: "TRILOGI IT EXPO",
    category: "PMB",
  },
  {
    image: "/image/workshop.webp",
    title: "TECH WORKSHOP",
    category: "RISET",
  },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const title3Ref = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const bottomHudRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLenisScroll();

  // Full-color Background Slideshow State (render only active + outgoing slide for fast LCP)
  const [{ activeSlide, prevSlide }, setSlideState] = useState<{
    activeSlide: number;
    prevSlide: number | null;
  }>({ activeSlide: 0, prevSlide: null });

  const goToSlide = useCallback((nextIdx: number) => {
    setSlideState((prev) =>
      prev.activeSlide === nextIdx
        ? prev
        : { activeSlide: nextIdx, prevSlide: prev.activeSlide }
    );
  }, []);

  const nextSlide = useCallback(() => {
    setSlideState((prev) => ({
      activeSlide: (prev.activeSlide + 1) % HERO_SLIDES.length,
      prevSlide: prev.activeSlide,
    }));
  }, []);

  // Auto-advance slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Entrance Reveal Animation (calibrated <= 0.8s and reduced-motion aware)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        [title1Ref.current, title2Ref.current, title3Ref.current],
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          delay: 0.05,
        }
      )
        .fromTo(
          subtextRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.4"
        )
        .fromTo(
          bottomHudRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    scrollTo("#showcase-section", { duration: 0.8 });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden border-b border-hairline bg-canvas select-none"
    >
      {/* 1. Cinematic Background: Authentic FULL-COLOR Photo Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeSlide;
          const isPrevious = idx === prevSlide;
          if (!isActive && !isPrevious) return null;

          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-[1]" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "auto"}
                className={`object-cover object-center brightness-[0.38] contrast-[1.05] saturate-[1.1] transition-transform duration-[6500ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Smooth Vignette Overlay to maintain contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(5, 5, 5, 0.35) 0%, rgba(5, 5, 5, 0.75) 65%, #050505 100%)",
          }}
        />

        {/* Subtle Film Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 2. Top Minimalist HUD */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pt-8 flex items-center justify-between font-mono text-[11px]">
        <div className="flex items-center gap-2 text-zinc-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
          <span className="tracking-widest uppercase font-medium">
            HIMATIKA UNIVERSITAS TRILOGI
          </span>
        </div>

        {/* Slideshow Indicator Dots */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-mono text-[10px] text-zinc-300 tracking-wider hidden sm:inline drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            {HERO_SLIDES[activeSlide].title}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1 transition-all ${
                  i === activeSlide
                    ? "w-5 bg-blue-500"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Center Typography Lockup (Spacious & Minimalist) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-12 my-auto">
        <div className="space-y-2">
          {/* Overline */}
          <div ref={title1Ref} className="overflow-hidden">
            <p className="font-mono text-xs sm:text-sm text-blue-400 tracking-[0.25em] uppercase font-medium">
              HIMPUNAN MAHASISWA
            </p>
          </div>

          {/* Headline White */}
          <div ref={title2Ref} className="overflow-hidden">
            <h1 className="font-display text-[clamp(2.75rem,8.5vw,8.5rem)] text-main uppercase leading-[0.88] tracking-tight">
              TEKNIK INFORMATIKA
            </h1>
          </div>

          {/* Sub-Headline: Deep Royal Blue matching HIMATIKA Logo */}
          <div ref={title3Ref} className="overflow-hidden">
            <h2 className="font-display text-[clamp(2rem,6vw,5.5rem)] text-[#2563eb] drop-shadow-[0_0_35px_rgba(37,99,235,0.3)] uppercase leading-[0.9] tracking-tight">
              UNIVERSITAS TRILOGI
            </h2>
          </div>
        </div>

        {/* Minimalist Narrative & Actions */}
        <div
          ref={subtextRef}
          className="mt-8 pt-8 border-t border-hairline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <p className="font-sans text-sm sm:text-base text-secondary max-w-lg leading-relaxed">
            Ruang belajar, berkarya, dan berkembang bersama bagi mahasiswa Teknik Informatika Universitas Trilogi.
          </p>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <Link
              href="/proker"
              className="flex items-center gap-2 px-5 py-3 border border-main bg-main text-canvas font-semibold hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors group"
            >
              <span>PROGRAM KERJA</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/about"
              className="px-5 py-3 border border-hairline hover:border-blue-500/50 bg-surface/40 text-secondary hover:text-main transition-colors"
            >
              <span>TENTANG KAMI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Minimalist Scroll Cue */}
      <div
        ref={bottomHudRef}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 pb-8 flex items-center justify-between font-mono text-xs text-muted"
      >
        <button
          onClick={handleScrollDown}
          className="flex items-center gap-2.5 text-secondary hover:text-blue-400 transition-colors cursor-pointer group"
          aria-label="Scroll ke seksi Program Kerja"
        >
          <ArrowDown className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
          <span className="text-[11px] tracking-wider uppercase group-hover:text-blue-400">
            EKSPLORASI
          </span>
        </button>

        <span className="text-[11px] text-zinc-300/90 tracking-wider drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          JAKARTA SELATAN
        </span>
      </div>
    </section>
  );
}
