import type { Metadata } from "next";
import { Nunito, Pacifico } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Saltwater Sprouts Early Learning Center",
    template: "%s | Saltwater Sprouts",
  },
  description:
    "Affordable childcare and early childhood education for infants through age 4 in Georgetown County, SC. Safe, inclusive, and enriching — where every child can grow.",
  keywords: ["childcare", "early learning", "Georgetown County", "preschool", "daycare", "infants", "toddlers", "South Carolina"],
  openGraph: {
    title: "Saltwater Sprouts Early Learning Center",
    description: "Where little ones learn and thrive — Georgetown County, SC.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${pacifico.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
