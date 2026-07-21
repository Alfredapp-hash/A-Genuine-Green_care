import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DualCta } from "@/components/services/DualCta";
import { QuickAnswer } from "@/components/services/QuickAnswer";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts, getPost } from "@/data/blog";
import { site, siteUrl } from "@/data/site";
import { breadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  // The root layout template appends the site name — no manual suffix here,
  // or titles double up ("… | Genuine Green Care | Genuine Green Care").
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: site.legalName },
          publisher: { "@type": "Organization", name: site.legalName },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Tips", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <article>
        <header className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
              <Link href="/blog" className="hover:text-gold">
                Tips
              </Link>
              <span aria-hidden className="mx-2 text-cream/40">/</span>
              {post.category}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm text-cream/65">{formatDate(post.date)}</p>
          </div>
        </header>

        <div className="bg-paper px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-10">
            <QuickAnswer
              question={`What should I know about ${post.localSeoPhrase}?`}
              answer={post.excerpt}
            />
            {post.body.map((section) => (
              <section key={section.heading ?? section.paragraphs[0]}>
                {section.heading ? (
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {section.heading}
                  </h2>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={`text-base leading-relaxed text-charcoal/80 ${section.heading ? "mt-3" : ""}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <p className="border-t border-forest/10 pt-6 text-sm text-charcoal/65">
              Need help on your property?{" "}
              <Link href="/quote" className="font-semibold text-leaf hover:underline">
                Request a free quote
              </Link>{" "}
              or{" "}
              <Link href="/services" className="font-semibold text-leaf hover:underline">
                browse services
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
      <DualCta />
    </>
  );
}
