import { VideoHero } from "@/components/hero/VideoHero";
import { GoogleReviewsSection } from "@/components/reviews/GoogleReviewsSection";
import { ServicesTeaser } from "@/components/sections/ServicesTeaser";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { DualCta } from "@/components/services/DualCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { featuredReviews, homepageReviews } from "@/data/reviews";
import { localBusinessJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd(featuredReviews)} />
      <VideoHero />
      <TrustStrip />
      <ServicesTeaser />
      <GoogleReviewsSection reviews={homepageReviews} />
      <DualCta />
    </>
  );
}
