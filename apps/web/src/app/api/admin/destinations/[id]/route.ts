import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, destinations, destinationRecommendedYachts } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const destination = db.select().from(destinations).where(eq(destinations.id, id)).get();

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Get recommended yacht IDs
    const recommendedYachts = db
      .select({ yachtId: destinationRecommendedYachts.yachtId })
      .from(destinationRecommendedYachts)
      .where(eq(destinationRecommendedYachts.destinationId, id))
      .orderBy(destinationRecommendedYachts.order)
      .all();

    const recommendedYachtIds = recommendedYachts.map(r => r.yachtId);

    return NextResponse.json({ ...destination, recommendedYachtIds });
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existingDestination = db.select().from(destinations).where(eq(destinations.id, id)).get();

    if (!existingDestination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const updatedDestination = {
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
      updatedAt: new Date(),
    };

    db.update(destinations).set(updatedDestination).where(eq(destinations.id, id)).run();

    // Handle recommended yachts
    if (body.recommendedYachtIds !== undefined) {
      // Delete existing recommended yachts
      db.delete(destinationRecommendedYachts)
        .where(eq(destinationRecommendedYachts.destinationId, id))
        .run();

      // Insert new recommended yachts with order
      const yachtIds = body.recommendedYachtIds || [];
      for (let i = 0; i < yachtIds.length; i++) {
        db.insert(destinationRecommendedYachts).values({
          id: nanoid(),
          destinationId: id,
          yachtId: yachtIds[i],
          order: i,
        }).run();
      }
    }

    return NextResponse.json({ ...existingDestination, ...updatedDestination, recommendedYachtIds: body.recommendedYachtIds || [] });
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingDestination = db.select().from(destinations).where(eq(destinations.id, id)).get();

    if (!existingDestination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    db.delete(destinations).where(eq(destinations.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 });
  }
}
