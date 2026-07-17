import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds a smooth lift + shadow transition on hover */
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Clean surface card with navy-tinted shadow and optional hover lift.
 *
 * @example
 * <Card hover onClick={handleClick}>
 *   <p>Program details...</p>
 * </Card>
 */
export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  const hoverStyles = hover
    ? "hover:shadow-elevated hover:-translate-y-1 cursor-pointer"
    : "";

  const Element = onClick ? "button" : "div";

  return (
    <Element
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-navy/[0.08] shadow-card
        transition-all duration-300 ease-out
        ${hoverStyles}
        ${className}
      `.trim()}
      {...(Element === "button" ? { type: "button" } : {})}
    >
      {children}
    </Element>
  );
}
