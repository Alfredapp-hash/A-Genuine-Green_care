import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { site } from "@/data/site";
import "./globals.css";

// Every font-display usage in the codebase is font-semibold — shipping
// only the 600 weight keeps two font files out of the critical path.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://genuinegreencare.com"),
  title: {
    default: `${site.name} | Lawn Care & Landscaping`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  // "./" resolves per-route against metadataBase, giving every page a
  // self-referencing canonical without repeating it in each route.
  alternates: { canonical: "./" },
  openGraph: {
    title: site.legalName,
    description: site.description,
    type: "website",
    siteName: site.name,
    images: [{ url: "/avatar/owner-mower.webp", alt: `${site.name} owner on lawn mower` }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
    images: ["/avatar/owner-mower.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
