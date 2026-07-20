"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { navLinks, site } from "@/data/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <header
      className={
        onHome
          ? "absolute inset-x-0 top-0 z-50"
          : "sticky top-0 z-50 border-b border-forest/10 bg-forest-deep"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-cream sm:text-2xl"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream/85 transition hover:text-gold-soft"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-forest-deep transition hover:bg-gold-soft"
          >
            Free Quote
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href={site.phoneHref}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-cream/10 text-cream"
            aria-label="Call us"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-cream/10 text-cream"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-cream/10 bg-forest-deep/95 px-4 py-4 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-cream"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-sm bg-gold px-4 py-3 text-sm font-semibold text-forest-deep"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
