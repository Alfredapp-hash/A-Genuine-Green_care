interface WaveDividerProps {
  /** Color of the wave fill — the "arriving" section's background color */
  fill?: string;
  className?: string;
  /** Flip vertically so the wave points up instead of down */
  flip?: boolean;
  /** Height of the SVG element in pixels (default 80) */
  height?: number;
}

/**
 * Multi-layer wave divider for visually rich section transitions.
 * The three stacked paths create a depth illusion using progressively
 * stronger opacity of the fill color.
 *
 * Usage:
 *   <WaveDivider fill="#F8F5F0" />           ← waves into cream section
 *   <WaveDivider fill="#1B3A5C" flip />      ← inverted wave into navy
 */
export default function WaveDivider({
  fill = "#ffffff",
  className = "",
  flip = false,
  height = 80,
}: WaveDividerProps) {
  const transform = flip ? "scale(1,-1)" : undefined;

  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}
      style={{ height, transform }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Back layer — widest, lowest opacity */}
        <path
          d="M0,40 C180,70 360,10 540,40 C720,70 900,10 1080,40 C1260,70 1380,30 1440,40 L1440,80 L0,80 Z"
          fill={fill}
          fillOpacity="0.35"
        />
        {/* Middle layer — medium frequency, medium opacity */}
        <path
          d="M0,50 C200,20 400,65 600,45 C800,25 1000,60 1200,42 C1320,32 1390,52 1440,50 L1440,80 L0,80 Z"
          fill={fill}
          fillOpacity="0.6"
        />
        {/* Front layer — full opacity, tightest wave */}
        <path
          d="M0,60 C120,45 280,75 480,58 C680,41 840,72 1040,56 C1180,46 1340,65 1440,60 L1440,80 L0,80 Z"
          fill={fill}
          fillOpacity="1"
        />
      </svg>
    </div>
  );
}
