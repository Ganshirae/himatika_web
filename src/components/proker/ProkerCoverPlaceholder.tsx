import React from "react";
import { ImageOff } from "lucide-react";

interface ProkerCoverPlaceholderProps {
  title: string;
  divisionCode: string;
}

/**
 * Editorial dark placeholder displayed when a work program has no cover poster.
 */
export function ProkerCoverPlaceholder({
  title,
  divisionCode,
}: ProkerCoverPlaceholderProps) {
  return (
    <div className="relative w-full h-full bg-[#09090b] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-2.5 max-w-xs">
        <div className="w-10 h-10 rounded-xs border border-white/10 bg-white/[0.03] flex items-center justify-center text-blue-400/80">
          <ImageOff className="w-4 h-4" />
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          {divisionCode}
        </span>
        <p className="font-display text-lg sm:text-xl uppercase tracking-tight text-zinc-200 line-clamp-2 leading-tight">
          {title}
        </p>
      </div>
    </div>
  );
}
