import { Hero } from "@/components/hero/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="bg-paper px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
            Next up
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            Services, Google reviews, and quote flow coming in the next build pass.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal/75">
            Scaffold and hero mower intro are live. The rest of the Thomas Marine–level site
            layers on from here.
          </p>
        </div>
      </section>
    </>
  );
}
