import type { Metadata } from "next";
import Link from "next/link";
import { GoogleReviewsSection } from "@/components/reviews/GoogleReviewsSection";
import { GoogleRatingBadge } from "@/components/reviews/GoogleRatingBadge";
import { JsonLd } from "@/components/seo/JsonLd";
import { featuredReviews } from "@/data/reviews";
import { site } from "@/data/site";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Google Reviews",
  description: `See what neighbors say about ${site.legalName} on Google — featured five-star reviews and a direct link to leave your own.`,
};

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd(featuredReviews)} />
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Google reviews
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Liked on Google. Proven in the yard.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            Featured reviews from our Google Business Profile. Read more on Google or leave one
            after your next visit.
          </p>
          <div className="mt-8">
            <GoogleRatingBadge tone="dark" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={site.googleShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-sm bg-gold px-5 py-3 text-sm font-bold text-forest-deep transition hover:bg-gold-soft"
            >
              Open Google reviews
            </a>
            <Link
              href="/quote"
              className="inline-flex rounded-sm border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition hover:border-cream/55"
            >
              Get a free quote
            </Link>
          </div>
        </div>
      </section>

      <GoogleReviewsSection
        reviews={featuredReviews}
        eyebrow="Featured from Google"
        title="Five-star notes from real customers."
        showAllLink={false}
      />
    </>
  );
}
