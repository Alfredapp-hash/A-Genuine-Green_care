"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const easeOut = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const rightVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.25, ease: easeOut } },
};

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-seafoam/25 via-white to-cream min-h-[92vh] flex items-center">

      {/* ── Background ambient blobs ── */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-seafoam/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-sage/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-coral/8 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

        {/* ── LEFT COLUMN ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-7 order-2 lg:order-1"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-seafoam/30 border border-seafoam/60 text-navy text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse-dot flex-shrink-0" />
              Now Enrolling · Georgetown County, SC
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl sm:text-6xl font-black text-navy leading-[1.05] tracking-tight">
              Where Little Ones
              <br />
              Learn &amp;{" "}
              <span
                className="text-sage font-[family-name:var(--font-script)] font-normal"
                style={{ fontSize: "1.05em" }}
              >
                Thrive
              </span>
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p variants={itemVariants} className="text-lg text-navy/65 leading-relaxed max-w-[480px]">
            Saltwater Sprouts cultivates a nurturing, play-based environment where every child grows with confidence — rooted in community right here in Georgetown County.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link
              href="/enrollment"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-coral text-white font-bold text-sm shadow-elevated hover:bg-coral/88 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Enroll Today
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border-2 border-navy text-navy font-bold text-sm hover:bg-navy hover:text-white hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Explore Programs
            </Link>
          </motion.div>

          {/* Trust badge pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            {[
              { icon: "⚓", label: "Georgetown County" },
              { icon: "🐢", label: "Infants – Age 4" },
              { icon: "🌿", label: "Licensed & Insured" },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-seafoam/20 border border-seafoam/50 text-navy/70 text-[11px] font-semibold tracking-wide"
              >
                <span>{b.icon}</span>
                {b.label}
              </span>
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={itemVariants}
            className="flex gap-8 pt-2 border-t border-navy/8"
          >
            {[
              { number: "4", label: "Programs" },
              { number: "Infant–4", label: "Age Range" },
              { number: "100%", label: "Family-Centered" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-navy leading-none">{s.number}</div>
                <div className="text-xs text-navy/50 font-semibold mt-1 tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN — Visual Panel ── */}
        <motion.div
          variants={rightVariants}
          initial="hidden"
          animate="visible"
          className="order-1 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[460px] aspect-square rounded-3xl overflow-visible">
            {/* Panel background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-seafoam/40 via-seafoam/20 to-sage/15 border border-seafoam/30 shadow-elevated" />

            {/* Decorative floating bubbles */}
            <div className="absolute top-6 left-8 w-6 h-6 rounded-full bg-white/70 shadow-sm animate-bob" style={{ animationDelay: "0s" }} />
            <div className="absolute top-14 left-16 w-3 h-3 rounded-full bg-seafoam animate-bob" style={{ animationDelay: "0.6s" }} />
            <div className="absolute top-8 right-10 w-5 h-5 rounded-full bg-navy/15 animate-bob" style={{ animationDelay: "1.1s" }} />
            <div className="absolute top-24 right-6 w-3 h-3 rounded-full bg-coral/50 animate-bob" style={{ animationDelay: "0.3s" }} />
            <div className="absolute bottom-16 left-6 w-8 h-8 rounded-full bg-seafoam/60 animate-bob" style={{ animationDelay: "1.5s" }} />
            <div className="absolute bottom-8 right-14 w-4 h-4 rounded-full bg-white/60 animate-bob" style={{ animationDelay: "0.9s" }} />
            <div className="absolute bottom-24 right-4 w-6 h-6 rounded-full bg-sage/30 animate-bob" style={{ animationDelay: "0.2s" }} />

            {/* Coral organic blob shape */}
            <div
              className="absolute top-10 right-8 w-14 h-14 bg-coral/25 animate-float"
              style={{ borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%", animationDelay: "0.7s" }}
            />

            {/* Sand shell shape */}
            <div
              className="absolute bottom-12 left-10 w-10 h-10 bg-sand/50 animate-float"
              style={{ borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%", animationDelay: "1.3s" }}
            />

            {/* Seafoam diamond */}
            <div
              className="absolute top-1/2 left-4 w-5 h-5 bg-seafoam/70 animate-bob rotate-45"
              style={{ animationDelay: "0.5s" }}
            />

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-110" />
                <Image
                  src="/logo.svg"
                  alt="Saltwater Sprouts Early Learning Center"
                  width={320}
                  height={320}
                  className="relative z-10 drop-shadow-xl animate-bob"
                  priority
                  style={{ animationDelay: "0.15s" }}
                />
              </div>
            </div>

            {/* Bottom caption */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-[10px] font-bold tracking-widest uppercase text-navy/40">
                Early Learning Center · Georgetown County SC
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Multi-layer bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        {/* Layer 1 — seafoam ghost */}
        <svg
          viewBox="0 0 1440 90"
          className="w-full absolute bottom-0"
          style={{ fill: "rgba(184,212,206,0.18)" }}
          preserveAspectRatio="none"
        >
          <path d="M0,45 C320,90 640,0 960,45 C1120,68 1300,55 1440,45 L1440,90 L0,90 Z" />
        </svg>
        {/* Layer 2 — white fill */}
        <svg
          viewBox="0 0 1440 80"
          className="w-full relative"
          style={{ fill: "#ffffff" }}
          preserveAspectRatio="none"
        >
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </div>
  );
}
