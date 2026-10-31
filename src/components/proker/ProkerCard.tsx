import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, CheckCircle2, Clock, Activity } from "lucide-react";
import { ProkerItem } from "@/lib/data/proker";

interface ProkerCardProps {
  proker: ProkerItem;
}

export function ProkerCard({ proker }: ProkerCardProps) {
  const isCollaborative = proker.divisionCode === "KOLABORASI";

  const renderStatusBadge = () => {
    switch (proker.status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Akan Datang
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sedang Berjalan
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-zinc-400" />
            Selesai
          </span>
        );
    }
  };

  return (
    <Link
      href={`/proker/${proker.slug}`}
      className="group relative flex flex-col bg-[#0c0c0e] border border-white/10 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
    >
      {/* Media Cover */}
      <div
        className={`relative aspect-[16/9] w-full overflow-hidden ${
          proker.isWhiteBackground ? "bg-white" : "bg-black"
        }`}
      >
        <Image
          src={proker.coverImage}
          alt={proker.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`transition-transform duration-700 ease-out group-hover:scale-105 ${
            proker.isWhiteBackground
              ? "object-contain p-8 sm:p-12"
              : "object-cover"
          }`}
        />

        {/* Soft dark vignette on non-white images */}
        {!proker.isWhiteBackground && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
        )}

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-xs font-mono font-medium text-white/90 bg-black/70 backdrop-blur-md border border-white/10 rounded">
              {proker.number}
            </span>
            <span
              className={`px-2.5 py-0.5 text-[11px] font-mono tracking-wider uppercase rounded ${
                isCollaborative
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/50 font-medium"
                  : "bg-black/70 text-zinc-300 border border-white/10"
              }`}
            >
              {proker.divisionName}
            </span>
          </div>

          <div>{renderStatusBadge()}</div>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mb-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{proker.executionDate}</span>
            </div>
            {proker.location && (
              <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="truncate">{proker.location}</span>
              </div>
            )}
          </div>

          {/* Title in Anton */}
          <h3 className="font-display text-xl sm:text-2xl text-white tracking-wide group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-3">
            {proker.title}
          </h3>

          {/* Short Desc in Poppins */}
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6">
            {proker.shortDesc}
          </p>
        </div>

        {/* Card Footer Action */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-end mt-auto">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-zinc-300 group-hover:text-blue-400 transition-colors">
            LIHAT DETAIL PROGRAM
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
}
