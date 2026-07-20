"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { services } from "@/data/services";

export function ServicesTeaser() {
  const reduceMotion = useReducedMotion();
  const featured = services.slice(0, 4);

  return (
    <section className="bg-mist px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Services</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              Care that covers the whole property.
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-leaf underline-offset-4 hover:underline"
          >
            View all services
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {featured.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block border-t border-forest/15 pt-5 transition"
              >
                <h3 className="text-xl font-semibold text-ink group-hover:text-leaf">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  {service.shortDescription}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold">
                  Learn more →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
