import type { GoogleReview } from "@/data/reviews";
import { StarRating } from "@/components/reviews/StarRating";

function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="flex h-full flex-col border-t border-forest/15 pt-6">
      <div className="flex items-center justify-between gap-3">
        <StarRating value={review.rating} />
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-leaf/80">
          Google
        </span>
      </div>
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-charcoal/85">
        “{review.text}”
      </blockquote>
      <footer className="mt-5">
        <p className="text-sm font-semibold text-ink">{review.author}</p>
        <p className="mt-1 text-xs text-charcoal/55">
          {formatReviewDate(review.date)}
          {review.service ? ` · ${review.service}` : null}
        </p>
      </footer>
    </article>
  );
}
