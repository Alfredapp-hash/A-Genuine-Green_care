import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Quote received",
  // Post-submit confirmation — never useful in search results.
  robots: { index: false, follow: true },
};

export default function QuoteThanksPage() {
  return (
    <section className="bg-mist px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Thank you</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">
          Quote request received.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-charcoal/75">
          We’ll review your property details and follow up soon. Need something sooner? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-leaf hover:underline">
            {site.phone}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="inline-flex rounded-sm bg-forest px-5 py-3 text-sm font-semibold text-cream"
          >
            Browse services
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-sm border border-forest/20 px-5 py-3 text-sm font-semibold text-forest"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
