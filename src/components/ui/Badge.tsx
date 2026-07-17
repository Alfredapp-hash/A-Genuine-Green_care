import { type ReactNode } from "react";

type BadgeVariant = "sage" | "coral" | "navy" | "seafoam" | "sand" | "white";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  /** Renders an animated pulsing dot before the label — ideal for "Now Enrolling" etc. */
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  sage:    "bg-sage/15    text-sage    border border-sage/25",
  coral:   "bg-coral/15   text-coral   border border-coral/25",
  navy:    "bg-navy/10    text-navy    border border-navy/20",
  seafoam: "bg-seafoam/40 text-navy    border border-seafoam/60",
  sand:    "bg-sand/30    text-navy    border border-sand/50",
  white:   "bg-white      text-navy    border border-navy/12 shadow-card",
};

const sizeStyles: Record<"sm" | "md", string> = {
  sm: "px-2.5 py-0.5 text-[11px] font-semibold gap-1.5",
  md: "px-3.5  py-1   text-xs    font-bold   gap-2",
};

/**
 * Pill badge for labeling programs, statuses, and tags.
 *
 * @example
 * <Badge variant="sage" dot>Now Enrolling</Badge>
 * <Badge variant="coral" size="sm">Ages 0–1</Badge>
 */
export default function Badge({
  children,
  variant = "sage",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full leading-none tracking-wide
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
    >
      {dot && (
        <span
          className="relative flex shrink-0"
          style={{ width: size === "sm" ? 6 : 8, height: size === "sm" ? 6 : 8 }}
          aria-hidden="true"
        >
          {/* Ping ripple */}
          <span className="absolute inset-0 rounded-full bg-sage opacity-75 animate-ping" />
          {/* Solid dot */}
          <span className="relative rounded-full bg-sage w-full h-full" />
        </span>
      )}
      {children}
    </span>
  );
}
