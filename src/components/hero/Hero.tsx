"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { site } from "@/data/site";
import { MowerAvatar } from "@/components/hero/MowerAvatar";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [animationDone, setAnimationDone] = useState(false);
  const showCopy = Boolean(reduceMotion) || animationDone;

  return (
    <section className="relative min-h-[100svh] overflow-hidden text-cream">
      <div className="hero-atmosphere absolute inset-0" />
      <div className="hero-grass-texture absolute inset-0" />
      <div
        className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-forest-deep via-leaf/40 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-deep/70 to-transparent"
        aria-hidden
      />

      <MowerAvatar onComplete={() => setAnimationDone(true)} />

      {!reduceMotion ? <CopyRevealFallback onReady={() => setAnimationDone(true)} /> : null}

      <div className="relative z-30 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:justify-center md:pb-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={showCopy ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="font-display text-4xl font-semibold tracking-tight text-cream sm:text-5xl md:text-6xl">
            {site.name}
          </p>
          <h1 className="mt-4 max-w-[18ch] text-2xl font-semibold leading-snug text-cream sm:text-3xl md:text-4xl">
            {site.tagline}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            Precision cuts, sharp edges, and honest care — from an owner who shows up.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-6 py-3.5 text-sm font-bold text-forest-deep transition hover:bg-gold-soft"
            >
              Get a Free Quote
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center rounded-sm border border-cream/35 bg-cream/5 px-6 py-3.5 text-sm font-semibold text-cream backdrop-blur transition hover:border-cream/60 hover:bg-cream/10"
            >
              Call {site.phone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CopyRevealFallback({ onReady }: { onReady: () => void }) {
  return (
    <motion.div
      aria-hidden
      className="hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.1, duration: 0.01 }}
      onAnimationComplete={onReady}
    />
  );
}
