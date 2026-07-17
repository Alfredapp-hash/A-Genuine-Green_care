import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import CTABanner from "@/components/sections/CTABanner";
import { ChevronDown, ArrowRight, Heart, Users, FileText, Download, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Family Resources",
  description: "Resources, support services, and community partnerships for families in Georgetown County, SC.",
};

// DollarSign inline — not in the allowed list so we inline it
function DollarSignIcon({ size = 22, className = "" }: { size?: number; className?: string }) {
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
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

const faqs = [
  {
    q: "What are your hours of operation?",
    a: "We are open Monday–Friday. Please contact us for current hours — we'll update this page once hours are confirmed.",
  },
  {
    q: "Do you accept children with special needs or developmental delays?",
    a: "Yes. Saltwater Sprouts is committed to inclusion. We work with families and specialists to ensure every child can participate fully in our programs.",
  },
  {
    q: "What is your sick-child policy?",
    a: "Children with fevers (100.4°F or higher), vomiting, or contagious illness must stay home until symptom-free for 24 hours without medication. We follow SC DHEC guidelines.",
  },
  {
    q: "Do you provide meals and snacks?",
    a: "We provide nutritious snacks throughout the day. Lunch details vary by program — contact us for specifics on your child's age group.",
  },
  {
    q: "How do I apply for the SC childcare subsidy?",
    a: "Contact your local SC DSS office or visit dss.sc.gov. We can help guide you through the process — just reach out.",
  },
  {
    q: "What is your staff-to-child ratio?",
    a: "Ratios vary by age group: Infants 1:4, Waddlers 1:5, Toddlers 1:6, Preschool 1:8. All are at or below SC licensing requirements.",
  },
];

const categories = [
  {
    Icon: DollarSignIcon as unknown as React.ElementType,
    title: "Financial Assistance",
    topColor: "bg-coral",
    iconBg: "bg-coral/15",
    iconColor: "text-coral",
    items: ["SC DSS Child Care Subsidy", "ABC Quality Vouchers", "SC First Steps Grants", "Sliding-scale tuition inquiry"],
  },
  {
    Icon: Users,
    title: "Parent Support",
    topColor: "bg-sage",
    iconBg: "bg-sage/15",
    iconColor: "text-sage",
    items: ["Georgetown County Family Resource Center", "SC 2-1-1 Helpline", "Parenting classes & workshops", "Peer support groups"],
  },
  {
    Icon: Heart,
    title: "Health & Development",
    topColor: "bg-seafoam",
    iconBg: "bg-seafoam/30",
    iconColor: "text-navy",
    items: ["SC DHEC Child Health Program", "Babies Can't Wait (IDEA Part C)", "Georgetown County Health Dept.", "WIC Georgetown County"],
  },
];

const partnerPlaceholders = [
  "Georgetown County Schools",
  "SC DSS",
  "First Steps SC",
  "ABC Quality",
  "SC DHEC",
  "Georgetown Health",
];

import type React from "react";

export default function ResourcesPage() {
  return (
    <>
      {/* Page hero */}
      <div className="relative bg-gradient-to-br from-sage/15 via-white to-cream py-28 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-sage/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-sage/08" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-3">For Families</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy">Family Resources</h1>
          <p className="mt-4 text-navy/65 max-w-xl mx-auto text-lg">
            We&apos;re here beyond the classroom — connecting Georgetown County families to the support they need.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 64" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </div>

      {/* Resource categories */}
      <SectionWrapper bg="white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = cat.Icon;
            return (
              <div
                key={cat.title}
                className="rounded-2xl overflow-hidden border border-seafoam/40 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                {/* Colored top stripe */}
                <div className={`h-2 ${cat.topColor}`} />
                <div className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-full ${cat.iconBg} flex items-center justify-center`}>
                    <IconComponent size={22} className={cat.iconColor} />
                  </div>
                  <h3 className="font-bold text-navy text-lg">{cat.title}</h3>
                  <ul className="space-y-2.5">
                    {cat.items.map((item) => (
                      <li key={item} className="text-sm text-navy/65 flex items-start gap-2">
                        <ArrowRight size={14} className="text-sage mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Parent handbook slot */}
      <SectionWrapper bg="cream">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-coral text-xs font-bold tracking-widest uppercase mb-2">Documentation</p>
            <h2 className="text-2xl font-extrabold text-navy">Parent Handbook</h2>
            <p className="mt-3 text-navy/70 max-w-md leading-relaxed">
              Our parent handbook covers policies, daily routines, health guidelines, discipline philosophy, and how to communicate with our team.
            </p>
          </div>
          {/* ── SLOT: PDF download button / handbook viewer ── */}
          <div className="rounded-2xl border-2 border-dashed border-coral/30 bg-white p-8 text-center min-w-[220px] shadow-card">
            <div className="w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-coral" />
            </div>
            <p className="text-sm font-bold text-navy">Parent Handbook PDF</p>
            <p className="text-xs text-sage/60 mt-1 mb-4">(drop download link here)</p>
            <Button href="#" variant="primary" size="sm" icon={<Download size={13} />}>
              Download PDF
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper bg="white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sage text-xs font-bold tracking-widest uppercase mb-2">Common Questions</p>
            <h2 className="text-3xl font-extrabold text-navy">FAQ</h2>
          </div>

          {/* ── SLOT: Replace with interactive accordion component if available ── */}
          {/* Static accordion-style layout — wire up open/close state when adding a client component */}
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white border border-seafoam/50 rounded-2xl overflow-hidden shadow-card"
              >
                {/* Question row */}
                <div className="flex items-center justify-between gap-4 p-5 cursor-default">
                  <h3 className="font-bold text-navy text-sm leading-snug">{faq.q}</h3>
                  {/* ChevronDown — static, pointing down; wire up toggle for accordion behavior */}
                  <ChevronDown size={18} className="text-sage/70 shrink-0" />
                </div>
                {/* Answer — always visible in static mode */}
                <div className="px-5 pb-5">
                  <p className="text-navy/65 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-10 bg-seafoam/20 border border-seafoam/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-navy">Still have questions?</p>
              <p className="text-navy/65 text-sm mt-1">We&apos;re happy to help — reach out any time.</p>
            </div>
            <Button href="/contact" variant="secondary" icon={<Mail size={14} />} size="sm">
              Contact Us
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* Community partners */}
      <SectionWrapper bg="navy">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <p className="text-seafoam text-xs font-bold tracking-widest uppercase">Community</p>
          <h2 className="text-2xl font-extrabold text-white">Our Community Partners</h2>
          <p className="text-white/65 text-sm">We collaborate with local organizations to strengthen the families we serve.</p>
        </div>
        {/* ── SLOT: Partner logo grid — drop prebuilt component here ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {partnerPlaceholders.map((partner) => (
            <div
              key={partner}
              className="bg-white/10 border border-white/20 rounded-xl p-5 flex items-center justify-center text-center hover:bg-white/15 transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <Users size={18} className="text-seafoam" />
                </div>
                <p className="text-white/80 text-xs font-semibold leading-snug">{partner}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
