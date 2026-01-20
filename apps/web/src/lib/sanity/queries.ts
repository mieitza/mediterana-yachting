import { groq } from "next-sanity";

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    _id,
    siteName,
    siteDescription,
    logo,
    socialLinks,
    contactEmail,
    contactPhone,
    "featuredYachts": featuredYachts[]->{
      _id,
      name,
      slug,
      type,
      heroImage,
      summary,
      specs,
      pricing
    }
  }
`;

// All Yachts
export const allYachtsQuery = groq`
  *[_type == "yacht"] | order(featured desc, name asc) {
    _id,
    name,
    slug,
    featured,
    type,
    heroImage,
    summary,
    specs,
    pricing,
    "destinations": destinations[]->{ _id, name, slug }
  }
`;

// Single Yacht
export const yachtBySlugQuery = groq`
  *[_type == "yacht" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    featured,
    type,
    heroImage,
    gallery,
    videoUrl,
    summary,
    description,
    specs,
    highlights,
    pricing,
    "destinations": destinations[]->{ _id, name, slug, heroImage }
  }
`;

// Yacht Slugs (for generateStaticParams)
export const yachtSlugsQuery = groq`
  *[_type == "yacht" && defined(slug.current)][].slug.current
`;

// All Destinations
export const allDestinationsQuery = groq`
  *[_type == "destination"] | order(name asc) {
    _id,
    name,
    slug,
    heroImage,
    bestSeason,
    highlights
  }
`;

// Single Destination
export const destinationBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    heroImage,
    gallery,
    bestSeason,
    highlights,
    description,
    itinerary,
    "featuredYachts": *[_type == "yacht" && references(^._id)] {
      _id,
      name,
      slug,
      type,
      heroImage,
      summary,
      specs,
      pricing
    }
  }
`;

// Destination Slugs
export const destinationSlugsQuery = groq`
  *[_type == "destination" && defined(slug.current)][].slug.current
`;

// All Posts
export const allPostsQuery = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    tags,
    publishedAt,
    author
  }
`;

// Single Post
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    body,
    tags,
    publishedAt,
    author
  }
`;

// Post Slugs
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

// Latest Posts (for homepage)
export const latestPostsQuery = groq`
  *[_type == "post" && publishedAt <= now()] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    tags,
    publishedAt
  }
`;

// Page by slug
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    sections
  }
`;

// Featured Yachts (for homepage)
export const featuredYachtsQuery = groq`
  *[_type == "yacht" && featured == true] | order(name asc)[0...6] {
    _id,
    name,
    slug,
    type,
    heroImage,
    summary,
    specs,
    pricing
  }
`;
