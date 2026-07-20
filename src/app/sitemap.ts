import type { MetadataRoute } from "next";
import { serviceAreas } from "@/data/areas";
import { blogPosts } from "@/data/blog";
import { services } from "@/data/services";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://genuinegreencare.com";

export default function sitemap(): MetadataRoute.Sitemap {
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
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
  }));

  const areaRoutes = serviceAreas.map((area) => ({
    url: `${baseUrl}/areas/${area.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes, ...blogRoutes];
}
