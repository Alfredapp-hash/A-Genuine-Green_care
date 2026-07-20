import { Star } from "lucide-react";

export function StarRating({
  value = 5,
  size = "md",
  className = "",
}: {
  value?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const px = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${px} ${i < value ? "fill-gold text-gold" : "fill-transparent text-gold/40"}`}
        />
      ))}
    </div>
  );
}
