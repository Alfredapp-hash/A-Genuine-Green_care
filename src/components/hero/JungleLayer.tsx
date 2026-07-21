import {
  LEAF_PATH,
  bladeField,
  frondCluster,
  hangingVines,
  weedStalks,
} from "@/components/hero/grass";

const W = 1200;
const H = 800;

const FAR = ["#123821", "#16452a", "#1a4f30"] as const;
const MID = ["#1d5734", "#22663d", "#2a7346"] as const;
const NEAR = ["#2c7d4b", "#358c55", "#3f9a5f"] as const;
const STEM = ["#3f8f57", "#4a9d63", "#2f7a48"] as const;
const SEED = ["#c9b47a", "#d9c893", "#a8bf8a"] as const;

// Generated once at module scope: the geometry never changes, so there is no
// reason to recompute it per render or per mount.
const farBlades = bladeField({
  seed: 1207,
  count: 62,
  width: W,
  baseY: H,
  minHeight: 420,
  maxHeight: 760,
  minWidth: 9,
  maxWidth: 17,
  lean: 70,
  palette: FAR,
});

const midBlades = bladeField({
  seed: 4409,
  count: 54,
  width: W,
  baseY: H,
  minHeight: 320,
  maxHeight: 580,
  minWidth: 12,
  maxWidth: 22,
  lean: 85,
  palette: MID,
});

const nearBlades = bladeField({
  seed: 8821,
  count: 40,
  width: W,
  baseY: H,
  minHeight: 220,
  maxHeight: 440,
  minWidth: 16,
  maxWidth: 30,
  lean: 100,
  palette: NEAR,
});

const fronds = frondCluster(3312, 11, W, H, MID);
const vines = hangingVines(6604, 7, W, FAR);
const weeds = weedStalks(9137, 16, W, H, STEM, SEED);

/**
 * The overgrown "before" state: a wall of neglected grass, ferns, creepers and
 * seed heads. Purely decorative — the hero heading carries the semantics.
 */
export function JungleLayer() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="jungle-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b2416" />
          <stop offset="45%" stopColor="#12362180" />
          <stop offset="100%" stopColor="#0d2b1a00" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="url(#jungle-air)" />

      {/* Creepers dropping out of the canopy. */}
      <g className="jungle-sway" style={{ animationDuration: "7.5s" }}>
        {vines.map((vine) => (
          <g key={vine.key}>
            <path d={vine.d} fill="none" stroke={vine.stroke} strokeWidth={5} strokeLinecap="round" />
            {vine.leaves.map((leaf, i) => (
              <path
                key={`${vine.key}-l${i}`}
                d={LEAF_PATH}
                fill={vine.stroke}
                transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.scale})`}
              />
            ))}
          </g>
        ))}
      </g>

      <g className="jungle-sway" style={{ animationDuration: "6.2s" }}>
        {farBlades.map((blade) => (
          <path key={blade.key} d={blade.d} fill={blade.fill} />
        ))}
      </g>

      <g className="jungle-sway" style={{ animationDuration: "5.1s", animationDelay: "-1.4s" }}>
        {weeds.map((weed) => (
          <g key={weed.key}>
            <path
              d={`M${weed.x} ${weed.baseY}Q${weed.x + weed.bend * 0.3} ${weed.baseY - weed.height * 0.6},${weed.x + weed.bend} ${weed.baseY - weed.height}`}
              fill="none"
              stroke={weed.stroke}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <circle
              cx={weed.x + weed.bend}
              cy={weed.baseY - weed.height}
              r={weed.headR}
              fill={weed.headFill}
              opacity={0.85}
            />
          </g>
        ))}
      </g>

      <g className="jungle-sway" style={{ animationDuration: "4.6s", animationDelay: "-0.8s" }}>
        {midBlades.map((blade) => (
          <path key={blade.key} d={blade.d} fill={blade.fill} />
        ))}
      </g>

      {/* Ferns sit in front of the mid band for depth. */}
      <g className="jungle-sway" style={{ animationDuration: "5.6s", animationDelay: "-2.1s" }}>
        {fronds.map((frond) => (
          <g key={frond.key} transform={`translate(${frond.x} ${frond.y}) rotate(${frond.rotate})`}>
            <path
              d={`M0 0L${frond.scale} 0`}
              stroke={frond.fill}
              strokeWidth={5}
              strokeLinecap="round"
            />
            {frond.leaves.map((leaf, i) => (
              <path
                key={`${frond.key}-l${i}`}
                d={LEAF_PATH}
                fill={frond.fill}
                transform={`translate(${frond.scale * leaf.at} 0) rotate(${leaf.angle}) scale(${frond.scale * leaf.len} ${frond.scale * leaf.len * 0.42})`}
              />
            ))}
          </g>
        ))}
      </g>

      <g className="jungle-sway" style={{ animationDuration: "3.9s", animationDelay: "-1.1s" }}>
        {nearBlades.map((blade) => (
          <path key={blade.key} d={blade.d} fill={blade.fill} />
        ))}
      </g>
    </svg>
  );
}
