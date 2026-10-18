"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Layers } from "lucide-react";
import { FLAGSHIP_PROKERS, FeaturedProker } from "@/lib/data/flagship-proker";
import ScrambleText from "@/components/common/ScrambleText";

interface ShowcaseSliderProps {
  prokers?: FeaturedProker[];
}

export default function ShowcaseSlider({ prokers = FLAGSHIP_PROKERS }: ShowcaseSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const total = prokers.length;
  const currentProker = prokers[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch swipe support for smartphone users
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Keyboard navigation when focused or viewing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section
      id="showcase-section"
      className="w-full bg-surface/40 border-b border-hairline py-16 sm:py-24 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Section Header HUD */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-hairline pb-6 mb-10 sm:mb-14 gap-4">
          <div>
            <div className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-1 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>SHOWCASE // 01</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight">
              PROGRAM KERJA UNGGULAN
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted tracking-wider hidden sm:inline">
              PROGRAM: {currentProker.number} OF {String(total).padStart(2, "0")}
            </span>
            <Link
              href="/proker"
              className="font-mono text-xs text-secondary hover:text-blue-400 transition-colors flex items-center gap-1 group"
            >
              <span>SEMUA PROKER</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Split Composition: 55% Preview Media + 45% Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Sisi Kiri: Media Preview (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] border border-hairline bg-canvas overflow-hidden group">
              
              {/* Proker Banner Image (Full Color) */}
              <Image
                key={currentProker.id}
                src={currentProker.coverImage}
                alt={currentProker.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />

              {/* Subtle Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 via-transparent to-transparent pointer-events-none" />

              {/* Status Badges Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1 bg-canvas/80 backdrop-blur-md border border-hairline font-mono text-[10px] tracking-wider uppercase">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentProker.status === "completed"
                        ? "bg-accent-green"
                        : "bg-blue-500 animate-pulse"
                    }`}
                  />
                  <span className="text-main">{currentProker.status}</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-canvas/80 backdrop-blur-md border border-hairline font-mono text-[10px] text-secondary tracking-wider">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>{currentProker.executionDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Technical Details & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Upper Metadata & Title */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tighter">
                  {currentProker.number}{" "}
                  <span className="text-muted text-base font-normal">/ {String(total).padStart(2, "0")}</span>
                </span>
                <span className="font-mono text-[11px] text-muted tracking-widest uppercase border border-hairline px-2 py-1 bg-surface">
                  {currentProker.divisionName}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl text-main uppercase tracking-tight leading-tight">
                {currentProker.title}
              </h3>

              <p className="font-sans text-sm text-secondary leading-relaxed">
                {currentProker.shortDesc}
              </p>
            </div>

            {/* Middle Action */}
            <div className="pt-2">
              <Link
                href="/proker"
                className="inline-flex items-center gap-2 px-5 py-3 border border-hairline hover:border-blue-500 bg-surface hover:bg-surface-hover text-main font-mono text-xs tracking-wider transition-all duration-200 group"
              >
                <span>LIHAT DOKUMENTASI LENGKAP</span>
                <ArrowRight className="w-4 h-4 text-blue-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Bottom Controls: Progress Bar & Magnetic Arrows */}
            <div className="pt-6 border-t border-hairline space-y-4">
              
              {/* Dynamic Linear Progress Bar */}
              <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>

              {/* Prev / Next Directional Buttons */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-muted tracking-wider">
                  NAVIGASI SLIDER
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Proker Sebelumnya"
                    className="w-10 h-10 border border-hairline hover:border-blue-500/60 bg-surface hover:bg-surface-hover text-secondary hover:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Proker Selanjutnya"
                    className="w-10 h-10 border border-hairline hover:border-blue-500/60 bg-surface hover:bg-surface-hover text-secondary hover:text-blue-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
