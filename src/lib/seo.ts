import { googleRating, type GoogleReview } from "@/data/reviews";
import { site } from "@/data/site";

export function localBusinessJsonLd(reviews: GoogleReview[]) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.googleShareUrl}#business`,
    name: site.legalName,
    description: site.description,
    url: site.googleShareUrl,
    telephone: site.phone,
    email: site.email,
    image: "/avatar/owner-mower.webp",
    areaServed: site.serviceAreaLabel,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: googleRating.ratingValue,
      reviewCount: googleRating.reviewCount,
      bestRating: googleRating.bestRating,
      worstRating: googleRating.worstRating,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: googleRating.bestRating,
        worstRating: googleRating.worstRating,
      },
    })),
  };
}
