"use client";

import Link from "next/link";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { JungleLayer } from "@/components/hero/JungleLayer";
import { MowerAvatar } from "@/components/hero/MowerAvatar";
import { TrimmedLawn } from "@/components/hero/TrimmedLawn";

const MOW_SECONDS = 3.8;
/** The cut runs edge to edge, in % of hero width. */
const FINAL_CUT = 100;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [mowed, setMowed] = useState(false);

  /** Progress of the cut, 0 -> FINAL_CUT, in % of hero width. */
  const cut = useMotionValue(0);
  const uncut = useTransform(cut, (v) => 100 - v);

  const lawnClip = useMotionTemplate`inset(0 ${uncut}% 0 0)`;
  const jungleClip = useMotionTemplate`inset(0 0 0 ${cut}%)`;
  // % of the wrapper's own width, and the wrapper spans the hero — so this
  // tracks the clip edge exactly at every breakpoint.
  const mowerShift = useMotionTemplate`${cut}%`;

  useEffect(() => {
    // Reduced motion jumps to the finished frame, but still goes through
    // animate() — a bare cut.set() does not propagate to the derived clip.
    const controls = animate(cut, FINAL_CUT, {
      duration: reduceMotion ? 0 : MOW_SECONDS,
      ease: [0.36, 0.02, 0.16, 1],
      onComplete: () => setMowed(true),
    });

    return () => controls.stop();
  }, [cut, reduceMotion]);

  // Reduced motion lands on the finished frame without ever animating.
  const settled = mowed || Boolean(reduceMotion);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-forest-deep text-cream">
      <TrimmedLawnLayer clip={lawnClip} />

      <motion.div
        className={`absolute inset-0 z-20 ${settled ? "jungle-settled" : ""}`}
        style={{ clipPath: jungleClip }}
        aria-hidden
      >
        <JungleLayer />
      </motion.div>

      {/* Canopy shade, kept above both states so the hero stays framed. */}
      <div className="hero-canopy pointer-events-none absolute inset-x-0 top-0 z-30 h-52" aria-hidden />

      {/* No padding on the column: the h1 must be exactly hero-wide so its
          clip percentage matches the mower's. */}
      <div className="relative z-40 flex min-h-[100svh] flex-col items-center justify-center pb-[20vh] pt-28 text-center">
        <motion.h1
          style={{ clipPath: lawnClip }}
          className="grass-name w-full px-4 font-display text-[clamp(2.6rem,9.5vw,6.5rem)] font-semibold leading-[0.95] tracking-tight sm:px-6"
        >
          {site.name}
        </motion.h1>

        <motion.div
          className="max-w-2xl px-4 sm:px-6"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduceMotion ? 0 : MOW_SECONDS * 0.72,
            duration: 0.7,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          <p className="mt-6 text-xl font-semibold text-cream drop-shadow-[0_2px_10px_rgba(6,22,13,0.6)] sm:text-2xl md:text-3xl">
            {site.tagline}
          </p>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-cream/85 drop-shadow-[0_2px_8px_rgba(6,22,13,0.6)] sm:text-lg">
            Precision cuts, sharp edges, and honest care — from an owner who shows up.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-6 py-3.5 text-sm font-bold text-forest-deep transition hover:bg-gold-soft"
            >
              Get a Free Quote
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center rounded-sm border border-cream/35 bg-forest-deep/30 px-6 py-3.5 text-sm font-semibold text-cream backdrop-blur transition hover:border-cream/60 hover:bg-forest-deep/50"
            >
              Call {site.phone}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Mower rides the clip edge; the art is anchored by its deck, not its box. */}
      <motion.div className="pointer-events-none absolute inset-0 z-50" style={{ x: mowerShift }} aria-hidden>
        {!settled ? <div className="cut-edge absolute inset-y-0 left-0 w-14 -translate-x-1/2" /> : null}
        <div className="absolute bottom-[4%] left-0 w-[min(48vw,320px)] -translate-x-[91%]">
          <MowerAvatar still={settled} />
        </div>
      </motion.div>
    </section>
  );
}

function TrimmedLawnLayer({ clip }: { clip: MotionValue<string> }) {
  return (
    <motion.div className="absolute inset-0 z-10" style={{ clipPath: clip }} aria-hidden>
      <TrimmedLawn />
    </motion.div>
  );
}
