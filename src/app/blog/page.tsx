import type { Metadata } from "next";
import Link from "next/link";
import { DualCta } from "@/components/services/DualCta";
import { blogPosts } from "@/data/blog";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Lawn Tips",
  description: `Seasonal lawn care tips and local guides from ${site.name}.`,
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function BlogPage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Tips</p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Practical lawn care guidance.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            Local SEO pillars and seasonal advice for homeowners who want a healthier, sharper
            yard.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-10">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border-t border-forest/15 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
                {post.category} · {formatDate(post.date)}
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink sm:text-3xl">
                <Link href={`/blog/${post.slug}`} className="hover:text-leaf">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal/70">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-gold hover:text-leaf"
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <DualCta />
    </>
  );
}
