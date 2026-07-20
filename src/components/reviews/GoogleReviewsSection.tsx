import Link from "next/link";
import type { GoogleReview } from "@/data/reviews";
import { site } from "@/data/site";
import { GoogleRatingBadge } from "@/components/reviews/GoogleRatingBadge";
import { ReviewCard } from "@/components/reviews/ReviewCard";

export function GoogleReviewsSection({
  reviews,
  eyebrow = "Google reviews",
  title = "Neighbors who liked the cut.",
  showAllLink = true,
}: {
  reviews: GoogleReview[];
  eyebrow?: string;
  title?: string;
  showAllLink?: boolean;
}) {
  return (
    <section className="bg-paper px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 border-b border-forest/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
              {eyebrow}
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-charcoal/70">
              Real feedback from Google — the same reviews homeowners check before they book.
            </p>
          </div>
          <GoogleRatingBadge />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          {showAllLink ? (
            <Link
              href="/reviews"
              className="inline-flex rounded-sm bg-forest px-5 py-3 text-sm font-semibold text-cream transition hover:bg-leaf"
            >
              See all featured reviews
            </Link>
          ) : null}
          <a
            href={site.googleShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-sm border border-forest/20 px-5 py-3 text-sm font-semibold text-forest transition hover:border-forest/40"
          >
            Leave a Google review
          </a>
        </div>
      </div>
    </section>
  );
}
