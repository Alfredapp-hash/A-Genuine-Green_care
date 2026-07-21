"use client";

import { motion } from "framer-motion";

const OUTLINE = "#0d2317";
const POLO = "#2f6b45";
const POLO_DARK = "#215038";
const PANTS = "#c9a878";
const PANTS_DARK = "#ab8b60";
const BOOT = "#6b4a2f";
const BOOT_DARK = "#54391f";
const SKIN = "#c98d63";
const SKIN_DARK = "#ab714b";
const HAIR = "#2b211c";
const DECK = "#2f7a48";
const DECK_LIT = "#48a869";
const METAL = "#3d4a43";
const METAL_LIT = "#59675e";
const TIRE = "#1e2a24";
const HUB = "#93a89b";
const HANDLE = "#2b3a32";

type MowerAvatarProps = {
  /** Freezes the walk cycle, wheel spin and clipping spray. */
  still?: boolean;
};

/**
 * Cartoon owner pushing a walk-behind mower, facing right.
 * Drawn at 300x220 with the ground plane at y=198.
 */
export function MowerAvatar({ still = false }: MowerAvatarProps) {
  return (
    <svg
      viewBox="0 0 300 220"
      className="h-auto w-full overflow-visible"
      aria-hidden
      focusable="false"
    >
      <ellipse cx="162" cy="200" rx="126" ry="9" fill="#06170e" opacity="0.32" />

      <g className={still ? undefined : "mow-bob"}>
        {/* --- far leg and far arm sit behind the torso --- */}
        {/* Parked pose uses SVG's self-contained rotate(a cx cy); the walk cycle
            uses a CSS transform with an explicit origin. Never both at once —
            transform-origin also applies to the attribute and double-offsets it. */}
        <g
          className={still ? undefined : "mow-leg mow-leg-back"}
          style={still ? undefined : { transformBox: "view-box", transformOrigin: "76px 144px" }}
          transform={still ? "rotate(-15 76 144)" : undefined}
        >
          <rect x="68" y="140" width="17" height="50" rx="8" fill={PANTS_DARK} />
          <path d="M62 186h29a6 6 0 0 1 6 6v3a3 3 0 0 1-3 3H62z" fill={BOOT_DARK} />
        </g>

        <path
          d="M88 106q17 4 30 11"
          fill="none"
          stroke={SKIN_DARK}
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* --- torso, leaning into the push --- */}
        <g transform="rotate(8 78 148)">
          <rect x="61" y="94" width="35" height="56" rx="14" fill={POLO} />
          <path d="M61 130q18 7 35 0v14q-18 7-35 0z" fill={POLO_DARK} opacity="0.45" />
          <path d="M71 95h14l-7 11z" fill={POLO_DARK} />
        </g>

        {/* --- near leg --- */}
        <g
          className={still ? undefined : "mow-leg"}
          style={still ? undefined : { transformBox: "view-box", transformOrigin: "80px 144px" }}
          transform={still ? "rotate(14 80 144)" : undefined}
        >
          <rect x="72" y="140" width="18" height="50" rx="9" fill={PANTS} />
          <path d="M66 186h31a6 6 0 0 1 6 6v3a3 3 0 0 1-3 3H66z" fill={BOOT} />
          <rect x="66" y="193" width="34" height="5" rx="2.5" fill={BOOT_DARK} />
        </g>

        {/* --- head --- */}
        <g transform="rotate(6 78 78)">
          <rect x="72" y="86" width="12" height="12" rx="5" fill={SKIN_DARK} />
          <circle cx="78" cy="77" r="14.5" fill={SKIN} />
          <path d="M66 81q3 10 12 10t12-8q-12 4-24-2z" fill={HAIR} opacity="0.4" />
          <path d="M64 74q1-12 10-15t17 4q3 3 3 8-6-4-15-3t-15 6z" fill={HAIR} />
          <circle cx="65" cy="79" r="3.4" fill={SKIN_DARK} />
          <circle cx="87" cy="75" r="2.3" fill={OUTLINE} />
          <path d="M83 69.5q3.5-1.7 6 0" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M93 79q-2.5 1.7-4.5 1" stroke={SKIN_DARK} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M85 84.5q3.5 1 5.5-1.8" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>

        {/* --- near arm reaching the grip --- */}
        <path
          d="M88 103q11 4 19 9"
          fill="none"
          stroke={POLO}
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M101 109q11 3 21 8"
          fill="none"
          stroke={SKIN}
          strokeWidth="9.5"
          strokeLinecap="round"
        />
        <circle cx="124" cy="118" r="5.5" fill={SKIN} />
      </g>

      {/* --- mower --- */}
      <g className={still ? undefined : "mower-vibrate"}>
        <path d="M134 117l52 35" stroke={HANDLE} strokeWidth="7" strokeLinecap="round" />
        <path d="M131 124l50 33" stroke={HANDLE} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <rect x="112" y="108" width="28" height="12" rx="6" fill={HANDLE} />
        <rect x="115" y="110" width="22" height="3" rx="1.5" fill={METAL_LIT} opacity="0.6" />

        <rect x="206" y="120" width="44" height="34" rx="8" fill={METAL} stroke={OUTLINE} strokeWidth="3" />
        <rect x="211" y="113" width="35" height="10" rx="5" fill={METAL_LIT} />
        <circle cx="202" cy="138" r="8.5" fill={METAL_LIT} stroke={OUTLINE} strokeWidth="2.5" />
        <rect x="247" y="133" width="12" height="9" rx="4" fill={METAL_LIT} stroke={OUTLINE} strokeWidth="2" />

        <rect x="180" y="150" width="92" height="33" rx="10" fill={DECK} stroke={OUTLINE} strokeWidth="3" />
        <rect x="186" y="155" width="80" height="6" rx="3" fill={DECK_LIT} opacity="0.6" />
        <path d="M180 162h-9a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h9z" fill={DECK} stroke={OUTLINE} strokeWidth="3" />

        <Wheel cx={198} cy={184} still={still} />
        <Wheel cx={254} cy={184} still={still} />
      </g>

      {!still ? (
        <>
          <Clippings />
          <Exhaust />
        </>
      ) : null}
    </svg>
  );
}

function Wheel({ cx, cy, still }: { cx: number; cy: number; still: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="14.5" fill={TIRE} stroke={OUTLINE} strokeWidth="3" />
      <g
        className={still ? undefined : "mow-wheel"}
        style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle cx={cx} cy={cy} r="6.5" fill={HUB} />
        <path
          d={`M${cx - 6.5} ${cy}h13M${cx} ${cy - 6.5}v13`}
          stroke={TIRE}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

/** Grass thrown out of the side chute, back and to the left. */
function Clippings() {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          cx={168}
          cy={170}
          r={2 + (i % 3)}
          fill={i % 2 === 0 ? "#5fbb79" : "#8fd79c"}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, -26 - i * 7],
            y: [0, -20 - i * 4, 14],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.09,
            ease: "easeOut",
          }}
        />
      ))}
    </g>
  );
}

function Exhaust() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={261}
          cy={137}
          r={4 + i}
          fill="#dfe9e0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.32, 0], x: [0, 14 + i * 5], y: [0, -22 - i * 6], scale: [0.6, 1.5] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.35, ease: "easeOut" }}
        />
      ))}
    </g>
  );
}
