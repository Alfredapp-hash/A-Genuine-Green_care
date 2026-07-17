import Hero from "@/components/sections/Hero";
import MissionStrip from "@/components/sections/MissionStrip";
import ProgramsOverview from "@/components/sections/ProgramsOverview";
import WhyUs from "@/components/sections/WhyUs";
import CommunityStrip from "@/components/sections/CommunityStrip";
import ParentGalleryTeaser from "@/components/sections/ParentGalleryTeaser";
import CTABanner from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionStrip />
      <ProgramsOverview />
      <WhyUs />
      <CommunityStrip />
      {/* ── SLOT: Testimonials / parent quotes — drop prebuilt component here ── */}
      <ParentGalleryTeaser />
      {/* ── SLOT: Virtual tour / photo gallery — drop prebuilt component here ── */}
      <CTABanner />
    </>
  );
}
