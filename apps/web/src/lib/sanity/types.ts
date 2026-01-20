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
