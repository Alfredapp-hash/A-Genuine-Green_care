"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface NavLink {
  href:    string;
  label:   string;
  portal?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/",                    label: "Home"            },
  { href: "/programs",            label: "Programs"        },
  { href: "/about",               label: "About Us"        },
  { href: "/enrollment",          label: "Enrollment"      },
  { href: "/resources",           label: "Family Resources"},
  { href: "/contact",             label: "Contact"         },
  { href: "/parent-portal/login", label: "Parent Portal",  portal: true },
];

export default function Nav() {
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* ── Scroll-aware background ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close drawer on route change ── */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* ── Lock body scroll when mobile drawer is open ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`
        sticky top-0 z-50 border-b transition-all duration-300
        ${scrolled
          ? "bg-white shadow-md border-seafoam/30"
          : "bg-white/95 backdrop-blur border-seafoam shadow-sm"}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[72px]">

        {/* ── Logo + wordmark ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo.svg"
            alt="Saltwater Sprouts Early Learning Center"
            width={56}
            height={56}
            priority
            className="w-12 h-12 md:w-14 md:h-14"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-navy font-bold text-lg leading-none">
              Saltwater
            </span>
            <span className="text-sage text-xs font-semibold tracking-widest uppercase">
              SPROUTS
            </span>
          </div>

          {/* "Now Enrolling" micro-badge — desktop only, right of wordmark */}
          <span className="hidden lg:flex ml-1">
            <Badge variant="sage" size="sm" dot>Now Enrolling</Badge>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            if (link.portal) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-3 py-1 rounded-full text-xs font-bold transition-colors duration-150
                    bg-seafoam/30 text-navy hover:bg-seafoam/55
                    ${active ? "ring-1 ring-seafoam" : ""}
                  `}
                >
                  {link.label}
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative text-sm font-semibold transition-colors duration-150 pb-0.5
                  ${active ? "text-sage" : "text-navy hover:text-sage"}
                `}
              >
                {link.label}
                {/* Active underline bar */}
                {active && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-sage" />
                )}
              </Link>
            );
          })}

          {/* CTA */}
          <Link
            href="/enrollment"
            className="ml-1 px-5 py-2.5 rounded-full bg-coral text-white text-sm font-bold
                       hover:bg-coral/85 hover:shadow-[0_4px_14px_rgba(232,137,106,0.45)]
                       transition-all duration-200 shadow-sm"
          >
            Enroll Now
          </Link>
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 rounded-lg text-navy hover:bg-seafoam/20 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
        aria-hidden={!open}
      >
        <div className="bg-white border-t border-seafoam/40 px-4 pb-6 pt-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center py-3.5 font-semibold border-b border-seafoam/30
                  transition-colors duration-150
                  ${link.portal
                    ? "text-navy/70 text-sm"
                    : active
                      ? "text-sage"
                      : "text-navy hover:text-sage"}
                `}
              >
                {link.portal && (
                  <span className="mr-2 px-2 py-0.5 rounded-full bg-seafoam/30 text-navy text-[10px] font-bold uppercase tracking-wide">
                    Portal
                  </span>
                )}
                {link.label}
                {active && !link.portal && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sage" />
                )}
              </Link>
            );
          })}

          <Link
            href="/enrollment"
            onClick={() => setOpen(false)}
            className="mt-5 block text-center px-4 py-3 rounded-full bg-coral text-white font-bold
                       hover:bg-coral/85 transition-colors shadow-md"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </header>
  );
}
