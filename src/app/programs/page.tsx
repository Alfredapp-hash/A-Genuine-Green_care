import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import {
  Heart,
  Waves,
  GraduationCap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Programs",
  description: "Childcare and early education programs for infants through age 4 at Saltwater Sprouts in Georgetown County, SC.",
};

// Palette icon inline — not in the allowed lucide list but we can render a simple SVG
function PaletteIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.47-1.125-.29-.289-.47-.688-.47-1.125a1.64 1.64 0 0 1 1.648-1.688h1.994c3.132 0 5.65-2.518 5.65-5.65C22 6.5 17.5 2 12 2z" />
    </svg>
  );
}

const programs = [
  {
    Icon: Heart,
    name: "Infant Care",
    age: "6 weeks – 12 months",
    ratio: "1:4",
    ratioLabel: "1:4 ratio",
    accentColor: "border-seafoam",
    iconBg: "bg-seafoam/30",
    iconColor: "text-seafoam",
    borderLeft: "border-l-[8px] border-l-seafoam",
    highlights: [
      "Responsive, attachment-based caregiving",
      "Sensory-rich play environments",
      "Daily communication with families",
      "Flexible feeding & sleep schedules",
    ],
    description:
      "Our infant room is a warm, calm sanctuary designed around your baby's individual rhythms. Our trained infant specialists build secure, loving relationships that set the foundation for all future learning.",
  },
  {
    Icon: Waves,
    name: "Waddlers",
    age: "12 – 24 months",
    ratio: "1:5",
    ratioLabel: "1:5 ratio",
    accentColor: "border-sage",
    iconBg: "bg-sage/20",
    iconColor: "text-sage",
    borderLeft: "border-l-[8px] border-l-sage",
    highlights: [
      "Safe spaces for emerging walkers",
      "Language-rich storytelling & songs",
      "Sensory bins and messy play",
      "Parallel play and social exploration",
    ],
    description:
      "Waddlers are all about discovery. Our toddler environments invite little ones to explore, babble, and begin understanding the world around them — with patient, attentive caregivers at every step.",
  },
  {
    Icon: PaletteIcon as unknown as React.ElementType,
    name: "Toddlers",
    age: "2 – 3 years",
    ratio: "1:6",
    ratioLabel: "1:6 ratio",
    accentColor: "border-coral",
    iconBg: "bg-coral/20",
    iconColor: "text-coral",
    borderLeft: "border-l-[8px] border-l-coral",
    highlights: [
      "Social-emotional skill building",
      "Art, music, and movement daily",
      "Introduction to pre-literacy concepts",
      "Community helpers and dramatic play",
    ],
    description:
      "The toddler years are full of big feelings and bigger ideas. Our classroom structure balances free play and guided activities to support independence, language development, and the early foundations of friendship.",
  },
  {
    Icon: GraduationCap,
    name: "Preschool",
    age: "3 – 4 years",
    ratio: "1:8",
    ratioLabel: "1:8 ratio",
    accentColor: "border-sand",
    iconBg: "bg-sand/40",
    iconColor: "text-navy",
    borderLeft: "border-l-[8px] border-l-sand",
    highlights: [
      "Early literacy and phonemic awareness",
      "Math through hands-on exploration",
      "STEAM projects and nature discovery",
      "Kindergarten readiness focus",
    ],
    description:
      "Our preschool program is thoughtfully designed to prepare children for the big step to kindergarten — while keeping learning joyful. Children engage in project-based learning, collaborative play, and structured routines that build confidence and competence.",
  },
];

// React import needed for JSX type
import type React from "react";

export default function ProgramsPage() {
  return (
    <>
      {/* Page hero */}
      <div className="relative bg-gradient-to-br from-seafoam/40 via-seafoam/10 to-white py-28 text-center overflow-hidden">
        {/* Subtle background texture rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-seafoam/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-seafoam/10" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy">Our Programs</h1>
          <p className="mt-4 text-navy/65 max-w-xl mx-auto text-lg">
            Every stage of early childhood deserves expert care. Here&apos;s how we grow with your child.
          </p>

          {/* Stat strip */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-seafoam/40 rounded-full px-6 py-3 shadow-card">
            <span className="text-navy/60 text-sm font-semibold">4 Programs</span>
            <span className="text-seafoam font-bold">·</span>
            <span className="text-navy/60 text-sm font-semibold">Infants to Age 4</span>
            <span className="text-seafoam font-bold">·</span>
            <span className="text-navy/60 text-sm font-semibold">Georgetown County SC</span>
          </div>
        </div>

        {/* Wave bottom transition */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 64" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </div>

      {/* Program detail cards */}
      <SectionWrapper bg="white">
        <div className="space-y-12">
          {programs.map((p, i) => {
            const IconComponent = p.Icon;
            const isReversed = i % 2 === 1;
            return (
              <div
                key={p.name}
                className={`rounded-2xl border border-seafoam/30 ${p.borderLeft} p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 items-start`}
              >
                {/* Text column — swaps on alternating cards */}
                <div className={`space-y-4 ${isReversed ? "md:order-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    {/* Icon in styled circle */}
                    <div className={`w-14 h-14 rounded-full ${p.iconBg} flex items-center justify-center shrink-0`}>
                      <IconComponent size={24} className={p.iconColor} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-extrabold text-navy">{p.name}</h2>
                        {/* Ratio badge */}
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-seafoam/20 text-navy/70 text-xs font-bold border border-seafoam/40">
                          {p.ratioLabel}
                        </span>
                      </div>
                      <p className="text-sage text-sm font-semibold mt-0.5">{p.age}</p>
                    </div>
                  </div>
                  <p className="text-navy/70 leading-relaxed">{p.description}</p>
                </div>

                {/* Highlights column */}
                <div className={isReversed ? "md:order-1" : ""}>
                  <h3 className="font-bold text-navy mb-4 text-xs uppercase tracking-widest">Program Highlights</h3>
                  <ul className="space-y-3">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-navy/70 text-sm">
                        <CheckCircle size={14} className="text-sage mt-0.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button href="/enrollment" variant="primary" icon={<ArrowRight size={14} />}>
                      Enroll in {p.name}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* ── SLOT: Daily schedule / sample day section — drop prebuilt component here ── */}
      {/* ── SLOT: Curriculum philosophy deep-dive — drop prebuilt component here ── */}

      {/* Bottom CTA — coral band with wave top */}
      <div className="relative bg-coral overflow-hidden py-20">
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1440 60" className="w-full fill-coral" preserveAspectRatio="none">
            <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center space-y-5">
          <p className="text-white/80 text-xs font-bold tracking-widest uppercase">Ready to Get Started?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Find the Right Program for Your Child
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Schedule a tour and see our classrooms in person. We&apos;d love to meet your family.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button href="/enrollment" variant="outline" className="border-white text-white hover:bg-white hover:text-coral">
              Start Enrollment
            </Button>
            <Button href="/contact" variant="outline" className="border-white/60 text-white/90 hover:bg-white/10">
              Schedule a Tour
            </Button>
          </div>
        </div>
      </div>

      <CTABanner />
    </>
  );
}
