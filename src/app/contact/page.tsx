import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.legalName} for lawn care questions, scheduling, or a free estimate.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-forest-deep px-4 pb-14 pt-28 text-cream sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
            Contact
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold sm:text-5xl">
            Let’s talk about your property.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/75">
            Questions, scheduling, or a quick gut-check before you request a quote — we’re here.
          </p>
        </div>
      </section>

      <section className="bg-paper px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Reach us directly</h2>
            <ul className="mt-6 space-y-4 text-base text-charcoal/80">
              <li>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
                  Phone
                </span>
                <a href={site.phoneHref} className="mt-1 font-semibold text-ink hover:text-leaf">
                  {site.phone}
                </a>
              </li>
              <li>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
                  Email
                </span>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 font-semibold text-ink hover:text-leaf"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
                  Service area
                </span>
                <p className="mt-1">{site.serviceAreaLabel}</p>
              </li>
              <li>
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-leaf">
                  Hours
                </span>
                <ul className="mt-2 space-y-1">
                  {site.hours.map((row) => (
                    <li key={row.day} className="flex justify-between gap-6 max-w-xs">
                      <span>{row.day}</span>
                      <span className="font-medium text-ink">{row.time}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <a
              href={site.googleShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-sm font-semibold text-gold hover:text-leaf"
            >
              Find us on Google →
            </a>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Send a message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
