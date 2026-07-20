import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-mist px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">404</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ink">Page not found</h1>
        <p className="mt-4 text-lg text-charcoal/75">
          That page doesn’t exist — let’s get you back to the lawn.
        </p>
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
