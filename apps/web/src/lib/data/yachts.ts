import { db, yachts, yachtDestinations, destinations } from '@/lib/db';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { resolveImage, resolveImages } from './utils';

export interface YachtWithDestinations {
  id: string;
  name: string;
  slug: string;
  featured: boolean | null;
  type: 'motor' | 'sailing' | 'power-catamaran' | 'sailing-catamaran';
  heroImage: { url: string; alt?: string } | null;
  gallery: { url: string; alt?: string }[] | null;
  videoUrl: string | null;
  summary: string | null;
  description: string | null;
  length: string | null;
  beam: string | null;
  draft: string | null;
  year: number | null;
  yearRefitted: number | null;
  guests: number | null;
  cabins: number | null;
  crew: number | null;
  cruisingSpeed: string | null;
  highlights: string[] | null;
  fromPrice: number | null;
  currency: string | null;
  priceNote: string | null;
  destinations: Array<{ id: string; name: string; slug: string; heroImage: { url: string; alt?: string } | null }>;
  seoTitle: string | null;
  seoDescription: string | null;
}

function parseYacht(yacht: typeof yachts.$inferSelect): Omit<YachtWithDestinations, 'destinations'> {
  return {
    ...yacht,
    heroImage: resolveImage(yacht.heroImage ? JSON.parse(yacht.heroImage) : null),
    gallery: resolveImages(yacht.gallery ? JSON.parse(yacht.gallery) : null),
    highlights: yacht.highlights ? JSON.parse(yacht.highlights) : null,
  };
}

export async function getAllYachts() {
  const rows = db
    .select()
    .from(yachts)
    .orderBy(desc(yachts.featured), yachts.name)
    .all();

  return rows.map((yacht) => ({
    ...parseYacht(yacht),
    destinations: [],
  }));
}

export async function getFeaturedYachts(limit = 6) {
  const rows = db
    .select()
    .from(yachts)
    .where(eq(yachts.featured, true))
    .orderBy(yachts.name)
    .limit(limit)
    .all();

  return rows.map((yacht) => ({
    ...parseYacht(yacht),
    destinations: [],
  }));
}

export async function getYachtBySlug(slug: string): Promise<YachtWithDestinations | null> {
  const yacht = db.select().from(yachts).where(eq(yachts.slug, slug)).get();

  if (!yacht) return null;

  // Get destinations for this yacht with heroImage
  const yachtDests = db
    .select({
      id: destinations.id,
      name: destinations.name,
      slug: destinations.slug,
      heroImage: destinations.heroImage,
    })
    .from(yachtDestinations)
    .innerJoin(destinations, eq(yachtDestinations.destinationId, destinations.id))
    .where(eq(yachtDestinations.yachtId, yacht.id))
    .all();

  // Parse destination heroImage JSON
  const parsedDestinations = yachtDests.map(dest => ({
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    heroImage: dest.heroImage ? resolveImage(JSON.parse(dest.heroImage)) : null,
  }));

  return {
    ...parseYacht(yacht),
    destinations: parsedDestinations,
  };
}

export async function getYachtSlugs() {
  const rows = db.select({ slug: yachts.slug }).from(yachts).all();
  return rows.map((row) => ({ slug: row.slug }));
}
