"use client";

import React from "react";

interface MetricItem {
  value: string;
  label: string;
  code: string;
  desc: string;
}

const METRICS: MetricItem[] = [
  {
    value: "2015",
    label: "TAHUN BERDIRI",
    code: "METRIC_01",
    desc: "Lebih dari satu dekade dedikasi kemahasiswaan Teknik Informatika Universitas Trilogi.",
  },
  {
    value: "08",
    label: "DIVISI RESMI",
    code: "METRIC_02",
    desc: "Unit kerja terkoordinasi (BPH, BPSDM, Humas, Riset, PMB, Sarlog, dan Medkraf).",
  },
  {
    value: "24+",
    label: "PROGRAM KERJA",
    code: "METRIC_03",
    desc: "Inisiatif berkala meliputi workshop, riset, kompetisi IT, dan pengabdian masyarakat.",
  },
  {
    value: "500+",
    label: "JARINGAN KADER",
    code: "METRIC_04",
    desc: "Kader mahasiswa aktif serta jejaring alumni di industri teknologi nasional.",
  },
];

export default function MetricsSection() {
  return (
    <section className="w-full bg-canvas border-b border-hairline py-16 sm:py-24 relative">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* Minimalist 4-Column Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {METRICS.map((item) => (
            <div key={item.code} className="space-y-3">
              <div className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-main">
                {item.value}
              </div>
              <div className="pt-3 border-t border-hairline/80 space-y-1">
                <div className="font-mono text-xs text-secondary font-semibold tracking-wider uppercase">
                  {item.label}
                </div>
                <p className="font-sans text-xs text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
