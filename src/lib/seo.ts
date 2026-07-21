import { googleRating, type GoogleReview } from "@/data/reviews";
import { site, siteUrl } from "@/data/site";

export function localBusinessJsonLd(reviews: GoogleReview[]) {
  const base = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: site.legalName,
    description: site.description,
    url: siteUrl,
    telephone: site.phone,
    email: site.email,
    image: `${siteUrl}/avatar/owner-mower.webp`,
    areaServed: site.serviceAreaLabel,
    sameAs: [site.googleShareUrl],
  };

  // Review markup is only emitted once the data is verified live GBP copy —
  // fabricated review structured data risks a Google manual action.
  if (!googleRating.verified) return base;

  return {
    ...base,
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
      "@id": `${siteUrl}/#business`,
      name: site.legalName,
      telephone: site.phone,
    },
    areaServed: site.serviceAreaLabel,
    url: `${siteUrl}/services/${service.slug}`,
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}
