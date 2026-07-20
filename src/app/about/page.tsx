import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DualCta } from "@/components/services/DualCta";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet the owner behind ${site.legalName} — hands-on lawn care built on clean edges and clear communication.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">About</p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Owner-operated. Detail-obsessed.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            {site.legalName} exists for homeowners who want reliable care — not a revolving door of
            crews who don’t know their property.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            <Image
              src="/avatar/owner-mower.webp"
              alt={`${site.name} owner on a lawn mower`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              {site.owner.role}
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-ink">
              Care you can put a face to.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/75">{site.owner.blurb}</p>
            <p className="mt-4 text-base leading-relaxed text-charcoal/75">
              From the first quote to the last blow-off, the standard is simple: show up when we
              say we will, cut clean, communicate clearly, and leave the property looking finished.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Owner-operated accountability",
                "Clean edges every visit",
                "Honest estimates",
                "Google-reviewed service",
              ].map((item) => (
                <li
                  key={item}
                  className="border-t border-forest/15 pt-3 text-sm font-medium text-charcoal/80"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex rounded-sm bg-gold px-5 py-3 text-sm font-bold text-forest-deep"
              >
                Get a free quote
              </Link>
              <Link
                href="/reviews"
                className="inline-flex rounded-sm border border-forest/20 px-5 py-3 text-sm font-semibold text-forest"
              >
                Read Google reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-semibold text-ink">How we work</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Clear scope",
                detail: "You know what’s included before work starts — no surprise add-ons.",
              },
              {
                title: "Route discipline",
                detail: "Properties are scheduled with enough time to finish the details right.",
              },
              {
                title: "Finished look",
                detail: "Edges, blow-off, and a property that looks cared for from the street.",
              },
            ].map((step, index) => (
              <li key={step.title} className="border-t border-forest/15 pt-5">
                <p className="font-display text-sm font-semibold text-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <DualCta title="Ready to work with us?" />
    </>
  );
}
