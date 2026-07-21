/**
 * Deterministic geometry helpers for the hero jungle.
 *
 * Every shape is generated from a fixed seed so the server render and the
 * client render produce byte-identical SVG paths (no hydration mismatch).
 */

/** mulberry32 — small, fast, stable across Node and browsers. */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to 2dp so SSR/CSR string output can never drift. */
const r2 = (n: number) => Math.round(n * 100) / 100;

export type Shape = {
  key: string;
  d: string;
  fill: string;
};

export type BladeFieldOptions = {
  seed: number;
  count: number;
  width: number;
  baseY: number;
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  lean: number;
  palette: readonly string[];
};

/**
 * A band of tapered, curved grass blades rooted on `baseY`.
 * Blades overshoot the field edges so a "slice" viewBox never shows a gap.
 */
export function bladeField({
  seed,
  count,
  width,
  baseY,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  lean,
  palette,
}: BladeFieldOptions): Shape[] {
  const rng = createRng(seed);
  const blades: Shape[] = [];

  for (let i = 0; i < count; i += 1) {
    const x = r2(-40 + rng() * (width + 80));
    const h = r2(minHeight + rng() * (maxHeight - minHeight));
    const w = r2(minWidth + rng() * (maxWidth - minWidth));
    const bend = r2((rng() * 2 - 1) * lean);
    const tipX = r2(x + bend);
    const tipY = r2(baseY - h);

    blades.push({
      key: `b${seed}-${i}`,
      fill: palette[Math.floor(rng() * palette.length)],
      d:
        `M${r2(x - w)} ${baseY}` +
        `C${r2(x - w * 0.7)} ${r2(baseY - h * 0.42)},${r2(x + bend * 0.35)} ${r2(baseY - h * 0.74)},${tipX} ${tipY}` +
        `C${r2(x + bend * 0.15)} ${r2(baseY - h * 0.68)},${r2(x + w * 0.85)} ${r2(baseY - h * 0.38)},${r2(x + w)} ${baseY}` +
        `Z`,
    });
  }

  return blades;
}

/** Unit leaf pointing along +x from the origin; scale/rotate into place. */
export const LEAF_PATH =
  "M0 0C0.28 -0.42,0.66 -0.5,1 0C0.66 0.5,0.28 0.42,0 0Z";

export type Frond = {
  key: string;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  fill: string;
  leaves: { angle: number; at: number; len: number }[];
};

/** Fern-like fronds: a stem with leaflets stepping down each side. */
export function frondCluster(
  seed: number,
  count: number,
  width: number,
  baseY: number,
  palette: readonly string[],
): Frond[] {
  const rng = createRng(seed);
  const fronds: Frond[] = [];

  for (let i = 0; i < count; i += 1) {
    const leafCount = 5 + Math.floor(rng() * 4);
    const leaves: Frond["leaves"] = [];

    for (let j = 0; j < leafCount; j += 1) {
      const t = (j + 1) / (leafCount + 1);
      const side = j % 2 === 0 ? -1 : 1;
      leaves.push({
        at: r2(t),
        angle: r2(side * (34 + rng() * 26)),
        len: r2(0.42 - t * 0.2),
      });
    }

    fronds.push({
      key: `f${seed}-${i}`,
      x: r2(-60 + rng() * (width + 120)),
      y: r2(baseY - rng() * 40),
      scale: r2(150 + rng() * 190),
      rotate: r2(-118 + rng() * 56),
      fill: palette[Math.floor(rng() * palette.length)],
      leaves,
    });
  }

  return fronds;
}

export type Vine = {
  key: string;
  d: string;
  stroke: string;
  leaves: { x: number; y: number; rotate: number; scale: number }[];
};

/** Creepers hanging from the canopy, each with a few leaves along its length. */
export function hangingVines(
  seed: number,
  count: number,
  width: number,
  palette: readonly string[],
): Vine[] {
  const rng = createRng(seed);
  const vines: Vine[] = [];

  for (let i = 0; i < count; i += 1) {
    const x = r2((i + 0.5) * (width / count) + (rng() * 2 - 1) * 40);
    const len = r2(150 + rng() * 320);
    const sway = r2((rng() * 2 - 1) * 70);
    const leafCount = 2 + Math.floor(rng() * 3);
    const leaves: Vine["leaves"] = [];

    for (let j = 0; j < leafCount; j += 1) {
      const t = (j + 1) / (leafCount + 1);
      leaves.push({
        x: r2(x + sway * t * t),
        y: r2(len * t),
        rotate: r2((j % 2 === 0 ? 1 : -1) * (25 + rng() * 45)),
        scale: r2(34 + rng() * 26),
      });
    }

    vines.push({
      key: `v${seed}-${i}`,
      stroke: palette[Math.floor(rng() * palette.length)],
      d: `M${x} 0Q${r2(x + sway * 0.35)} ${r2(len * 0.55)},${r2(x + sway)} ${len}`,
      leaves,
    });
  }

  return vines;
}

export type Weed = {
  key: string;
  x: number;
  baseY: number;
  height: number;
  bend: number;
  stroke: string;
  headR: number;
  headFill: string;
};

/** Tall seed-head weeds — the giveaway that a lawn has gone feral. */
export function weedStalks(
  seed: number,
  count: number,
  width: number,
  baseY: number,
  stemPalette: readonly string[],
  headPalette: readonly string[],
): Weed[] {
  const rng = createRng(seed);
  const weeds: Weed[] = [];

  for (let i = 0; i < count; i += 1) {
    weeds.push({
      key: `w${seed}-${i}`,
      x: r2(-30 + rng() * (width + 60)),
      baseY,
      height: r2(300 + rng() * 380),
      bend: r2((rng() * 2 - 1) * 90),
      stroke: stemPalette[Math.floor(rng() * stemPalette.length)],
      headR: r2(7 + rng() * 8),
      headFill: headPalette[Math.floor(rng() * headPalette.length)],
    });
  }

  return weeds;
}
