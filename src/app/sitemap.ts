import type { MetadataRoute } from "next";
import { serviceAreas } from "@/data/areas";
import { blogPosts } from "@/data/blog";
import { services } from "@/data/services";
import { siteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified on evergreen routes: stamping build time on every page
  // tells crawlers everything changed on every deploy, which dilutes the
  // signal on pages that actually did.
  const staticRoutes = [
    "",
    "/services",
    "/areas",
    "/gallery",
    "/reviews",
    "/about",
    "/quote",
    "/contact",
    "/blog",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
  }));

  const areaRoutes = serviceAreas.map((area) => ({
    url: `${siteUrl}/areas/${area.slug}`,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes, ...blogRoutes];
}
