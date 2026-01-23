import { db, destinations, destinationRecommendedYachts, yachts } from '@/lib/db';
import { eq } from 'drizzle-orm';

export interface DestinationWithYachts {
  id: string;
  name: string;
  slug: string;
  heroImage: { url: string; alt?: string } | null;
  gallery: { url: string; alt?: string }[] | null;
  bestSeason: string | null;
  highlights: string[] | null;
  description: string | null;
  itinerary: string | null;
  recommendedYachts: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
    heroImage: { url: string; alt?: string } | null;
    fromPrice: number | null;
  }>;
  seoTitle: string | null;
  seoDescription: string | null;
}

function parseDestination(dest: typeof destinations.$inferSelect): Omit<DestinationWithYachts, 'recommendedYachts'> {
  return {
    ...dest,
    heroImage: dest.heroImage ? JSON.parse(dest.heroImage) : null,
    gallery: dest.gallery ? JSON.parse(dest.gallery) : null,
    highlights: dest.highlights ? JSON.parse(dest.highlights) : null,
  };
}

export async function getAllDestinations() {
  const rows = db.select().from(destinations).orderBy(destinations.name).all();

  return rows.map((dest) => ({
    ...parseDestination(dest),
    recommendedYachts: [],
  }));
}

export async function getDestinationBySlug(slug: string): Promise<DestinationWithYachts | null> {
  const dest = db.select().from(destinations).where(eq(destinations.slug, slug)).get();

  if (!dest) return null;

  // Get recommended yachts for this destination
  const recommended = db
    .select({
      id: yachts.id,
      name: yachts.name,
      slug: yachts.slug,
      type: yachts.type,
      heroImage: yachts.heroImage,
      fromPrice: yachts.fromPrice,
    })
    .from(destinationRecommendedYachts)
    .innerJoin(yachts, eq(destinationRecommendedYachts.yachtId, yachts.id))
    .where(eq(destinationRecommendedYachts.destinationId, dest.id))
    .orderBy(destinationRecommendedYachts.order)
    .all();

  return {
    ...parseDestination(dest),
    recommendedYachts: recommended.map((yacht) => ({
      ...yacht,
      heroImage: yacht.heroImage ? JSON.parse(yacht.heroImage) : null,
    })),
  };
}

export async function getDestinationSlugs() {
  const rows = db.select({ slug: destinations.slug }).from(destinations).all();
  return rows.map((row) => ({ slug: row.slug }));
}
