import Link from "next/link";
import { site } from "@/data/site";

export function DualCta({
  title = "Ready for a sharper yard?",
  description = "Tell us about your property — we’ll reply with a clear next step and an honest estimate.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-forest-deep px-4 py-14 text-cream sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="mt-3 text-base leading-relaxed text-cream/75">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/quote"
            className="inline-flex rounded-sm bg-gold px-5 py-3 text-sm font-bold text-forest-deep transition hover:bg-gold-soft"
          >
            Get a Free Quote
          </Link>
          <a
            href={site.phoneHref}
            className="inline-flex rounded-sm border border-cream/30 px-5 py-3 text-sm font-semibold text-cream transition hover:border-cream/55"
          >
            Call {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
