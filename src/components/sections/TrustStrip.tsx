"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GoogleRatingBadge } from "@/components/reviews/GoogleRatingBadge";
import { site } from "@/data/site";

export function TrustStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      className="border-y border-forest/10 bg-mist px-4 py-10 sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">
            Trusted locally
          </p>
          <p className="font-display mt-2 text-2xl font-semibold text-ink">
            Owner-operated care for {site.serviceAreaLabel.toLowerCase()}.
          </p>
        </div>
        <GoogleRatingBadge />
      </div>
    </motion.section>
  );
}
