export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  localSeoPhrase: string;
  body: { heading?: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-professional-lawn-mowing-pays-off",
    title: "Why Professional Lawn Mowing Pays Off",
    excerpt:
      "Consistent cuts, sharper edges, and healthier turf — what you actually get when maintenance is done on a real schedule.",
    date: "2026-05-12",
    category: "Maintenance",
    localSeoPhrase: "professional lawn mowing",
    body: [
      {
        paragraphs: [
          "Homeowners often treat mowing as a Saturday chore until the lawn starts looking tired mid-season. Professional maintenance is less about owning a bigger mower and more about rhythm: the right height, clean edges, and showing up before growth gets ahead of you.",
          "When cuts are consistent, turf thickens, weeds have less room, and curb appeal stays camera-ready without the scramble.",
        ],
      },
      {
        heading: "What changes with a real route",
        paragraphs: [
          "A weekly or bi-weekly route means your property is planned into a schedule — not squeezed between other weekend errands. Edges stay defined. Clippings are managed. Hardscapes get blown off so the finish looks intentional.",
          "That reliability is why neighbors notice the difference before they notice the price.",
        ],
      },
      {
        heading: "When to bring in a pro",
        paragraphs: [
          "If your lawn is growing faster than you can keep up, if edges look ragged, or if you’d rather spend weekends elsewhere — that’s the moment professional mowing pays for itself.",
        ],
      },
    ],
  },
  {
    slug: "seasonal-lawn-care-checklist",
    title: "Seasonal Lawn Care Checklist",
    excerpt:
      "A practical spring-to-fall checklist for healthier turf: cleanup, feeding, aeration, and the maintenance habits that stick.",
    date: "2026-04-03",
    category: "Seasonal",
    localSeoPhrase: "seasonal lawn care",
    body: [
      {
        paragraphs: [
          "Great lawns are built in seasons, not single Saturdays. Use this checklist to keep maintenance, feeding, and recovery work in the right order.",
        ],
      },
      {
        heading: "Spring",
        paragraphs: [
          "Clear winter debris, redefine bed edges, and resume mowing at the right height for your grass type. Address bare patches early before summer heat locks them in.",
        ],
      },
      {
        heading: "Summer",
        paragraphs: [
          "Keep a steady mowing cadence, raise height slightly in heat stress, and water deeply when needed. Spot-treat weeds instead of waiting for a full takeover.",
        ],
      },
      {
        heading: "Fall",
        paragraphs: [
          "Leaf cleanup, aeration, and overseeding set next year’s density. Fresh mulch and a final fertilization pass help turf recover before dormancy.",
        ],
      },
    ],
  },
  {
    slug: "lawn-care-near-you-what-to-look-for",
    title: "Lawn Care Near You: What to Look For",
    excerpt:
      "A local SEO–friendly guide to choosing a lawn care partner — communication, finish quality, and proof that shows up on Google.",
    date: "2026-03-18",
    category: "Local Guide",
    localSeoPhrase: "lawn care near you",
    body: [
      {
        paragraphs: [
          "Searching “lawn care near me” returns plenty of options. The better filter is whether a company operates like a neighbor you’ll see again next week — clear quotes, reliable timing, and a finish that holds up from the street.",
        ],
      },
      {
        heading: "Signals of a strong local partner",
        paragraphs: [
          "Look for owner-operated accountability, Google reviews that mention communication and cleanup, and service pages that explain process — not just price.",
          "Ask how rain days are handled, whether edging and blow-off are included, and how quickly quotes come back.",
        ],
      },
      {
        heading: "Start with a simple quote",
        paragraphs: [
          "Share your address, the services you need, and a couple photos if the yard is overgrown. A good team will respond with a clear scope — not pressure.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
