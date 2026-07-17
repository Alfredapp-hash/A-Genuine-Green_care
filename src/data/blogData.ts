// TODO: Update categories and sample articles for Saltwater Sprouts content
export type BlogCategory =
  | 'Early Learning'
  | 'Child Development'
  | 'Parenting Tips'
  | 'School Readiness'
  | 'Activities & Play'
  | 'Health & Wellness'
  | 'Center News'
  | 'Community'

export type BlogArticle = {
  id: string
  title: string
  slug: string
  category: BlogCategory
  excerpt: string
  readTime: string
  image: string
  imageAlt: string
  featured?: boolean
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Early Learning',
  'Child Development',
  'Parenting Tips',
  'School Readiness',
  'Activities & Play',
  'Health & Wellness',
  'Center News',
  'Community',
]

// TODO: Replace with live Supabase posts when Blog Studio is connected.
export const SAMPLE_ARTICLES: BlogArticle[] = [
  {
    id: 'a1',
    title: 'Why Play-Based Learning Matters in Early Childhood',
    slug: 'why-play-based-learning-matters',
    category: 'Early Learning',
    excerpt:
      'Research consistently shows that children learn best through purposeful play. Here is what that looks like at Saltwater Sprouts.',
    readTime: '5 min read',
    image: '/hero.jpg',
    imageAlt: 'Children engaged in play-based learning at Saltwater Sprouts',
    featured: true,
  },
  {
    id: 'a2',
    title: '5 Signs Your Child Is Ready for Preschool',
    slug: 'signs-child-ready-for-preschool',
    category: 'School Readiness',
    excerpt:
      'From self-care skills to social curiosity, here are the milestones that signal readiness for a structured early learning environment.',
    readTime: '4 min read',
    image: '/hero.jpg',
    imageAlt: 'Young child showing independence and readiness for preschool',
  },
  {
    id: 'a3',
    title: 'Building Healthy Routines for Young Children',
    slug: 'building-healthy-routines',
    category: 'Parenting Tips',
    excerpt:
      'Consistent daily routines give children a sense of security and prepare them for the structure of school.',
    readTime: '4 min read',
    image: '/hero.jpg',
    imageAlt: 'Parent and child building a morning routine together',
  },
]
