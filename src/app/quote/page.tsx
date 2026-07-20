import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Free Quote",
  description: `Request a free lawn care quote from ${site.name}. Tell us about your property and the services you need.`,
};

export default function QuotePage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Free quote
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Tell us about the yard. We’ll handle the rest.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            Share a few details for a clear estimate — no pressure, no vague pricing.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <QuoteForm />
          <aside className="h-fit bg-mist px-6 py-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              Prefer to talk?
            </p>
            <a
              href={site.phoneHref}
              className="mt-3 block font-display text-2xl font-semibold text-ink hover:text-leaf"
            >
              {site.phone}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Call during business hours for the fastest reply, or leave a message anytime.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-charcoal/75">
              {site.hours.map((row) => (
                <li key={row.day} className="flex justify-between gap-4 border-t border-forest/10 pt-2">
                  <span>{row.day}</span>
                  <span className="font-medium text-ink">{row.time}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
