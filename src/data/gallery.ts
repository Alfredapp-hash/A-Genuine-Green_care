export type GalleryProject = {
  id: string;
  title: string;
  location: string;
  service: string;
  beforeLabel: string;
  afterLabel: string;
  summary: string;
  tone: "morning" | "midday" | "dusk";
};

export const galleryProjects: GalleryProject[] = [
  {
    id: "g1",
    title: "Weekly maintenance reset",
    location: "Northside",
    service: "Lawn Mowing & Maintenance",
    beforeLabel: "Uneven growth, soft edges",
    afterLabel: "Even cut, crisp lines",
    summary: "Brought a neglected weekly route back to sharp curb appeal in two visits.",
    tone: "morning",
  },
  {
    id: "g2",
    title: "Front bed refresh",
    location: "Oak Hills",
    service: "Mulch & Bed Care",
    beforeLabel: "Thin mulch, fuzzy borders",
    afterLabel: "Defined beds, fresh mulch",
    summary: "Re-edged beds, cleared weeds, and installed a clean mulch layer.",
    tone: "midday",
  },
  {
    id: "g3",
    title: "Spring property cleanup",
    location: "Riverside",
    service: "Spring & Fall Cleanup",
    beforeLabel: "Winter debris load",
    afterLabel: "Ready for growing season",
    summary: "Full debris haul-off and hardscape clear before peak mowing season.",
    tone: "dusk",
  },
  {
    id: "g4",
    title: "Storefront grounds polish",
    location: "West End",
    service: "Commercial Grounds",
    beforeLabel: "Patchy presentation",
    afterLabel: "Camera-ready curb appeal",
    summary: "Commercial schedule tuned for consistent weekday presentation.",
    tone: "morning",
  },
];
