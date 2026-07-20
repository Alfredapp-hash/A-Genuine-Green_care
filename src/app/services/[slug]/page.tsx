import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DualCta } from "@/components/services/DualCta";
import { FaqList } from "@/components/services/FaqList";
import { QuickAnswer } from "@/components/services/QuickAnswer";
import { ServiceSteps } from "@/components/services/ServiceSteps";
import { JsonLd } from "@/components/seo/JsonLd";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: `${service.name} in ${site.cityPlaceholder}`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={faqJsonLd(service.faqs)} />

      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            <Link href="/services" className="hover:text-gold">
              Services
            </Link>
            <span className="mx-2 text-cream/40">/</span>
            {service.name}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/80">
            {service.heroLine}
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-10">
            <QuickAnswer
              question={service.quickAnswer.question}
              answer={service.quickAnswer.answer}
            />
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">How it works</h2>
              <div className="mt-6">
                <ServiceSteps steps={service.steps} />
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">What’s included</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="border-t border-forest/10 pt-3 text-sm font-medium text-charcoal/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit bg-mist px-6 py-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">
              Related services
            </p>
            <ul className="mt-4 space-y-3">
              {services
                .filter((item) => item.slug !== service.slug)
                .slice(0, 5)
                .map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="text-sm font-semibold text-ink hover:text-leaf"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
            <Link
              href="/areas"
              className="mt-8 inline-block text-sm font-semibold text-gold hover:text-leaf"
            >
              See service areas →
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-paper px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-semibold text-ink">FAQ</h2>
          <div className="mt-6">
            <FaqList items={service.faqs} />
          </div>
        </div>
      </section>

      <DualCta
        title={`Get a quote for ${service.name.toLowerCase()}`}
        description="Share a few property details and we’ll follow up with pricing and availability."
      />
    </>
  );
}
