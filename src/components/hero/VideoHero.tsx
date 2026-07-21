"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

/**
 * "Care" is drawn in the video's own coordinate space (1280x720) and the SVG
 * uses the same slice/cover rule as the <video>, so the browser scales and
 * crops both identically. No JS measurement, no resize handler — alignment
 * holds at any viewport size and any browser zoom level.
 */
const CARE_X = 447;
const CARE_BASELINE = 462;
const CARE_SIZE = 186;

/** Extruded side of the letters, drawn as offset copies under the face. */
const EXTRUDE = [
  { dy: 3, fill: "#2c6e1e" },
  { dy: 5, fill: "#2c6e1e" },
  { dy: 7, fill: "#1e4f13" },
  { dy: 9, fill: "#1e4f13" },
];

/** Pop while the clip is still on its static tail so it never feels late. */
const POP_LEAD = 0.5;

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const pop = () => setPopped(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const settle = () => {
        if (video.duration) video.currentTime = video.duration - 0.05;
        pop();
      };
      if (video.readyState >= 1) settle();
      else video.addEventListener("loadedmetadata", settle, { once: true });
      return;
    }

    // The clip is left to finish on its own — a paused-near-the-end video can
    // overshoot (timeupdate only fires ~4x/sec) and HTML5 video holds its last
    // frame after "ended" anyway.
    const onTime = () => {
      if (video.duration && video.currentTime >= video.duration - POP_LEAD) pop();
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", pop);
    video.play().catch(pop); // autoplay refused -> poster stands in, still pop

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", pop);
    };
  }, []);

  return (
    <section className="relative bg-forest-deep text-cream">
      {/* The visual name lives in the video, so the real heading is offscreen
          text — crawlers and screen readers still get the full name. */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      {/* Nav is absolutely positioned over the hero on home. The clip burns its
          own wordmark into the top of the frame, so the stage is pushed below
          the nav instead of under it — otherwise the two collide, badly on
          mobile where the stage is only ~220px tall. */}
      <div className="h-16 sm:h-[76px]" aria-hidden />

      {/* Exactly 16:9 — the clip's own ratio. Any other stage shape would make
          object-fit: cover crop the frame (a height cap here was cutting ~80px
          off the top and bottom on desktop and reading as a zoom-in). */}
      <div className="relative aspect-video w-full overflow-hidden">
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

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1280 720"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          focusable="false"
        >
          <defs>
            <linearGradient id="care-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="8%" stopColor="#b8e35c" />
              <stop offset="52%" stopColor="#5cb832" />
              <stop offset="94%" stopColor="#3d8f1f" />
            </linearGradient>
            <filter id="care-shadow" x="-25%" y="-25%" width="150%" height="170%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#14280c" floodOpacity="0.5" />
            </filter>
          </defs>

          <g className={`care-svg ${popped ? "is-in" : ""}`} filter="url(#care-shadow)">
            {EXTRUDE.map((layer) => (
              <text
                key={layer.dy}
                x={CARE_X}
                y={CARE_BASELINE + layer.dy}
                textAnchor="middle"
                fontSize={CARE_SIZE}
                fill={layer.fill}
              >
                Care
              </text>
            ))}
            <text
              x={CARE_X}
              y={CARE_BASELINE}
              textAnchor="middle"
              fontSize={CARE_SIZE}
              fill="url(#care-face)"
            >
              Care
            </text>
          </g>
        </svg>

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
