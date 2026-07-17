import Link from "next/link";
import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps {
  href?:      string;
  onClick?:   () => void;
  variant?:   Variant;
  size?:      Size;
  children:   ReactNode;
  className?: string;
  type?:      "button" | "submit" | "reset";
  /** Icon rendered before the label */
  icon?:      ReactNode;
  /** Shows a spinner and disables interaction */
  loading?:   boolean;
  disabled?:  boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-coral   text-white  hover:bg-coral/85  shadow-md   hover:shadow-elevated",
  secondary: "bg-sage    text-white  hover:bg-sage/85   shadow-md   hover:shadow-elevated",
  outline:   "border-2   border-navy text-navy           hover:bg-navy hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "px-4  py-2   text-xs  rounded-full",
  md: "px-6  py-3   text-sm  rounded-full",
  lg: "px-8  py-4   text-base rounded-full",
};

/**
 * Multi-variant button with icon, loading, and size support.
 * Pass `href` to render as a Next.js `<Link>` instead of `<button>`.
 *
 * @example
 * <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
 *   Enroll Now
 * </Button>
 */
export default function Button({
  href,
  onClick,
  variant  = "primary",
  size     = "md",
  children,
  className = "",
  type      = "button",
  icon,
  loading   = false,
  disabled  = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base =
    "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sage " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const cls = [base, variants[variant], sizes[size], className].join(" ");

  const content = (
    <>
      {loading ? (
        <Loader2 size={size === "sm" ? 12 : size === "lg" ? 18 : 15} className="animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cls}
    >
      {content}
    </button>
  );
}
