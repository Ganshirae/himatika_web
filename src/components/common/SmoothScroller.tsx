"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

interface LenisContextType {
  stopScroll: () => void;
  startScroll: () => void;
  scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void;
}

const LenisContext = createContext<LenisContextType>({
  stopScroll: () => {},
  startScroll: () => {},
  scrollTo: () => {},
});

export const useLenisScroll = () => useContext(LenisContext);

/**
 * Pause Lenis smooth scrolling and lock background body scroll while a modal or drawer is open.
 */
export function useLockBodyScroll(isLocked: boolean) {
  const { stopScroll, startScroll } = useLenisScroll();

  useEffect(() => {
    if (!isLocked) return;

    stopScroll();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      startScroll();
    };
  }, [isLocked, stopScroll, startScroll]);
}

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only initialize smooth scroll on client side
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      allowNestedScroll: true,
      prevent: (node) =>
        node.hasAttribute("data-lenis-prevent") ||
        node.getAttribute("role") === "dialog" ||
        node.tagName === "SELECT" ||
        node.tagName === "OPTION" ||
        node.tagName === "TEXTAREA",
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top immediately on route changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const stopScroll = () => {
    lenisRef.current?.stop();
  };

  const startScroll = () => {
    lenisRef.current?.start();
  };

  const scrollTo = (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return (
    <LenisContext.Provider
      value={{
        stopScroll,
        startScroll,
        scrollTo,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
