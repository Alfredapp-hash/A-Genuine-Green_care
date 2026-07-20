import { site } from "@/data/site";

export type ServiceArea = {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  quickAnswer: {
    question: string;
    answer: string;
  };
  highlights: string[];
};

/** Seed areas — rename to match confirmed GBP cities. */
export const serviceAreas: ServiceArea[] = [
  {
    slug: "northside",
    name: "Northside",
    headline: `Lawn care in Northside | ${site.name}`,
    intro:
      "Reliable mowing, clean edges, and seasonal care for Northside homes that want curb appeal without the weekend chore list.",
    quickAnswer: {
      question: "Who provides lawn care in Northside?",
      answer: `${site.legalName} provides owner-operated lawn mowing, landscaping, and seasonal cleanup for Northside properties with clear scheduling and careful finish work.`,
    },
    highlights: ["Weekly mowing routes", "Bed & mulch refresh", "Spring/fall cleanup"],
  },
  {
    slug: "west-end",
    name: "West End",
    headline: `Lawn care in West End | ${site.name}`,
    intro:
      "From tidy weekly cuts to landscaping upgrades, West End properties get consistent care that shows from the street.",
    quickAnswer: {
      question: "Looking for lawn care in West End?",
      answer: `${site.name} serves West End with maintenance programs, fertilization options, and cleanup services built around reliable communication.`,
    },
    highlights: ["Maintenance programs", "Fertilization options", "Detail-focused edges"],
  },
  {
    slug: "riverside",
    name: "Riverside",
    headline: `Lawn care in Riverside | ${site.name}`,
    intro:
      "Riverside lawns stay sharp with scheduled maintenance, seasonal resets, and landscaping help when you’re ready to upgrade.",
    quickAnswer: {
      question: "Who does lawn care near Riverside?",
      answer: `${site.legalName} handles Riverside lawn care — mowing, aeration, mulch beds, and seasonal cleanup — with honest estimates and dependable service.`,
    },
    highlights: ["Aeration & overseed", "Mulch & beds", "Commercial-friendly timing"],
  },
  {
    slug: "oak-hills",
    name: "Oak Hills",
    headline: `Lawn care in Oak Hills | ${site.name}`,
    intro:
      "Oak Hills homeowners trust us for precise cuts, clean property lines, and outdoor care that feels personal — because it is.",
    quickAnswer: {
      question: "Is there owner-operated lawn care in Oak Hills?",
      answer: `Yes. ${site.name} is owner-operated lawn care and landscaping serving Oak Hills with weekly maintenance and project work.`,
    },
    highlights: ["Owner on the details", "Weekly routes", "Quote-ready projects"],
  },
];

export function getArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug);
}
