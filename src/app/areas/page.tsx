import type { Metadata } from "next";
import Link from "next/link";
import { DualCta } from "@/components/services/DualCta";
import { serviceAreas } from "@/data/areas";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Service Areas",
  description: `${site.name} lawn care and landscaping service areas — find local mowing, cleanup, and outdoor care near you.`,
};

export default function AreasPage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Service areas
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Local routes. Local standards.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            We focus on dense neighborhood routes so every property gets consistent timing and a
            sharp finish. Serving {site.serviceAreaLabel.toLowerCase()}.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2">
          {serviceAreas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group border-t border-forest/15 pt-6"
            >
              <h2 className="text-2xl font-semibold text-ink group-hover:text-leaf">{area.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal/70">{area.intro}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-gold">
                Lawn care in {area.name} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <DualCta title="Not sure if we cover your street?" />
    </>
  );
}
