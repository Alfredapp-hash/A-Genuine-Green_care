import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABanner from "@/components/sections/CTABanner";
import Button from "@/components/ui/Button";
import { CheckCircle, Download, ChevronRight, Users, Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Enrollment",
  description: "Enroll your infant, toddler, or preschooler at Saltwater Sprouts Early Learning Center in Georgetown County, SC.",
};

const steps = [
  {
    step: "01",
    title: "Submit an Inquiry",
    body: "Fill out the interest form below or give us a call to check availability for your child's age group.",
  },
  {
    step: "02",
    title: "Schedule a Tour",
    body: "Come meet our team, see our classrooms, and ask all your questions in person.",
  },
  {
    step: "03",
    title: "Complete Paperwork",
    body: "We'll send you the enrollment packet: medical forms, emergency contacts, agreements, and program selection.",
  },
  {
    step: "04",
    title: "Welcome Home!",
    body: "Your child joins the Saltwater Sprouts family. We'll schedule a gentle transition plan to ease the first days.",
  },
];

const requiredDocs = [
  "Completed enrollment application",
  "Child's birth certificate",
  "Up-to-date immunization records (SC DHEC certificate)",
  "Current physical / well-child exam records",
  "Proof of income (if applying for subsidy)",
  "Emergency contact information",
  "Signed parent handbook acknowledgment",
];

const assistancePrograms = [
  {
    Icon: ShieldCheck,
    name: "SC DSS Child Care Subsidy",
    desc: "Income-based assistance through South Carolina's Department of Social Services for qualifying families.",
    iconBg: "bg-sage/15",
    iconColor: "text-sage",
    border: "border-sage/30",
  },
  {
    Icon: Sparkles,
    name: "ABC Quality Vouchers",
    desc: "Quality-rated programs may qualify for ABC Quality funding to reduce out-of-pocket costs for families.",
    iconBg: "bg-coral/15",
    iconColor: "text-coral",
    border: "border-coral/30",
  },
  {
    Icon: Users,
    name: "SC First Steps",
    desc: "Grants and family support services through First Steps to School Readiness for eligible Georgetown County families.",
    iconBg: "bg-seafoam/30",
    iconColor: "text-navy",
    border: "border-seafoam/40",
  },
];

export default function EnrollmentPage() {
  return (
    <>
      {/* Page hero */}
      <div className="relative bg-gradient-to-br from-coral/15 via-white to-cream py-28 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-coral/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-coral/08" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <p className="text-coral text-xs font-bold tracking-widest uppercase mb-3">Join Our Family</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy">Enrollment</h1>
          <p className="mt-4 text-navy/65 max-w-xl mx-auto text-lg">
            We&apos;d love to welcome your little one. Here&apos;s how to get started.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 64" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </div>

      {/* Steps — connected on desktop */}
      <SectionWrapper bg="white">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy">How Enrollment Works</h2>
          <p className="mt-3 text-navy/60 text-sm max-w-md mx-auto">Four simple steps to get your child started at Saltwater Sprouts.</p>
        </div>

        <div className="relative">
          {/* Horizontal connecting line — desktop only */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-seafoam/40 z-0" style={{ left: "calc(12.5%)", right: "calc(12.5%)" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-4 relative">
                {/* Step circle */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage to-sage/70 flex items-center justify-center shadow-elevated shrink-0">
                  <span className="text-white font-extrabold text-lg">{s.step}</span>
                </div>

                {/* Arrow between steps on desktop */}
                {i < steps.length - 1 && (
                  <ChevronRight
                    size={20}
                    className="hidden lg:block absolute -right-4 top-5 text-seafoam/60 z-20"
                  />
                )}

                <h3 className="font-bold text-navy">{s.title}</h3>
                <p className="text-navy/65 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Enrollment / waitlist form section */}
      <SectionWrapper bg="cream">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy">Start Your Enrollment</h2>
            <p className="mt-2 text-navy/60">Fill out the form below and we&apos;ll be in touch within 1 business day.</p>
          </div>

          {/* ── SLOT: Drop your prebuilt enrollment / waitlist form component here ── */}
          {/*
            Expected fields:
            - Parent/guardian name
            - Email & phone
            - Child's name & date of birth
            - Program interest (Infant / Waddlers / Toddler / Preschool)
            - Desired start date
            - How did you hear about us?
            - Additional notes
          */}
          <div className="rounded-2xl border-2 border-dashed border-sage/40 bg-white p-10 shadow-card">
            <p className="text-xs font-bold text-sage/70 uppercase tracking-widest text-center mb-6">Enrollment Form Slot</p>
            {/* Styled placeholder fields */}
            <div className="space-y-4 opacity-60 pointer-events-none select-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 rounded-xl border-2 border-seafoam/40 bg-seafoam/5 flex items-center px-4">
                  <span className="text-navy/40 text-sm">Parent / Guardian Name</span>
                </div>
                <div className="h-12 rounded-xl border-2 border-seafoam/40 bg-seafoam/5 flex items-center px-4">
                  <span className="text-navy/40 text-sm">Child&apos;s Name</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 rounded-xl border-2 border-seafoam/40 bg-seafoam/5 flex items-center px-4">
                  <span className="text-navy/40 text-sm">Email Address</span>
                </div>
                <div className="h-12 rounded-xl border-2 border-seafoam/40 bg-seafoam/5 flex items-center px-4">
                  <span className="text-navy/40 text-sm">Phone Number</span>
                </div>
              </div>
              <div className="h-12 rounded-xl border-2 border-seafoam/40 bg-seafoam/5 flex items-center px-4">
                <span className="text-navy/40 text-sm">Program Interest (Infant / Waddlers / Toddler / Preschool)</span>
              </div>
              <div className="h-24 rounded-xl border-2 border-seafoam/40 bg-seafoam/5 flex items-start pt-4 px-4">
                <span className="text-navy/40 text-sm">Additional Notes</span>
              </div>
            </div>
            {/* What you'll need checklist */}
            <div className="mt-8 pt-6 border-t border-sage/20">
              <p className="text-xs font-bold text-navy/60 uppercase tracking-widest mb-3">What you&apos;ll need before you begin:</p>
              <ul className="space-y-2">
                {["Child's date of birth", "Preferred start date", "Contact information", "Program interest"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-navy/60 text-sm">
                    <CheckCircle size={14} className="text-sage shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-center text-xs text-sage/60 mt-4">(drop your prebuilt form component here)</p>
          </div>
        </div>
      </SectionWrapper>

      {/* Financial assistance */}
      <SectionWrapper bg="seafoam">
        <div className="text-center mb-10">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-2">Financial Assistance</p>
          <h2 className="text-2xl font-extrabold text-navy">Childcare Shouldn&apos;t Break the Bank</h2>
          <p className="mt-3 text-navy/70 max-w-lg mx-auto text-sm leading-relaxed">
            We work with families to make quality care accessible. We accept SC Child Care subsidy (DSS), offer sliding-scale tuition, and can connect you with local assistance programs.
          </p>
        </div>

        {/* ── SLOT: Subsidy/assistance details or partner program cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {assistancePrograms.map((prog) => {
            const IconComponent = prog.Icon;
            return (
              <div
                key={prog.name}
                className={`bg-white rounded-2xl border ${prog.border} p-6 space-y-4 shadow-card`}
              >
                <div className={`w-12 h-12 rounded-full ${prog.iconBg} flex items-center justify-center`}>
                  <IconComponent size={22} className={prog.iconColor} />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">{prog.name}</h3>
                  <p className="text-navy/65 text-xs leading-relaxed mt-2">{prog.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Required documents */}
      <SectionWrapper bg="white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <h2 className="text-2xl font-extrabold text-navy">What to Bring</h2>
            {/* Stub download button */}
            <Button
              href="#"
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
            >
              Download Checklist PDF
            </Button>
          </div>

          <ul className="space-y-2">
            {requiredDocs.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-navy/75 p-3 rounded-xl hover:bg-seafoam/10 transition-colors"
              >
                <div className="w-5 h-5 rounded border-2 border-sage/50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle size={12} className="text-sage" />
                </div>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
