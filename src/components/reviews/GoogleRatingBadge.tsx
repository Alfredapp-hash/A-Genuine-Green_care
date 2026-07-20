import Link from "next/link";
import { googleRating } from "@/data/reviews";
import { site } from "@/data/site";
import { StarRating } from "@/components/reviews/StarRating";

export function GoogleRatingBadge({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-cream/70" : "text-charcoal/65";
  const strong = tone === "dark" ? "text-cream" : "text-ink";

  return (
    <div className="inline-flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className={`font-display text-3xl font-semibold tabular-nums ${strong}`}>
          {googleRating.ratingValue.toFixed(1)}
        </span>
        <div>
          <StarRating value={5} size="sm" />
          <p className={`mt-0.5 text-xs ${muted}`}>
            {googleRating.reviewCount} Google reviews
          </p>
        </div>
      </div>
      <a
        href={site.googleShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          tone === "dark"
            ? "text-sm font-semibold text-gold-soft underline-offset-4 hover:underline"
            : "text-sm font-semibold text-leaf underline-offset-4 hover:underline"
        }
      >
        View on Google
      </a>
      <Link
        href="/reviews"
        className={
          tone === "dark"
            ? "text-sm font-medium text-cream/80 hover:text-cream"
            : "text-sm font-medium text-charcoal/70 hover:text-ink"
        }
      >
        Read featured reviews
      </Link>
    </div>
  );
}
