'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight, Clock, Wrench, Anchor } from 'lucide-react'
import PremiumButton from '@/components/PremiumButton'
import { SAMPLE_ARTICLES, BLOG_CATEGORIES, type BlogArticle, type BlogCategory } from '@/data/blogData'
import NewsletterSignup from '@/components/home/NewsletterSignup'

// ── Supabase live post shape (from server component) ─────────────────────────
export type Post = {
  id: string
  title: string
  slug: string
  summary: string | null
  cover_image_url: string | null
  published_at: string | null
  tags: string[] | null
  category: string
  featured?: boolean
}

// ── Normalise live Supabase post → BlogArticle shape ─────────────────────────
function livePostToArticle(p: Post, index: number): BlogArticle {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: (p.category ?? 'Boat Maintenance') as BlogCategory,
    excerpt: p.summary ?? '',
    readTime: '5 min read',
    image: p.cover_image_url ?? '/hero.PNG',
    imageAlt: p.title,
    featured: index === 0,
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function CategoryPill({ label }: { label: string }) {
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ backgroundColor: 'rgba(201,168,76,0.14)', color: '#c9a84c' }}
    >
      {label}
    </span>
  )
}

function ReadTime({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">
      <Clock size={11} />
      {time}
    </span>
  )
}

// ── Featured editorial trio (large left + two stacked right) ─────────────────
function EditorialFeatured({ articles }: { articles: BlogArticle[] }) {
  const [main, second, third] = articles
  if (!main) return null
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      {/* Large left card */}
      <Link
        href={`/blog/${main.slug}`}
        className="lg:col-span-3 group relative rounded-2xl overflow-hidden bg-[#081d3a] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[400px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main.image}
          alt={main.imageAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e21]/90 via-[#040e21]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040e21]/60 to-transparent" />
        <div className="relative mt-auto p-7 md:p-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <CategoryPill label={main.category} />
            <ReadTime time={main.readTime} />
          </div>
          <h3
            className="text-xl md:text-2xl font-bold leading-snug text-white mb-3 group-hover:underline"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {main.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-2">{main.excerpt}</p>
          <span
            className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
            style={{ color: '#c9a84c' }}
          >
            Read the Guide <ChevronRight size={14} />
          </span>
        </div>
        {/* Gold left accent bar on hover */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: '#c9a84c' }}
        />
      </Link>

      {/* Two stacked right cards */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {[second, third].filter(Boolean).map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col flex-1"
            style={{ minHeight: '180px' }}
          >
            <div className="relative h-36 overflow-hidden bg-[#0d2b55] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image}
                alt={article.imageAlt}
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040e21]/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <CategoryPill label={article.category} />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3
                className="text-sm md:text-base font-bold leading-snug mb-2 group-hover:underline"
                style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">{article.excerpt}</p>
              <div className="flex items-center justify-between mt-auto">
                <ReadTime time={article.readTime} />
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all"
                  style={{ color: '#1d4ed8' }}
                >
                  Read More <ChevronRight size={12} />
                </span>
              </div>
            </div>
            {/* Suzuki blue top accent bar on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: '#1d4ed8' }}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Article grid card ─────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <article>
      <Link
        href={`/blog/${article.slug}`}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-[#0d2b55] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.imageAlt}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040e21]/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <CategoryPill label={article.category} />
          </div>
          {/* Blue top accent on hover */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: '#1d4ed8' }}
          />
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3
            className="text-base font-bold leading-snug mb-2 group-hover:underline"
            style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
            <ReadTime time={article.readTime} />
            <span
              className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all"
              style={{ color: '#1d4ed8' }}
            >
              Read More <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function BlogClientPage({ livePosts }: { livePosts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // TODO: When Blog Studio is connected, merge live posts into articles array.
  // Live Supabase posts take priority; sample articles fill in the rest.
  const articles: BlogArticle[] =
    livePosts.length > 0
      ? livePosts.map(livePostToArticle)
      : SAMPLE_ARTICLES

  const featuredArticles = articles.slice(0, 3)
  const gridArticles = articles.slice(3)

  const filteredGrid =
    activeCategory === 'All'
      ? gridArticles
      : gridArticles.filter((a) => a.category === activeCategory)

  // Split grid: first 3 before mid-CTA, rest after
  const gridTop = filteredGrid.slice(0, 3)
  const gridBottom = filteredGrid.slice(3)

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[520px] md:min-h-[620px] flex items-end pb-16 md:pb-20 text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/hero.PNG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* TODO: Replace /hero.PNG with a dedicated editorial hero image when available */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(4,14,33,0.92) 0%, rgba(4,14,33,0.75) 45%, rgba(4,14,33,0.35) 80%, transparent 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e21]/70 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 w-full">
          <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#c9a84c' }}>
            Thomas Marine Knowledge Hub
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-5 leading-tight drop-shadow-lg max-w-3xl"
            style={{ fontFamily: 'var(--font-display), Georgia, serif', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          >
            Smarter Boating<br className="hidden sm:block" /> Starts Here.
          </h1>
          <p className="text-gray-200 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            Suzuki guidance, service tips, and buying advice from the Thomas Marine team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <PremiumButton href="/contact" variant="primary">
              <Wrench size={15} /> Schedule Service
            </PremiumButton>
            <PremiumButton href="/inventory" variant="ghost">
              <Anchor size={15} /> View Inventory
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. FEATURED EDITORIAL SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-5 md:px-8 bg-white" id="articles">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-0.5" style={{ backgroundColor: '#c9a84c' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a84c' }}>
              Editor&apos;s Picks
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#0d2b55' }}>
              Start Here
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Our most useful guides for Suzuki owners, boat buyers, and anyone preparing for the season.
            </p>
          </div>
          <div className="mt-8">
            <EditorialFeatured articles={featuredArticles} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. CATEGORY FILTER BAR
      ══════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {/* TODO: When Blog Studio is live, make these dynamic from Supabase category counts */}
            <PremiumButton
              type="button"
              onClick={() => setActiveCategory('All')}
              variant={activeCategory === 'All' ? 'filterActive' : 'filter'}
              size="sm"
              shape="rounded"
              className="shrink-0 uppercase tracking-wider text-xs"
            >
              All
            </PremiumButton>
            {BLOG_CATEGORIES.map((cat: BlogCategory) => (
              <PremiumButton
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                variant={activeCategory === cat ? 'filterActive' : 'filter'}
                size="sm"
                shape="rounded"
                className="shrink-0 uppercase tracking-wider text-xs whitespace-nowrap"
              >
                {cat}
              </PremiumButton>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. ARTICLE GRID — TOP (before mid CTA)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-5 md:px-8" style={{ backgroundColor: '#f4f6f9' }}>
        <div className="max-w-7xl mx-auto">
          {gridTop.length === 0 && gridBottom.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400 font-medium mb-3">No articles in this category yet.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="text-sm font-bold underline"
                style={{ color: '#0d2b55' }}
              >
                View all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridTop.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. SERVICE CTA BAND
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-16 px-5 md:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #040e21 0%, #0d2b55 55%, #1a4080 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
          }}
        />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="w-6 h-0.5" style={{ backgroundColor: '#c9a84c' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a84c' }}>Service Department</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Need Service You Can Trust?
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg">
              From diagnostics to Suzuki outboard service, Thomas Marine helps keep your boat reliable
              and ready for the water — with honest estimates before any work begins.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <PremiumButton href="/contact" variant="primary">
              <Wrench size={15} /> Schedule Service
            </PremiumButton>
            <PremiumButton href="/services" variant="ghost">
              View Services <ChevronRight size={14} />
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4b. ARTICLE GRID — BOTTOM (after mid CTA)
      ══════════════════════════════════════════════════════════════════ */}
      {gridBottom.length > 0 && (
        <section className="py-14 px-5 md:px-8" style={{ backgroundColor: '#f4f6f9' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridBottom.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          6. INVENTORY CTA BAND
      ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative py-16 px-5 md:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #040e21 0%, #0d2b55 55%, #1a4080 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
          }}
        />
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="w-6 h-0.5" style={{ backgroundColor: '#c9a84c' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c9a84c' }}>Boat Inventory</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Shopping for Your Next Boat?
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg">
              Browse trusted pre-owned inventory and get honest guidance from a team that knows
              boats inside and out.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <PremiumButton href="/inventory" variant="primary">
              <Anchor size={15} /> View Inventory
            </PremiumButton>
            <PremiumButton href="/contact" variant="ghost">
              Contact Our Team <ChevronRight size={14} />
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. NEWSLETTER — wave video from homepage
      ══════════════════════════════════════════════════════════════════ */}
      <NewsletterSignup
        eyebrow="Thomas Marine Knowledge Hub"
        title="Get Practical Marine Tips From Thomas Marine"
        subtitle="Stay connected with service reminders, buying guidance, seasonal boating tips, and updates from the Thomas Marine team."
        source="blog"
      />
    </>
  )
}

