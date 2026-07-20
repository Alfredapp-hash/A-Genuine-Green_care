export const site = {
  name: "Genuine Green Care",
  legalName: "Genuine Green Care Landscaping",
  tagline: "Lawns that look genuinely cared for.",
  description:
    "Owner-operated lawn care and landscaping — precise mowing, clean edges, and outdoor spaces you’ll be proud of.",
  googleShareUrl: "https://share.google/EIhQxHnRs7MOPqu1K",
  phone: "(555) 010-2040",
  phoneHref: "tel:+15550102040",
  email: "hello@genuinegreencare.com",
  // Replace with confirmed GBP service area once Place details are locked.
  serviceAreaLabel: "Your neighborhood & surrounding communities",
  cityPlaceholder: "Local",
  hours: [
    { day: "Monday–Friday", time: "7:00 AM – 6:00 PM" },
    { day: "Saturday", time: "8:00 AM – 2:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  owner: {
    name: "Owner-operator",
    role: "Founder",
    blurb:
      "Hands-on lawn care with an eye for clean edges and honest communication — the kind of service you’d want next door.",
  },
} as const;

export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/areas", label: "Areas" },
  { href: "/blog", label: "Tips" },
  { href: "/contact", label: "Contact" },
] as const;
