"use client";

// TODO: wire up form submission
import SectionWrapper from "@/components/ui/SectionWrapper";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

// Share2 and Camera are not in the allowed list, use inline SVGs
function Share2Icon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CameraIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

const contactItems = [
  {
    Icon: MapPin,
    label: "Address",
    iconBg: "bg-seafoam/30",
    iconColor: "text-navy",
    content: (
      <>
        <p className="text-navy/70 text-sm mt-1">Georgetown County, South Carolina</p>
        <span className="text-sage/60 text-xs">(full address coming soon)</span>
      </>
    ),
    // ── TODO: Replace placeholder contact info ──
  },
  {
    Icon: Phone,
    label: "Phone",
    iconBg: "bg-coral/15",
    iconColor: "text-coral",
    content: (
      // TODO: replace with real phone
      <a href="tel:+18005550100" className="text-navy/70 text-sm mt-1 hover:text-coral transition-colors block">
        (800) 555-0100
      </a>
    ),
  },
  {
    Icon: Mail,
    label: "Email",
    iconBg: "bg-sage/15",
    iconColor: "text-sage",
    content: (
      // TODO: replace with real email
      <a href="mailto:hello@saltwatersprouts.com" className="text-navy/70 text-sm mt-1 hover:text-sage transition-colors block">
        hello@saltwatersprouts.com
      </a>
    ),
  },
  {
    Icon: Clock,
    label: "Hours",
    iconBg: "bg-sand/40",
    iconColor: "text-navy",
    content: (
      <>
        {/* TODO: replace with real hours */}
        <p className="text-navy/70 text-sm mt-1">Monday – Friday</p>
        <span className="text-sage/60 text-xs">(hours coming soon)</span>
      </>
    ),
  },
];

const subjectOptions = [
  "Schedule a Tour",
  "Enrollment Question",
  "Financial Assistance",
  "General Inquiry",
  "Other",
];

export default function ContactPage() {
  return (
    <>
      {/* Page hero */}
      <div className="relative bg-gradient-to-br from-seafoam/40 via-seafoam/10 to-cream py-28 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-seafoam/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-seafoam/10" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <p className="text-sage text-xs font-bold tracking-widest uppercase mb-3">We&apos;d Love to Hear From You</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy">Contact Us</h1>
          <p className="mt-4 text-navy/65 max-w-xl mx-auto text-lg">
            Have questions? Ready to schedule a tour? Reach out — we&apos;re here for your family.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 64" className="w-full fill-white" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </div>

      <SectionWrapper bg="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-navy">Get In Touch</h2>

            {/* Contact info mini-cards */}
            <div className="space-y-3">
              {contactItems.map((item) => {
                const IconComponent = item.Icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-seafoam/40 shadow-card"
                  >
                    <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                      <IconComponent size={18} className={item.iconColor} />
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">{item.label}</p>
                      {item.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social links */}
            <div>
              <h3 className="font-bold text-navy text-xs uppercase tracking-widest mb-3">Follow Along</h3>
              <div className="flex gap-3">
                {/* TODO: replace # with real social links */}
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy text-white text-xs font-bold hover:bg-navy/80 transition-colors"
                >
                  <Share2Icon size={14} />
                  Facebook
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-coral text-white text-xs font-bold hover:bg-coral/80 transition-colors"
                >
                  <CameraIcon size={14} />
                  Instagram
                </a>
              </div>
            </div>

            {/* Map slot — styled richly */}
            <div className="rounded-2xl overflow-hidden border border-seafoam/50 bg-seafoam/10 aspect-video flex items-center justify-center relative">
              {/* ── SLOT: Drop Google Maps embed here ── */}
              {/* Decorative grid background */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "linear-gradient(#B8D4CE 1px, transparent 1px), linear-gradient(90deg, #B8D4CE 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-coral/20 border-2 border-coral/40 flex items-center justify-center mx-auto">
                  <MapPin size={22} className="text-coral" />
                </div>
                <p className="text-navy/60 text-xs font-semibold">Georgetown County, SC</p>
                <p className="text-navy/40 text-xs">33.3765° N, 79.2948° W</p>
                <a
                  href="https://maps.google.com/?q=Georgetown+County+SC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-coral hover:text-coral/80 transition-colors mt-1"
                >
                  View on Google Maps
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact form — styled HTML structure, not wired up */}
          <div>
            <h2 className="text-2xl font-extrabold text-navy mb-6">Send Us a Message</h2>

            {/* ── SLOT: Drop your prebuilt contact form component here ── */}
            {/*
              Suggested fields:
              - Name (required)
              - Email (required)
              - Phone (optional)
              - Subject (optional — e.g., "Schedule a Tour", "Enrollment Question", "General")
              - Message (required)
              - Submit button
            */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-wide" htmlFor="contact-name">
                    Name <span className="text-coral">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy/70 uppercase tracking-wide" htmlFor="contact-email">
                    Email <span className="text-coral">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy/70 uppercase tracking-wide" htmlFor="contact-phone">
                  Phone <span className="text-navy/35 font-normal">(optional)</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="(843) 555-0100"
                  className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors bg-white"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy/70 uppercase tracking-wide" htmlFor="contact-subject">
                  Subject
                </label>
                <select
                  id="contact-subject"
                  defaultValue=""
                  className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors bg-white appearance-none"
                >
                  <option value="" disabled>Select a topic…</option>
                  {subjectOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy/70 uppercase tracking-wide" htmlFor="contact-message">
                  Message <span className="text-coral">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us how we can help…"
                  className="w-full border-2 border-seafoam/40 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors bg-white resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-coral text-white font-bold py-3.5 rounded-full hover:bg-coral/85 transition-colors shadow-md hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                Send Message
              </button>
            </form>

            {/* Tour request quick note */}
            <div className="mt-6 rounded-xl bg-coral/10 border border-coral/20 p-4 text-sm text-navy/70">
              <span className="font-bold text-coral">Scheduling a tour?</span> Let us know your preferred days/times and your child&apos;s age group and we&apos;ll make it happen!
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
