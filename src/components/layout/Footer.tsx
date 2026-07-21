import Link from "next/link";
import { navLinks, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
            {site.description}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">
            Explore
          </p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="text-sm text-cream/80 hover:text-cream">
                Free Quote
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <a href={site.phoneHref} className="hover:text-cream">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-cream">
                {site.email}
              </a>
            </li>
            <li>{site.serviceAreaLabel}</li>
            <li>
              <a
                href={site.googleShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-soft hover:text-gold"
              >
                See us on Google
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream/70 sm:px-6">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
