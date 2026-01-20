// External image type for URLs (no upload needed)
export interface ExternalImage {
  url: string;
  alt: string;
}

// Sanity image reference (for when using Sanity CDN)
export interface SanityImageReference {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

// Site Settings
export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  siteName: string;
  siteDescription: string;
  logo?: ExternalImage;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  contactEmail: string;
  contactPhone: string;
  featuredYachts?: Yacht[];
}

// Yacht
export interface Yacht {
  _id: string;
  _type: "yacht";
  name: string;
  slug: { current: string };
  featured: boolean;
  type: "motor" | "sailing" | "catamaran";
  heroImage: ExternalImage;
  gallery: ExternalImage[];
  videoUrl?: string;
  summary: string;
  description: any[]; // Portable Text
  specs: {
    length: number;
    beam?: number;
    draft?: number;
    year: number;
    guests: number;
    cabins: number;
    crew?: number;
    cruisingSpeed?: number;
  };
  highlights: string[];
  pricing?: {
    fromPrice?: number;
    currency: string;
    priceNote?: string;
  };
  destinations?: Destination[];
}

// Destination
export interface Destination {
  _id: string;
  _type: "destination";
  name: string;
  slug: { current: string };
  heroImage: ExternalImage;
  gallery: ExternalImage[];
  bestSeason: string;
  highlights: string[];
  description: any[]; // Portable Text
  itinerary: any[]; // Portable Text
  featuredYachts?: Yacht[];
}

// Blog Post
export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage: ExternalImage;
  body: any[]; // Portable Text
  tags: string[];
  publishedAt: string;
  author?: string;
}

// Page (for Home, About, Contact content)
export interface Page {
  _id: string;
  _type: "page";
  title: string;
  slug: { current: string };
  sections: PageSection[];
}

export interface PageSection {
  _key: string;
  _type: string;
  title?: string;
  subtitle?: string;
  content?: any[]; // Portable Text
  image?: ExternalImage;
  cta?: {
    label: string;
    href: string;
  };
}

// Team Member
export interface TeamMember {
  _id: string;
  _type: "teamMember";
  name: string;
  role: string;
  image: ExternalImage;
  bio: string;
  email?: string;
  linkedin?: string;
  order?: number;
}

// Home Page Content
export interface HomePage {
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroSubtitle?: string;
  heroImage?: ExternalImage;
  heroPrimaryCtaText?: string;
  heroPrimaryCtaLink?: string;
  heroSecondaryCtaText?: string;
  heroSecondaryCtaLink?: string;
  yachtsTitle?: string;
  yachtsSubtitle?: string;
  yachtsCtaText?: string;
  destinationsTitle?: string;
  destinationsSubtitle?: string;
  destinationsCtaText?: string;
  whyTitle?: string;
  whySubtitle?: string;
  whyFeatures?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
  blogTitle?: string;
  blogSubtitle?: string;
  blogCtaText?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaImage?: ExternalImage;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// About Page Content
export interface AboutPage {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: ExternalImage;
  storyTitle?: string;
  storyContent?: any[]; // Portable Text
  storyImage?: ExternalImage;
  storyCtaText?: string;
  storyCtaLink?: string;
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
  valuesTitle?: string;
  valuesSubtitle?: string;
  values?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: Array<{
    title?: string;
    description?: string;
  }>;
  teamTitle?: string;
  teamSubtitle?: string;
  teamMembers?: TeamMember[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// Contact Page Content
export interface ContactPage {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: ExternalImage;
  contactTitle?: string;
  contactDescription?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  address?: string;
  officeHours?: Array<{
    days?: string;
    hours?: string;
  }>;
  timezone?: string;
  formTitle?: string;
  formDescription?: string;
  faqTitle?: string;
  faqDescription?: string;
  faqs?: Array<{
    question?: string;
    answer?: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
}

// Inquiry Form Data
export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  interestType: "yacht" | "destination" | "general";
  yachtSlug?: string;
  yachtName?: string;
  destinationSlug?: string;
  destinationName?: string;
  dates?: string;
  turnstileToken: string;
}
