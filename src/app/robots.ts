import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /quote/thanks is excluded via meta noindex, not disallow — a disallow
    // would stop crawlers from ever seeing the noindex directive.
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
