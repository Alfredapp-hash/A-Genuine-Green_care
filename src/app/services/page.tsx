import type { Metadata } from "next";
import Link from "next/link";
import { DualCta } from "@/components/services/DualCta";
import { services } from "@/data/services";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Lawn Care Services",
  description: `Explore ${site.name} services — mowing, landscaping, mulch, cleanup, fertilization, aeration, and commercial grounds care.`,
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Services
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Lawn care & landscaping, done right.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            From weekly maintenance to seasonal resets — every service is built around clean
            edges, clear communication, and results you’ll notice from the curb.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group border-t border-forest/15 pt-6 transition"
            >
              <h2 className="text-2xl font-semibold text-ink group-hover:text-leaf">
                {service.name}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal/70">
                {service.shortDescription}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-[0.12em] text-leaf/80">
                {service.includes.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="mt-5 inline-block text-sm font-semibold text-gold">
                View service →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <DualCta />
    </>
  );
}
