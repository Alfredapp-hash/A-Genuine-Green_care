import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import { Sparkles, Users, Anchor, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet Courtney Thomas and the team behind Saltwater Sprouts Early Learning Center in Georgetown County, SC.",
};

const values = [
  {
    Icon: Sparkles,
    title: "Child-Led Learning",
    body: "We follow each child's curiosity and developmental pace.",
    topColor: "bg-coral",
    iconBg: "bg-coral/15",
    iconColor: "text-coral",
  },
  {
    Icon: Users,
    title: "Family Partnership",
    body: "Parents are our partners — we keep communication open and consistent.",
    topColor: "bg-sage",
    iconBg: "bg-sage/15",
    iconColor: "text-sage",
  },
  {
    Icon: Anchor,
    title: "Community Roots",
    body: "Georgetown County is our home. We invest in the families who live here.",
    topColor: "bg-seafoam",
    iconBg: "bg-seafoam/30",
    iconColor: "text-navy",
  },
  {
    Icon: ShieldCheck,
    title: "Safety First",
    body: "Licensed, trained, and committed to the highest standards of child safety.",
    topColor: "bg-navy",
    iconBg: "bg-navy/10",
    iconColor: "text-navy",
  },
];

const ghostStaff = [
  { name: "Lead Caregiver", role: "Infant Room" },
  { name: "Early Childhood Educator", role: "Waddlers & Toddlers" },
  { name: "Preschool Teacher", role: "Pre-K Room" },
];

const accreditations = [
  { icon: ShieldCheck, label: "SC DSS Licensed", sub: "State of South Carolina" },
  { icon: Sparkles, label: "ABC Quality", sub: "Quality Rating System" },
  { icon: Users, label: "First Steps SC", sub: "Early Childhood Partner" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <div className="relative bg-gradient-to-br from-seafoam/40 via-seafoam/10 to-cream py-28 text-center overflow-hidden">
        {/* Background rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-seafoam/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-seafoam/10" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-3">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy">About Saltwater Sprouts</h1>
          <p className="mt-4 text-navy/65 max-w-xl mx-auto text-lg">
            Founded in Georgetown County with a simple belief: every child deserves a joyful, safe, and enriching start.
          </p>

          {/* Stat strip */}
          <div className="mt-8 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-seafoam/40 rounded-full px-6 py-3 shadow-card">
            <span className="text-navy/60 text-sm font-semibold">Founded in Georgetown County</span>
            <span className="text-seafoam font-bold">·</span>
            <span className="text-navy/60 text-sm font-semibold">Family-Centered</span>
            <span className="text-seafoam font-bold">·</span>
            <span className="text-navy/60 text-sm font-semibold">Community-Rooted</span>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 64" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </div>

      {/* Founder section */}
      <SectionWrapper bg="white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Styled founder photo frame */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden relative aspect-square bg-gradient-to-br from-seafoam/40 to-sage/20 flex items-center justify-center">
              {/* ── SLOT: Replace with <Image> of Courtney Thomas ── */}

              {/* Ocean watermark SVG */}
              <svg
                className="absolute inset-0 w-full h-full opacity-10 text-navy"
                viewBox="0 0 200 200"
                fill="currentColor"
              >
                <path d="M0,120 C30,100 70,140 100,120 C130,100 170,140 200,120 L200,200 L0,200 Z" />
                <path d="M0,140 C30,120 70,160 100,140 C130,120 170,160 200,140 L200,200 L0,200 Z" opacity="0.6" />
                <path d="M0,160 C30,140 70,180 100,160 C130,140 170,180 200,160 L200,200 L0,200 Z" opacity="0.4" />
              </svg>

              {/* Initials circle */}
              <div className="relative z-10 w-28 h-28 rounded-full bg-white/60 border-4 border-white/80 flex items-center justify-center shadow-elevated">
                <span className="text-4xl font-extrabold text-navy/70">CT</span>
              </div>
            </div>

            {/* Coral accent borders — 2 sides */}
            <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-br-2xl border-b-4 border-r-4 border-coral pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-20 h-20 rounded-tl-2xl border-t-4 border-l-4 border-coral pointer-events-none" />

            {/* Founder & Director tag */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-bold tracking-wide px-5 py-2 rounded-full shadow-elevated whitespace-nowrap">
              Founder &amp; Director
            </div>
          </div>

          <div className="space-y-6 mt-6 md:mt-0">
            <div>
              <p className="text-coral text-xs font-bold tracking-widest uppercase mb-1">Meet the Founder</p>
              <h2 className="text-3xl font-extrabold text-navy">Courtney Thomas</h2>
              <p className="text-sage font-semibold mt-1">Founder &amp; Director, Saltwater Sprouts</p>
            </div>

            {/* ── SLOT: Courtney's bio — replace placeholder text below ── */}
            {/* Decorative opening quote */}
            <div className="relative">
              <span className="absolute -top-4 -left-2 text-6xl font-extrabold text-seafoam/40 leading-none select-none">&ldquo;</span>
              <p className="text-navy/70 leading-relaxed pt-4">
                Courtney Thomas founded Saltwater Sprouts out of a deep commitment to the families of Georgetown County. With a background in early childhood education and a passion for community, she set out to create a place where every child — regardless of family income — could access high-quality care and a love of learning.
              </p>
            </div>
            <p className="text-navy/70 leading-relaxed">
              Born and raised in the Lowcountry, Courtney understands the unique needs of this community. Her vision for Saltwater Sprouts is rooted in the belief that strong families build strong communities — and it all starts with those precious early years.
            </p>

            {/* Credential pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {["Georgetown Native", "Early Childhood Education", "Community Leader"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-1.5 rounded-full bg-seafoam/20 border border-seafoam/50 text-navy/75 text-xs font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Button href="/contact" variant="secondary">
              Reach Out to Courtney
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper bg="cream">
        <div className="text-center mb-12">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-2">What We Stand For</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => {
            const IconComponent = v.Icon;
            return (
              <div
                key={v.title}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                {/* Colored top line */}
                <div className={`h-1.5 ${v.topColor}`} />
                <div className="p-6 space-y-3">
                  <div className={`w-12 h-12 rounded-full ${v.iconBg} flex items-center justify-center mx-auto`}>
                    <IconComponent size={22} className={v.iconColor} />
                  </div>
                  <h3 className="font-bold text-navy text-center">{v.title}</h3>
                  <p className="text-navy/65 text-sm leading-relaxed text-center">{v.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Staff section */}
      <SectionWrapper bg="white">
        <div className="text-center mb-10">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-2">The Team</p>
          <h2 className="text-3xl font-extrabold text-navy">Our Caregivers</h2>
          <p className="mt-3 text-navy/60 max-w-md mx-auto text-sm">
            Every member of our team is trained, background-checked, and genuinely passionate about early childhood.
          </p>
        </div>
        {/* ── SLOT: Staff bios / team cards — drop prebuilt component here ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ghostStaff.map((s) => (
            <div
              key={s.role}
              className="rounded-2xl overflow-hidden border border-seafoam/40 shadow-card"
            >
              {/* Gradient photo placeholder */}
              <div className="aspect-square bg-gradient-to-br from-seafoam/30 to-sage/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/50 border-2 border-white/80 flex items-center justify-center">
                  <Users size={32} className="text-sage/50" />
                </div>
              </div>
              <div className="p-5 text-center">
                <p className="font-bold text-navy text-sm">{s.name}</p>
                <p className="text-sage text-xs font-semibold mt-1">{s.role}</p>
                <div className="mt-3 h-2 bg-seafoam/20 rounded-full w-3/4 mx-auto" />
                <div className="mt-2 h-2 bg-seafoam/10 rounded-full w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Licensing / accreditation */}
      <SectionWrapper bg="navy">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <p className="text-seafoam text-xs font-bold tracking-widest uppercase">Licensed &amp; Certified</p>
          <h2 className="text-2xl font-extrabold text-white">Committed to Quality</h2>
          <p className="text-white/65 text-sm">We meet and exceed South Carolina&apos;s standards for early childhood care.</p>
        </div>
        {/* ── SLOT: Accreditation badges (SC DSS, ABC Quality, First Steps) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {accreditations.map((a) => {
            const IconComponent = a.icon;
            return (
              <div
                key={a.label}
                className="bg-white rounded-xl border border-white/20 p-6 flex flex-col items-center gap-3 text-center shadow-elevated"
              >
                <div className="w-12 h-12 rounded-full bg-seafoam/20 flex items-center justify-center">
                  <IconComponent size={22} className="text-navy" />
                </div>
                <div>
                  <p className="font-bold text-navy text-sm">{a.label}</p>
                  <p className="text-navy/55 text-xs mt-0.5">{a.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
