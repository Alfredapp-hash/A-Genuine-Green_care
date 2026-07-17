import Link from "next/link";
import { Heart, Waves, Palette, Star } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";

const programs = [
  {
    Icon: Heart,
    name: "Infant Care",
    age: "6 weeks – 12 months",
    description:
      "Nurturing one-on-one care in a warm, sensory-rich environment. We build secure attachments so the tiniest sprouts feel safe and loved.",
    iconBg: "bg-coral/15",
    iconColor: "text-coral",
    accentBar: "bg-coral",
    accentText: "text-coral",
  },
  {
    Icon: Waves,
    name: "Waddlers",
    age: "12 – 24 months",
    description:
      "Exploring movement, language, and play. Our toddler rooms are designed for curious little ones discovering the world one wobbly step at a time.",
    iconBg: "bg-seafoam/25",
    iconColor: "text-seafoam",
    accentBar: "bg-seafoam",
    accentText: "text-[#3a8c82]",
  },
  {
    Icon: Palette,
    name: "Toddlers",
    age: "2 – 3 years",
    description:
      "Building independence, creativity, and friendships through structured play, art, music, and storytime in a nurturing group setting.",
    iconBg: "bg-sage/15",
    iconColor: "text-sage",
    accentBar: "bg-sage",
    accentText: "text-sage",
  },
  {
    Icon: Star,
    name: "Preschool",
    age: "3 – 4 years",
    description:
      "Kindergarten-readiness skills through play-based learning, early literacy, math concepts, and social-emotional development.",
    iconBg: "bg-sand/40",
    iconColor: "text-amber-600",
    accentBar: "bg-sand",
    accentText: "text-amber-700",
  },
];

export default function ProgramsOverview() {
  return (
    <section id="programs" className="relative bg-cream overflow-hidden py-16 md:py-24">

      {/* Wave top — transition from white (MissionStrip is navy, but the section above may vary) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 50" className="w-full" style={{ fill: "#ffffff" }} preserveAspectRatio="none">
          <path d="M0,25 C480,50 960,0 1440,25 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center mb-14 relative">
          {/* Decorative wave accent behind heading */}
          <div aria-hidden="true" className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-8 opacity-20">
            <svg viewBox="0 0 128 32" fill="none" className="w-full h-full">
              <path d="M0,16 C21,0 43,32 64,16 C85,0 107,32 128,16" stroke="#5B8A5A" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-3">What We Offer</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Programs for Every Stage</h2>
          <p className="mt-3 text-navy/60 max-w-xl mx-auto leading-relaxed">
            From your first weeks home to the last summer before kindergarten — we have a place for your child.
          </p>
        </div>

        {/* Program cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p) => {
            const { Icon } = p;
            return (
              <div
                key={p.name}
                className="group relative bg-white rounded-2xl shadow-card flex flex-col overflow-hidden hover:-translate-y-1.5 hover:shadow-elevated transition-all duration-300"
              >
                {/* Colored top accent bar */}
                <div className={`h-1 w-full ${p.accentBar} rounded-t-2xl`} />

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Icon circle */}
                  <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={22} className={p.iconColor} strokeWidth={2} />
                  </div>

                  {/* Name + age badge */}
                  <div>
                    <h3 className="font-bold text-navy text-lg leading-tight">{p.name}</h3>
                    <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${p.iconBg} ${p.accentText}`}>
                      {p.age}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-navy/65 text-sm leading-relaxed flex-1">{p.description}</p>

                  {/* Learn more link */}
                  <Link
                    href="/programs"
                    className={`text-sm font-bold ${p.accentText} group-hover:underline underline-offset-2 transition-all flex items-center gap-1`}
                  >
                    Learn More
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button href="/programs" variant="secondary">
            Learn More About Our Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
