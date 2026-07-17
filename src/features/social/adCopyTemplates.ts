// ─────────────────────────────────────────────────────────────────────────────
// Meta / Facebook ad copy templates for childcare center campaigns
// ─────────────────────────────────────────────────────────────────────────────

export type MetaAdCopyTemplate = {
  id: string
  label: string
  primaryText: string
  headline: string
  description: string
  suggestedCta: string
  defaultUtmCampaignSlug: string
}

export const META_AD_COPY_TEMPLATES: MetaAdCopyTemplate[] = [
  {
    id: 'enrollment_spotlight',
    label: 'Enrollment Spotlight',
    primaryText:
      'Now enrolling at Saltwater Sprouts Early Learning Center! We offer nurturing, play-based programs for infants through pre-K. Schedule a tour and see why families in our community trust us.',
    headline: 'Now Enrolling — Saltwater Sprouts',
    description: 'Play-based early learning programs',
    suggestedCta: 'LEARN_MORE',
    defaultUtmCampaignSlug: 'enrollment-spotlight',
  },
  {
    id: 'tour_invite',
    label: 'Schedule a Tour',
    primaryText:
      'The best way to choose childcare is to see it in person. Saltwater Sprouts Early Learning Center welcomes families for in-person tours. Come meet our teachers, explore our classrooms, and ask all your questions.',
    headline: 'Schedule Your Tour Today',
    description: 'Meet our teachers & classrooms',
    suggestedCta: 'BOOK_NOW',
    defaultUtmCampaignSlug: 'tour-invite',
  },
  {
    id: 'curriculum_highlight',
    label: 'Curriculum Highlight',
    primaryText:
      'At Saltwater Sprouts, learning happens through play, exploration, and discovery. Our research-backed curriculum builds the cognitive, social, and emotional foundations your child needs to thrive.',
    headline: 'Learn Through Play — Our Curriculum',
    description: 'Research-backed early childhood education',
    suggestedCta: 'LEARN_MORE',
    defaultUtmCampaignSlug: 'curriculum-highlight',
  },
  {
    id: 'seasonal_program',
    label: 'Seasonal Program',
    primaryText:
      'Summer is around the corner! Saltwater Sprouts Early Learning Center offers engaging summer programs full of outdoor play, creative projects, and fun learning adventures for children of all ages.',
    headline: 'Summer Programs at Saltwater Sprouts',
    description: 'Fun, educational summer activities',
    suggestedCta: 'LEARN_MORE',
    defaultUtmCampaignSlug: 'seasonal-program',
  },
  {
    id: 'open_house',
    label: 'Open House Event',
    primaryText:
      "You're invited to our Open House! Visit Saltwater Sprouts Early Learning Center, meet the teaching team, and see our classrooms firsthand. Light refreshments provided. Families of all ages welcome.",
    headline: 'Open House at Saltwater Sprouts',
    description: 'RSVP for event details',
    suggestedCta: 'LEARN_MORE',
    defaultUtmCampaignSlug: 'open-house',
  },
  {
    id: 'parent_testimonial',
    label: 'Parent Testimonial',
    primaryText:
      'Families who choose Saltwater Sprouts tell us it feels like a second home for their children. Our caring staff, intentional curriculum, and warm community make all the difference. See what parents are saying.',
    headline: 'Why Families Love Saltwater Sprouts',
    description: 'Real stories from our community',
    suggestedCta: 'LEARN_MORE',
    defaultUtmCampaignSlug: 'parent-testimonial',
  },
]

export function getAdCopyTemplateById(id: string): MetaAdCopyTemplate | undefined {
  return META_AD_COPY_TEMPLATES.find((t) => t.id === id)
}
