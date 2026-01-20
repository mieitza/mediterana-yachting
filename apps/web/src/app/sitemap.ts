import { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { yachtSlugsQuery, destinationSlugsQuery, postSlugsQuery } from "@/lib/sanity/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mediteranayachting.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/yachts`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic yacht pages
  let yachtPages: MetadataRoute.Sitemap = [];
  try {
    const yachtSlugs = await sanityClient.fetch<string[]>(yachtSlugsQuery);
    yachtPages = (yachtSlugs || []).map((slug) => ({
      url: `${baseUrl}/yachts/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching yacht slugs for sitemap:", error);
  }

  // Dynamic destination pages
  let destinationPages: MetadataRoute.Sitemap = [];
  try {
    const destinationSlugs = await sanityClient.fetch<string[]>(destinationSlugsQuery);
    destinationPages = (destinationSlugs || []).map((slug) => ({
      url: `${baseUrl}/destinations/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching destination slugs for sitemap:", error);
  }

  // Dynamic blog post pages
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const postSlugs = await sanityClient.fetch<string[]>(postSlugsQuery);
    postPages = (postSlugs || []).map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching post slugs for sitemap:", error);
  }

  return [...staticPages, ...yachtPages, ...destinationPages, ...postPages];
}
