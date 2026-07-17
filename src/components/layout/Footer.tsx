"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Share2, Camera, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import WaveDivider from "@/components/ui/WaveDivider";

/* ─── Link data ──────────────────────────────────────────── */
const programLinks = [
  { href: "/programs#infant",       label: "Infant Care (0–12 mo)"   },
  { href: "/programs#young-toddler",label: "Young Toddlers (1–2)"    },
  { href: "/programs#toddler",      label: "Toddlers (2–3)"          },
  { href: "/programs#preschool",    label: "Preschool (3–4)"         },
  { href: "/programs#enrichment",   label: "Enrichment Activities"   },
];

const quickLinks = [
  { href: "/about",      label: "About Us"       },
  { href: "/enrollment", label: "Enrollment"     },
  { href: "/resources",  label: "Family Resources"},
  { href: "/contact",    label: "Contact"        },
  { href: "/parent-portal/login", label: "Parent Portal" },
];

/* ─── Social icon button ─────────────────────────────────── */
function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
        text-white/60 hover:text-white hover:border-seafoam hover:bg-seafoam/20
        transition-all duration-200
      "
    >
      {children}
    </a>
  );
}

/* ─── Footer link ────────────────────────────────────────── */
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/65 hover:text-seafoam text-sm transition-colors duration-150 leading-relaxed"
      >
        {label}
      </Link>
    </li>
  );
}

/* ─── Newsletter strip ───────────────────────────────────── */
function NewsletterStrip() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    /* TODO: wire to real email provider */
    setSubmitted(true);
  };

  return (
    <div className="border-b border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="shrink-0">
          <p className="font-bold text-base text-white">
            Get center updates in your inbox
          </p>
          <p className="text-seafoam/70 text-xs mt-0.5">
            News, enrollment windows, and family events.
          </p>
        </div>

        {submitted ? (
          <p className="sm:ml-auto text-sage font-semibold text-sm">
            You&apos;re subscribed — thank you!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 sm:ml-auto w-full sm:w-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="
                flex-1 sm:w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/20
                text-white placeholder:text-white/40 text-sm
                focus:outline-none focus:ring-2 focus:ring-coral/60 focus:border-coral/60
                transition-all duration-150
              "
            />
            <button
              type="submit"
              className="
                flex items-center gap-1.5 px-5 py-2.5 rounded-full
                bg-coral text-white text-sm font-bold shrink-0
                hover:bg-coral/85 hover:shadow-[0_4px_14px_rgba(232,137,106,0.4)]
                transition-all duration-200
              "
            >
              Subscribe
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Main footer ────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="bg-navy text-white">

      {/* Multi-layer wave top */}
      <WaveDivider fill="#1B3A5C" className="bg-white" height={80} />

      {/* Newsletter strip */}
      <NewsletterStrip />

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ── Brand ── */}
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Saltwater Sprouts Early Learning Center"
              width={60}
              height={60}
              className="brightness-0 invert"
            />
            <div>
              <p className="font-bold text-lg leading-tight">Saltwater Sprouts</p>
              <p className="text-seafoam text-[10px] tracking-widest uppercase">
                Early Learning Center
              </p>
            </div>
          </Link>

          <p className="text-seafoam/70 text-sm leading-relaxed">
            Cultivating a safe, inclusive, and enriching environment where every
            child can grow, learn, and thrive.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5">
            <SocialButton href="#" label="Facebook">
              <Share2 size={15} />
            </SocialButton>
            <SocialButton href="#" label="Instagram">
              <Camera size={15} />
            </SocialButton>
          </div>
        </div>

        {/* ── Programs ── */}
        <div>
          <h3 className="font-bold text-seafoam uppercase tracking-widest text-[10px] mb-4">
            Programs
          </h3>
          <ul className="space-y-2.5">
            {programLinks.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>
        </div>

        {/* ── Quick links ── */}
        <div>
          <h3 className="font-bold text-seafoam uppercase tracking-widest text-[10px] mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <FooterLink key={link.href} href={link.href} label={link.label} />
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div>
          <h3 className="font-bold text-seafoam uppercase tracking-widest text-[10px] mb-4">
            Contact Us
          </h3>
          <address className="not-italic text-white/70 text-sm space-y-3">
            <p className="flex items-start gap-2.5">
              <MapPin size={14} className="shrink-0 mt-0.5 text-seafoam" />
              Georgetown County, South Carolina
            </p>
            <p className="flex items-center gap-2.5">
              <Phone size={14} className="shrink-0 text-seafoam" />
              <a
                href="tel:+18005550100"
                className="hover:text-white transition-colors"
              >
                (800) 555-0100
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail size={14} className="shrink-0 text-seafoam" />
              <a
                href="mailto:hello@saltwatersprouts.com"
                className="hover:text-white transition-colors break-all"
              >
                hello@saltwatersprouts.com
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* ── Trust badges row ── */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-1.5 text-white/40 text-[11px]">
            <ShieldCheck size={13} className="text-seafoam/60" />
            Licensed by SC DSS
          </span>
          <span className="text-white/20 hidden sm:block">·</span>
          <span className="flex items-center gap-1.5 text-white/40 text-[11px]">
            <MapPin size={12} className="text-seafoam/60" />
            Georgetown County, SC
          </span>
          <span className="text-white/20 hidden sm:block">·</span>
          <span className="text-white/40 text-[11px]">
            Serving Families Since 2018
          </span>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-white/10 text-center py-3 text-white/30 text-[11px]">
        © {new Date().getFullYear()} Saltwater Sprouts Early Learning Center. All rights reserved.
      </div>
    </footer>
  );
}
