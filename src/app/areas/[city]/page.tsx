import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DualCta } from "@/components/services/DualCta";
import { FaqList } from "@/components/services/FaqList";
import { QuickAnswer } from "@/components/services/QuickAnswer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArea, serviceAreas } from "@/data/areas";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ city: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const area = getArea(city);
  if (!area) return {};

  return {
    title: `Lawn Care in ${area.name}`,
    description: area.intro,
  };
}

export default async function AreaDetailPage({ params }: Props) {
  const { city } = await params;
  const area = getArea(city);
  if (!area) notFound();

  const faqs = [
    {
      question: `Do you offer weekly mowing in ${area.name}?`,
      answer: `Yes. ${site.name} runs regular maintenance routes in ${area.name} with edging and blow-off included.`,
    },
    {
      question: `Can I book landscaping or cleanup in ${area.name}?`,
      answer: `Absolutely — mulch, seasonal cleanup, fertilization, and landscaping projects are available throughout ${area.name}.`,
    },
    {
      question: "How do I get a quote?",
      answer: "Share your address and the services you need on our quote form — we’ll follow up with clear pricing.",
    },
  ];

  return (
    <>
      <JsonLd
        data={faqJsonLd([
          { question: area.quickAnswer.question, answer: area.quickAnswer.answer },
          ...faqs,
        ])}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Areas", path: "/areas" },
          { name: area.name, path: `/areas/${area.slug}` },
        ])}
      />

      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            <Link href="/areas" className="hover:text-gold">
              Areas
            </Link>
            <span className="mx-2 text-cream/40">/</span>
            {area.name}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
            Lawn care in {area.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/80">{area.intro}</p>
        </div>
      </section>

      <section className="bg-paper px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          <QuickAnswer
            question={area.quickAnswer.question}
            answer={area.quickAnswer.answer}
          />

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              What we do in {area.name}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {area.highlights.map((item) => (
                <li
                  key={item}
                  className="border-t border-forest/15 pt-4 text-sm font-medium text-charcoal/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Popular services</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-base font-semibold text-ink hover:text-leaf"
                  >
                    {service.name} in {area.name}
                  </Link>
                  <p className="mt-1 text-sm text-charcoal/65">{service.shortDescription}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">FAQ</h2>
            <div className="mt-6">
              <FaqList items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <DualCta title={`Get a free quote for ${area.name}`} />
    </>
  );
}
