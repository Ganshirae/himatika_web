"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProkerGalleryProps {
  title: string;
  images: string[];
}

export function ProkerGallery({ title, images }: ProkerGalleryProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <>
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          DOKUMENTASI FOTO
        </div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl sm:text-3xl uppercase text-white">
            DOKUMENTASI KEGIATAN
          </h2>
          <span className="font-mono text-xs text-zinc-500">
            {images.length} FOTO
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveModalIndex(idx)}
              className="group relative aspect-video overflow-hidden border border-white/10 hover:border-blue-500/50 rounded bg-black text-left cursor-pointer transition-colors"
            >
              <Image
                src={img}
                alt={`Dokumentasi ${title} ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {activeModalIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveModalIndex(null)}
        >
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="font-mono text-xs text-zinc-400">
              DOKUMENTASI FOTO {activeModalIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveModalIndex(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Tutup foto"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image Container */}
          <div
            className="relative w-full max-w-5xl aspect-video md:aspect-[16/10] overflow-hidden rounded border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeModalIndex]}
              alt={`Dokumentasi ${title} ${activeModalIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Prev / Next Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 border border-white/15 hover:border-blue-500 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 border border-white/15 hover:border-blue-500 text-white rounded-full transition-colors cursor-pointer"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
