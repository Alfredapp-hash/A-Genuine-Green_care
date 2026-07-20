import Link from "next/link";

export function PagePlaceholder({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <section className="bg-mist px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
          Coming next
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ink">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-charcoal/75">{summary}</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-sm bg-forest px-5 py-3 text-sm font-semibold text-cream"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
