import { Hero } from "@/components/hero/Hero";
import { GoogleReviewsSection } from "@/components/reviews/GoogleReviewsSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { featuredReviews, homepageReviews } from "@/data/reviews";
import { localBusinessJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd(featuredReviews)} />
      <Hero />
      <TrustStrip />
      <GoogleReviewsSection reviews={homepageReviews} />
    </>
  );
}
