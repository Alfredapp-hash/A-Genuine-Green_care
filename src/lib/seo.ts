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

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  shortDescription: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    provider: {
      "@type": "LocalBusiness",
      name: site.legalName,
      telephone: site.phone,
    },
    areaServed: site.serviceAreaLabel,
    url: `/services/${service.slug}`,
  };
}
