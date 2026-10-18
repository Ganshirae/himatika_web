"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle2, ArrowUpRight, Clock } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulasi transmisi pesan ke pengurus
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitted(false);
  };

  return (
    <section id="kontak" className="relative w-full py-20 sm:py-28 border-t border-hairline bg-canvas">
      {/* Decorative Technical Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 relative z-10">
        
        {/* Section Header */}
        <div className="pb-12 border-b border-hairline">
          <div className="flex items-center gap-2 font-mono text-xs text-blue-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>ADA PERTANYAAN?</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-main uppercase tracking-tight leading-none">
            HUBUNGI <span className="text-blue-600">KAMI</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted max-w-2xl font-sans leading-relaxed">
            Punya pertanyaan seputar HIMATIKA, mau ngajak kolaborasi acara, sponsorship, atau sekadar kenalan? Jangan ragu buat hubungi kami lewat kontak di bawah atau langsung kirim pesan ya!
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-12">
          
          {/* Kolom Kiri: Rincian Kontak (5 Kolom) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="font-mono text-xs text-muted uppercase tracking-wider pb-2 border-b border-hairline flex items-center justify-between">
              <span>INFO KONTAK</span>
              <span className="text-blue-400">SEKRETARIAT</span>
            </div>

            {/* Kartu 1: Alamat Kampus */}
            <div className="p-5 bg-surface/50 border border-hairline hover:border-blue-600/40 transition-colors rounded-xs group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="font-mono text-[11px] text-muted block uppercase tracking-wider">
                    LOKASI SEKRETARIAT
                  </span>
                  <h3 className="font-display text-lg text-main uppercase tracking-tight">
                    UNIVERSITAS TRILOGI
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    Jl. TMP. Kalibata No.1, RT.4/RW.04, Duren Tiga, Kec. Pancoran, Kota Jakarta Selatan, DKI Jakarta 12760.
                  </p>
                  <a
                    href="https://maps.google.com/?q=Universitas+Trilogi+Jakarta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-400 hover:text-blue-300 pt-2 transition-colors"
                  >
                    <span>Lihat di Google Maps</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Kartu 2: Telepon Kampus */}
            <div className="p-5 bg-surface/50 border border-hairline hover:border-blue-600/40 transition-colors rounded-xs group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="font-mono text-[11px] text-muted block uppercase tracking-wider">
                    TELEPON KAMPUS
                  </span>
                  <h3 className="font-display text-lg text-main uppercase tracking-tight">
                    (021) 7980011
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans">
                    Kampus Universitas Trilogi (ext. Prodi Teknik Informatika / HIMATIKA).
                  </p>
                  <a
                    href="tel:0217980011"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-400 hover:text-blue-300 pt-2 transition-colors"
                  >
                    <span>Telepon Sekarang</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Kartu 3: Email */}
            <div className="p-5 bg-surface/50 border border-hairline hover:border-blue-600/40 transition-colors rounded-xs group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="font-mono text-[11px] text-muted block uppercase tracking-wider">
                    EMAIL RESMI
                  </span>
                  <h3 className="font-display text-lg text-main uppercase tracking-tight break-all">
                    himatika@trilogi.ac.id
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans">
                    Bisa kirim email untuk kerja sama, sponsorship, atau tanya seputar kegiatan.
                  </p>
                  <a
                    href="mailto:himatika@trilogi.ac.id"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-400 hover:text-blue-300 pt-2 transition-colors"
                  >
                    <span>Kirim Email Langsung</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Status Jam Kerja */}
            <div className="p-4 bg-surface/30 border border-hairline rounded-xs flex items-center gap-3 font-mono text-xs text-muted">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Biasanya kami aktif membalas di hari kerja (Senin — Jumat, 09.00 — 17.00 WIB).</span>
            </div>
          </div>

          {/* Kolom Kanan: Formulir Kirim Pesan (7 Kolom) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 bg-surface/60 border border-hairline rounded-xs relative">
              <div className="font-mono text-xs text-muted uppercase tracking-wider pb-4 border-b border-hairline flex items-center justify-between mb-6">
                <span>KIRIM PESAN</span>
              </div>

              {isSubmitted ? (
                /* Tampilan Notifikasi Berhasil Terkirim */
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-main uppercase tracking-tight">
                    PESAN BERHASIL TERKIRIM!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-md mx-auto leading-relaxed">
                    Makasih banyak, <strong>{formData.name}</strong>! Pesanmu sudah kami terima. Pengurus bakal segera hubungi kamu balik lewat email <em>{formData.email}</em> ya.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-surface hover:bg-surface/80 border border-hairline hover:border-white/20 text-muted hover:text-white font-mono text-xs transition-colors rounded-xs uppercase cursor-pointer"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Input Pesan */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Input Nama */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <label htmlFor="contact-name" className="text-muted block">
                        NAMA KAMU <span className="text-blue-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Tulis nama kamu atau instansi..."
                        className="w-full px-4 py-3 bg-canvas/80 border border-hairline text-main placeholder:text-muted/40 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xs transition-colors font-sans text-sm"
                      />
                    </div>

                    {/* Input Email */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <label htmlFor="contact-email" className="text-muted block">
                        EMAIL KAMU <span className="text-blue-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 bg-canvas/80 border border-hairline text-main placeholder:text-muted/40 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xs transition-colors font-sans text-sm"
                      />
                    </div>
                  </div>

                  {/* Input Subjek */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <label htmlFor="contact-subject" className="text-muted block">
                      SUBJEK / TOPIK <span className="text-blue-500">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Contoh: Tanya Kegiatan, Ajak Kolaborasi, Sponsorship..."
                      className="w-full px-4 py-3 bg-canvas/80 border border-hairline text-main placeholder:text-muted/40 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xs transition-colors font-sans text-sm"
                    />
                  </div>

                  {/* Input Pesan */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <label htmlFor="contact-message" className="text-muted block">
                      PESAN KAMU <span className="text-blue-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tulis apa yang pengen kamu sampaikan atau tanyakan di sini..."
                      className="w-full px-4 py-3 bg-canvas/80 border border-hairline text-main placeholder:text-muted/40 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xs transition-colors resize-none font-sans text-sm"
                    />
                  </div>

                  {/* Tombol Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white font-mono text-xs font-semibold tracking-wider transition-all uppercase rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-900/20"
                    >
                      {isSubmitting ? (
                        <span>Sedang mengirim pesan...</span>
                      ) : (
                        <>
                          <span>Kirim Pesan</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="font-mono text-[11px] text-muted text-center pt-1">
                    Pesan kamu bakal langsung terkirim ke email resmi pengurus himatika@trilogi.ac.id.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
