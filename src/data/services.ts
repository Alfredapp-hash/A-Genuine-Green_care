export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  heroLine: string;
  quickAnswer: {
    question: string;
    answer: string;
  };
  steps: { title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
  includes: string[];
};

export const services: Service[] = [
  {
    slug: "lawn-mowing",
    name: "Lawn Mowing & Maintenance",
    shortDescription: "Consistent cuts, sharp edges, and a clean blow-off on a schedule you can trust.",
    heroLine: "Weekly precision that keeps curb appeal locked in.",
    quickAnswer: {
      question: "Who handles reliable lawn mowing near me?",
      answer:
        "Genuine Green Care provides owner-operated lawn mowing and maintenance with clean edges, consistent timing, and careful cleanup every visit.",
    },
    steps: [
      { title: "Walk the property", detail: "We note obstacles, bed lines, and preferred cut height." },
      { title: "Cut & edge", detail: "Even mowing patterns with crisp sidewalk and driveway edges." },
      { title: "Clean finish", detail: "Blow-off hardscapes so the yard looks finished, not rushed." },
    ],
    faqs: [
      {
        question: "How often do you mow?",
        answer: "Most homes are weekly in peak season, with flexible bi-weekly options as growth slows.",
      },
      {
        question: "Do you edge and blow off?",
        answer: "Yes — edging and hardscape blow-off are part of every maintenance visit.",
      },
      {
        question: "What if it rains on service day?",
        answer: "We reschedule as soon as conditions are safe and keep you updated.",
      },
    ],
    includes: ["Mowing", "Edging", "Trimming", "Blow-off"],
  },
  {
    slug: "landscaping",
    name: "Landscaping & Design",
    shortDescription: "Plantings, beds, and outdoor upgrades planned for how you actually live outside.",
    heroLine: "Thoughtful landscaping that looks intentional — and lasts.",
    quickAnswer: {
      question: "Where can I get landscaping help for my yard?",
      answer:
        "Genuine Green Care designs and installs landscaping upgrades — from refreshed beds to full plant packages — with clear scopes and honest estimates.",
    },
    steps: [
      { title: "Site consult", detail: "Sun, soil, drainage, and how you use the space." },
      { title: "Simple plan", detail: "A clear scope with materials and timeline before work starts." },
      { title: "Install & finish", detail: "Careful install, clean edges, and a yard ready to enjoy." },
    ],
    faqs: [
      {
        question: "Do you handle design and install?",
        answer: "Yes. We plan plantings and bed layouts, then install with clean finishing work.",
      },
      {
        question: "Can you work with an existing layout?",
        answer: "Absolutely — many projects refresh what you already have instead of starting over.",
      },
    ],
    includes: ["Bed design", "Planting", "Soil prep", "Finishing mulch"],
  },
  {
    slug: "mulch-beds",
    name: "Mulch & Bed Care",
    shortDescription: "Fresh mulch, defined edges, and beds that look maintained — not forgotten.",
    heroLine: "Beds that frame the lawn the right way.",
    quickAnswer: {
      question: "Who can refresh mulch beds around my home?",
      answer:
        "Genuine Green Care redefines bed edges, weeds carefully, and installs fresh mulch for a clean, finished look.",
    },
    steps: [
      { title: "Edge & weed", detail: "Clean bed lines and remove competing growth." },
      { title: "Prep soil", detail: "Level and prepare for even mulch coverage." },
      { title: "Mulch install", detail: "Consistent depth and a tidy finish against turf and hardscape." },
    ],
    faqs: [
      {
        question: "What mulch do you use?",
        answer: "We recommend mulch based on look, longevity, and what fits your property — then install it evenly.",
      },
      {
        question: "How often should beds be refreshed?",
        answer: "Most homes look best with an annual refresh, plus touch-ups as needed.",
      },
    ],
    includes: ["Bed edging", "Weeding", "Mulch install", "Cleanup"],
  },
  {
    slug: "seasonal-cleanup",
    name: "Spring & Fall Cleanup",
    shortDescription: "Leaf removal, debris haul-off, and seasonal resets that get the property ready.",
    heroLine: "Seasonal resets without the weekend grind.",
    quickAnswer: {
      question: "Who does spring and fall yard cleanup?",
      answer:
        "Genuine Green Care handles leaf removal, debris cleanup, and seasonal property resets so your yard starts each season clean.",
    },
    steps: [
      { title: "Assess the load", detail: "Leaves, limbs, beds, and hardscape clutter." },
      { title: "Clear & haul", detail: "Thorough cleanup with debris removed from the site." },
      { title: "Ready for next season", detail: "A clean slate for mowing, mulch, or winter rest." },
    ],
    faqs: [
      {
        question: "Do you haul debris away?",
        answer: "Yes — cleanup includes removing debris so you’re not left with piles at the curb unless you prefer otherwise.",
      },
      {
        question: "Can cleanup be bundled with mulch?",
        answer: "Yes. Many homeowners combine fall/spring cleanup with bed refresh for one efficient visit.",
      },
    ],
    includes: ["Leaf removal", "Debris haul-off", "Bed tidy", "Hardscape clear"],
  },
  {
    slug: "fertilization",
    name: "Fertilization & Weed Control",
    shortDescription: "Healthier turf programs that thicken the lawn and push back weeds over the season.",
    heroLine: "Greener growth with a plan — not a one-off spray.",
    quickAnswer: {
      question: "Who offers lawn fertilization and weed control?",
      answer:
        "Genuine Green Care provides seasonal fertilization and weed-control programs tailored to your turf and neighborhood conditions.",
    },
    steps: [
      { title: "Turf check", detail: "Identify grass type, stress areas, and weed pressure." },
      { title: "Program plan", detail: "A seasonal schedule matched to growth cycles." },
      { title: "Apply & monitor", detail: "Timely applications with follow-up guidance." },
    ],
    faqs: [
      {
        question: "Is this safe for pets?",
        answer: "We follow label guidance and advise when it’s clear for pets and kids to return to the lawn.",
      },
      {
        question: "How soon will I see results?",
        answer: "Color and density typically improve over successive applications as the program builds.",
      },
    ],
    includes: ["Seasonal apps", "Weed targeting", "Turf feeding", "Progress check-ins"],
  },
  {
    slug: "aeration",
    name: "Aeration & Overseeding",
    shortDescription: "Relieve compacted soil and thicken thin turf for a healthier lawn next season.",
    heroLine: "Deeper roots. Thicker turf. Better recovery.",
    quickAnswer: {
      question: "Do you offer lawn aeration and overseeding?",
      answer:
        "Yes — Genuine Green Care aerates compacted lawns and overseeds thin areas to improve density and resilience.",
    },
    steps: [
      { title: "Core aeration", detail: "Open the soil so air, water, and nutrients reach the roots." },
      { title: "Overseed", detail: "Apply seed where coverage is thin or stressed." },
      { title: "Aftercare", detail: "Simple watering and mowing guidance for strong establishment." },
    ],
    faqs: [
      {
        question: "When is the best time to aerate?",
        answer: "Cool-season lawns usually benefit most in fall; we’ll recommend timing for your grass type.",
      },
      {
        question: "Will there be cores on the lawn?",
        answer: "Yes — soil cores break down naturally and help return nutrients to the turf.",
      },
    ],
    includes: ["Core aeration", "Overseeding", "Aftercare tips"],
  },
  {
    slug: "hardscape-lite",
    name: "Hardscape Lite",
    shortDescription: "Small hardscape upgrades — edging, paths, and tidy stone work that finishes the yard.",
    heroLine: "Clean structure where the lawn meets the home.",
    quickAnswer: {
      question: "Can you help with light hardscaping?",
      answer:
        "Genuine Green Care handles light hardscape upgrades like decorative edging, simple paths, and finishing stone details that complete a landscape.",
    },
    steps: [
      { title: "Define the need", detail: "Edging, path, or finishing detail around beds and turf." },
      { title: "Set base & lines", detail: "Proper prep so the install stays true." },
      { title: "Install & blend", detail: "Finished work that connects lawn, beds, and home." },
    ],
    faqs: [
      {
        question: "Do you build large patios or retaining walls?",
        answer: "We focus on light hardscape that complements lawn and landscape care. Larger structural builds can be scoped case by case.",
      },
    ],
    includes: ["Edging", "Simple paths", "Stone accents", "Site cleanup"],
  },
  {
    slug: "commercial-grounds",
    name: "Commercial Grounds",
    shortDescription: "Dependable curb appeal for storefronts, offices, and small commercial sites.",
    heroLine: "Property presentation that looks open for business.",
    quickAnswer: {
      question: "Who maintains commercial lawn and grounds?",
      answer:
        "Genuine Green Care maintains commercial grounds with reliable scheduling, sharp presentation, and clear communication for property managers.",
    },
    steps: [
      { title: "Site standards", detail: "Align on frequency, access, and presentation goals." },
      { title: "Route service", detail: "Consistent visits that keep the property camera-ready." },
      { title: "Report & adjust", detail: "Simple updates when something needs attention." },
    ],
    faqs: [
      {
        question: "Do you work after hours?",
        answer: "When needed for high-traffic sites, we can discuss timing that minimizes disruption.",
      },
      {
        question: "Can multiple properties be on one plan?",
        answer: "Yes — we can structure multi-site maintenance with shared scheduling.",
      },
    ],
    includes: ["Scheduled mowing", "Edge & detail", "Seasonal cleanup", "Manager updates"],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
