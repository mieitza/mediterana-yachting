// Shared types for yacht, destination, and post data
// These types work with both the admin and public-facing pages

export interface ImageData {
  url: string;
  alt?: string;
}

export interface YachtData {
  id: string;
  name: string;
  slug: string;
  featured?: boolean | null;
  type: 'motor' | 'sailing' | 'power-catamaran' | 'sailing-catamaran';
  heroImage: ImageData | null;
  gallery?: ImageData[] | null;
  videoUrl?: string | null;
  summary?: string | null;
  description?: string | null;
  length?: string | null;
  beam?: string | null;
  draft?: string | null;
  year?: number | null;
  guests?: number | null;
  cabins?: number | null;
  crew?: number | null;
  cruisingSpeed?: string | null;
  highlights?: string[] | null;
  fromPrice?: number | null;
  currency?: string | null;
  priceNote?: string | null;
  destinations?: Array<{ id: string; name: string; slug: string }>;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface DestinationData {
  id: string;
  name: string;
  slug: string;
  heroImage: ImageData | null;
  gallery?: ImageData[] | null;
  bestSeason?: string | null;
  highlights?: string[] | null;
  description?: string | null;
  itinerary?: string | null;
  recommendedYachts?: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
    heroImage: ImageData | null;
    fromPrice: number | null;
  }>;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage: ImageData | null;
  body?: string | null;
  tags?: string[] | null;
  author?: string | null;
  publishedAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  image: ImageData | null;
  bio?: string | null;
  email?: string | null;
  linkedin?: string | null;
  order?: number;
}

export interface HomePageData {
  heroTitle?: string | null;
  heroHighlight?: string | null;
  heroSubtitle?: string | null;
  heroImage?: ImageData | null;
  heroCtas?: Array<{ text: string; href: string; variant?: string }> | null;
  featuredYachtsTitle?: string | null;
  featuredYachtsSubtitle?: string | null;
  destinationsTitle?: string | null;
  destinationsSubtitle?: string | null;
  whyMediteranaTitle?: string | null;
  whyMediteranaSubtitle?: string | null;
  whyMediteranaFeatures?: Array<{ icon: string; title: string; description: string }> | null;
  processTitle?: string | null;
  processSubtitle?: string | null;
  processSteps?: Array<{ step?: string; icon?: string; title: string; description: string }> | null;
  blogTitle?: string | null;
  blogSubtitle?: string | null;
  ctaTitle?: string | null;
  ctaDescription?: string | null;
  ctaButtonText?: string | null;
  ctaButtonHref?: string | null;
  ctaBackgroundImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface AboutPageData {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: ImageData | null;
  storyTitle?: string | null;
  storyContent?: string | null;
  storyImage?: ImageData | null;
  statistics?: Array<{ value: string; label: string }> | null;
  valuesTitle?: string | null;
  valuesSubtitle?: string | null;
  values?: Array<{ icon: string; title: string; description: string }> | null;
  processTitle?: string | null;
  processSubtitle?: string | null;
  processSteps?: Array<{ step?: string; title: string; description: string }> | null;
  teamTitle?: string | null;
  teamSubtitle?: string | null;
  ctaTitle?: string | null;
  ctaDescription?: string | null;
  ctaButtonText?: string | null;
  ctaButtonHref?: string | null;
  ctaBackgroundImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface ContactPageData {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: ImageData | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  contactAddress?: string | null;
  officeHours?: Array<{ days: string; hours: string }> | null;
  timezoneNote?: string | null;
  formTitle?: string | null;
  formDescription?: string | null;
  faqTitle?: string | null;
  faqItems?: Array<{ question: string; answer: string }> | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}
