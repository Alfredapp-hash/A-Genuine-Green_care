"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

/** Intrinsic size of hero.mp4 — the coordinate space the overlay maps into. */
const VIDEO_W = 1280;
const VIDEO_H = 720;

/**
 * Where "Care" sits inside the video frame, in video pixels. The clip burns in
 * "Genuine" / "Green"; this fills the gap beneath them to complete the name.
 */
const CARE_CENTER_X = 447;
const CARE_TOP_Y = 317;
const CARE_FONT_RATIO = 0.145; // of rendered video width

/** Pause just before the end so a decoded frame stays on screen. */
const HOLD_BEFORE_END = 0.08;

type CareBox = { left: number; top: number; fontSize: number };

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [care, setCare] = useState<CareBox | null>(null);
  const [popped, setPopped] = useState(false);

  /**
   * The video is object-fit: cover, so its painted box is larger than the
   * stage and offset. Recomputing the mapping keeps "Care" locked to the
   * burned-in text at every viewport size.
   */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;

    const scale = Math.max(width / VIDEO_W, height / VIDEO_H);
    const offsetX = (width - VIDEO_W * scale) / 2;
    const offsetY = (height - VIDEO_H * scale) / 2;

    setCare({
      left: offsetX + CARE_CENTER_X * scale,
      top: offsetY + CARE_TOP_Y * scale,
      fontSize: VIDEO_W * scale * CARE_FONT_RATIO,
    });
  }, []);

  useEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      video.pause();
      setPopped(true);
    };

    if (reduce) {
      // Park on the final frame with the name already complete.
      const settle = () => {
        if (video.duration) video.currentTime = video.duration - HOLD_BEFORE_END;
        finish();
      };
      if (video.readyState >= 1) settle();
      else video.addEventListener("loadedmetadata", settle, { once: true });
      return;
    }

    const onTime = () => {
      if (video.duration && video.currentTime >= video.duration - HOLD_BEFORE_END) finish();
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", finish);
    // Autoplay can be refused; the poster then stands in and we still pop.
    video.play().catch(() => finish());

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", finish);
    };
  }, []);

  return (
    <section className="relative bg-forest-deep text-cream">
      {/* The visual name lives in the video, so the real heading is offscreen
          text — crawlers and screen readers still get the full name. */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      <div
        ref={stageRef}
        className="relative w-full overflow-hidden"
        style={{ height: "min(72svh, 56.25vw)" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero/hero.mp4"
          poster="/hero/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
          aria-label={`${site.name} — animated illustration of the owner mowing an overgrown lawn`}
        />

        {/* Nav sits over the hero on home and the clip ends on bright sky —
            this keeps the cream nav readable against it. */}
        <div className="hero-canopy pointer-events-none absolute inset-x-0 top-0 h-32" aria-hidden />

        {care ? (
          <p
            aria-hidden
            className={`care-pop pointer-events-none absolute ${popped ? "is-in" : ""}`}
            style={{
              left: `${care.left}px`,
              top: `${care.top}px`,
              fontSize: `${care.fontSize}px`,
            }}
          >
            Care
          </p>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:px-6">
        <p className="font-display text-2xl font-semibold sm:text-3xl">{site.tagline}</p>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-cream/80">
          Precision cuts, sharp edges, and honest care — from an owner who shows up.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-6 py-3.5 text-sm font-bold text-forest-deep transition hover:bg-gold-soft"
          >
            Get a Free Quote
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex items-center justify-center rounded-sm border border-cream/35 px-6 py-3.5 text-sm font-semibold text-cream transition hover:border-cream/60 hover:bg-cream/10"
          >
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
