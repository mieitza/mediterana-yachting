import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Check if Sanity is configured
export const isSanityConfigured = Boolean(projectId);

// Create clients only if configured
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: any) {
  if (!builder) return { url: () => "" };
  return builder.image(source);
}

// Preview client for draft content
export const previewClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;

export function getClient(preview = false): SanityClient | null {
  return preview ? previewClient : sanityClient;
}
