"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AboutGalleryPhotoJson } from "@/types/database.types";

gsap.registerPlugin(ScrollTrigger);

interface AboutGallerySectionProps {
  photos: AboutGalleryPhotoJson[];
}

function getEditorialSpanClass(index: number, total: number): string {
  const isOrphanLast = index === total - 1 && total % 2 === 1;
  if (isOrphanLast) {
    return "md:col-span-12 h-[240px] sm:h-[340px] lg:h-[400px]";
  }

  const rowIndex = Math.floor(index / 2);
  const posInRow = index % 2;
  const isWide = rowIndex % 2 === 0 ? posInRow === 0 : posInRow === 1;

  return isWide
    ? "md:col-span-7 h-[240px] sm:h-[320px] lg:h-[370px]"
    : "md:col-span-5 h-[240px] sm:h-[320px] lg:h-[370px]";
}

/**
 * Editorial photo gallery on /about combining upward ScrollTrigger curtain reveal (Ide 1)
 * and staggered asymmetric grid timing (Ide 2).
 */
export function AboutGallerySection({ photos }: AboutGallerySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (photos.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-gallery-card]");
      if (cards.length === 0) return;

      const curtains = gsap.utils.toArray<HTMLElement>("[data-gallery-curtain]");
      const images = gsap.utils.toArray<HTMLElement>("[data-gallery-image]");
      const captions = gsap.utils.toArray<HTMLElement>("[data-gallery-meta]");

      gsap.set(cards, { y: 52, opacity: 0 });
      gsap.set(curtains, { scaleY: 1, transformOrigin: "top" });
      gsap.set(images, { scale: 1.09 });
      gsap.set(captions, { y: 12, opacity: 0 });

      ScrollTrigger.batch(cards, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((el, bIdx) => {
            const cardEl = el as HTMLElement;
            const delay = bIdx * 0.12;
            const curtainEl = cardEl.querySelector<HTMLElement>(
              "[data-gallery-curtain]"
            );
            const imgEl = cardEl.querySelector<HTMLElement>(
              "[data-gallery-image]"
            );
            const metaEl = cardEl.querySelector<HTMLElement>(
              "[data-gallery-meta]"
            );

            gsap.to(cardEl, {
              y: 0,
              opacity: 1,
              duration: 0.72,
              delay,
              ease: "power3.out",
              overwrite: "auto",
            });

            if (curtainEl) {
              gsap.to(curtainEl, {
                scaleY: 0,
                duration: 0.82,
                delay: delay + 0.04,
                ease: "power4.out",
                overwrite: "auto",
              });
            }

            if (imgEl) {
              gsap.to(imgEl, {
                scale: 1,
                duration: 0.95,
                delay: delay + 0.04,
                ease: "power3.out",
                overwrite: "auto",
              });
            }

            if (metaEl) {
              gsap.to(metaEl, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                delay: delay + 0.24,
                ease: "power2.out",
                overwrite: "auto",
              });
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [photos.length]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 border-b border-hairline"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-blue-500 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>CERITA KAMI</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl text-main uppercase tracking-tight leading-none">
            KEBERSAMAAN &amp; INOVASI
          </h2>
        </div>

        <p className="font-sans text-xs sm:text-sm text-secondary max-w-md leading-relaxed">
          Dari Ruang Riset tempat kami belajar,hingga bertukar gagasan, dan melangkah bersama.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        {photos.map((photo, idx) => {
          const spanClass = getEditorialSpanClass(idx, photos.length);
          const numberLabel = String(idx + 1).padStart(2, "0");

          return (
            <figure
              key={photo.id}
              data-gallery-card
              className={`group relative overflow-hidden border border-hairline hover:border-blue-500/60 bg-surface transition-colors duration-300 ${spanClass}`}
            >
              {/* Full-color photograph with smooth settle zoom */}
              <div
                data-gallery-image
                className="relative h-full w-full will-change-transform"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption}
                  fill
                  sizes={
                    spanClass.includes("col-span-12")
                      ? "(max-width: 768px) 100vw, 1320px"
                      : spanClass.includes("col-span-7")
                        ? "(max-width: 768px) 100vw, 58vw"
                        : "(max-width: 768px) 100vw, 42vw"
                  }
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Bottom contrast scrim only (keeps photo colors rich & vivid) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
              />

              {/* Editorial Curtain Overlay (sweeps bottom-to-top via GSAP scaleY on scroll) */}
              <div
                data-gallery-curtain
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 bg-canvas origin-top scale-y-0 will-change-transform"
              />

              {/* Metadata & Editorial Caption */}
              <figcaption
                data-gallery-meta
                className="absolute inset-x-0 bottom-0 z-[5] p-4 sm:p-6 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase">
                  <span className="px-2 py-0.5 border border-blue-500/40 bg-canvas/85 text-blue-400">
                    {numberLabel}
                  </span>
                  <span className="px-2 py-0.5 border border-white/15 bg-canvas/80 text-zinc-200 truncate">
                    {photo.tag}
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-zinc-100 leading-relaxed max-w-xl line-clamp-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                  {photo.caption}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
