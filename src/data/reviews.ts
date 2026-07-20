export type GoogleReview = {
  id: string;
  author: string;
  rating: 5;
  date: string;
  text: string;
  /** Optional service context shown as a subtle label */
  service?: string;
};

export const googleRating = {
  ratingValue: 5.0,
  reviewCount: 24,
  bestRating: 5,
  worstRating: 1,
} as const;

/** Featured Google reviews — replace with live GBP copy when Place details are confirmed. */
export const featuredReviews: GoogleReview[] = [
  {
    id: "r1",
    author: "Marcus T.",
    rating: 5,
    date: "2026-06-12",
    service: "Lawn Mowing & Maintenance",
    text: "Yard has never looked sharper. Clean edges, consistent schedule, and they actually listen when I ask for something different. Highly recommend.",
  },
  {
    id: "r2",
    author: "Elena R.",
    rating: 5,
    date: "2026-05-28",
    service: "Spring Cleanup",
    text: "Showed up on time, transformed an overgrown mess in one visit, and left the place spotless. Communication was excellent from quote to finish.",
  },
  {
    id: "r3",
    author: "David K.",
    rating: 5,
    date: "2026-05-03",
    service: "Landscaping",
    text: "Professional from the first walkthrough. Fair price, careful work around our beds and fence line, and the lawn looks like a different property.",
  },
  {
    id: "r4",
    author: "Priya S.",
    rating: 5,
    date: "2026-04-18",
    service: "Mulch & Beds",
    text: "Fresh mulch, tidy beds, and they treated our place like it was their own. Easy to book and easy to trust. Five stars.",
  },
  {
    id: "r5",
    author: "James W.",
    rating: 5,
    date: "2026-03-30",
    service: "Weekly Maintenance",
    text: "Reliable every week. Mowing, edging, and blow-off are done right — no shortcuts. Exactly what we wanted in a lawn care partner.",
  },
  {
    id: "r6",
    author: "Amanda L.",
    rating: 5,
    date: "2026-03-09",
    service: "Commercial Grounds",
    text: "Our storefront curb appeal improved immediately. On-time service and a crew that cares about the details customers notice.",
  },
];

export const homepageReviews = featuredReviews.slice(0, 3);
