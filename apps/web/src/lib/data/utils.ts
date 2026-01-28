const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediteranayachting.com';

/**
 * Resolve image URLs - converts relative /uploads/ paths to absolute URLs
 * so Next.js image optimizer can fetch them through the reverse proxy.
 */
export function resolveImageUrl(url: string): string {
  if (url.startsWith('/uploads/')) {
    return `${baseUrl}${url}`;
  }
  return url;
}

export function resolveImage(image: { url: string; alt?: string } | null): { url: string; alt?: string } | null {
  if (!image) return null;
  return { ...image, url: resolveImageUrl(image.url) };
}

export function resolveImages(images: { url: string; alt?: string }[] | null): { url: string; alt?: string }[] | null {
  if (!images) return null;
  return images.map(img => ({ ...img, url: resolveImageUrl(img.url) }));
}
