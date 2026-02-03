import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, destinations, destinationRecommendedYachts } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allDestinations = await db.select().from(destinations).all();
    return NextResponse.json(allDestinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newDestination = {
      id: nanoid(),
      name: body.name,
      slug: body.slug,
      heroImage: body.heroImage || null,
      gallery: body.gallery || null,
      bestSeason: body.bestSeason || null,
      highlights: body.highlights || null,
      description: body.description || null,
      itinerary: body.itinerary || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoImage: body.seoImage || null,
    };

    db.insert(destinations).values(newDestination).run();

    // Handle recommended yachts
    const yachtIds = body.recommendedYachtIds || [];
    for (let i = 0; i < yachtIds.length; i++) {
      db.insert(destinationRecommendedYachts).values({
        id: nanoid(),
        destinationId: newDestination.id,
        yachtId: yachtIds[i],
        order: i,
      }).run();
    }

    return NextResponse.json({ ...newDestination, recommendedYachtIds: yachtIds }, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
