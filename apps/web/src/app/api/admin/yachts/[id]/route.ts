import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, yachts, yachtDestinations, destinations } from '@/lib/db';
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
    const yacht = db.select().from(yachts).where(eq(yachts.id, id)).get();

    if (!yacht) {
      return NextResponse.json({ error: 'Yacht not found' }, { status: 404 });
    }

    // Get linked destinations
    const linkedDestinations = db
      .select({ destinationId: yachtDestinations.destinationId })
      .from(yachtDestinations)
      .where(eq(yachtDestinations.yachtId, id))
      .all();

    return NextResponse.json({
      ...yacht,
      destinationIds: linkedDestinations.map(d => d.destinationId),
    });
  } catch (error) {
    console.error('Error fetching yacht:', error);
    return NextResponse.json({ error: 'Failed to fetch yacht' }, { status: 500 });
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

    const existingYacht = db.select().from(yachts).where(eq(yachts.id, id)).get();

    if (!existingYacht) {
      return NextResponse.json({ error: 'Yacht not found' }, { status: 404 });
    }

    const updatedYacht = {
      name: body.name,
      slug: body.slug,
      type: body.type,
      featured: body.featured || false,
      heroImage: body.heroImage || null,
      gallery: body.gallery || null,
      videoUrl: body.videoUrl || null,
      summary: body.summary || null,
      description: body.description || null,
      length: body.length || null,
      beam: body.beam || null,
      draft: body.draft || null,
      year: body.year || null,
      yearRefitted: body.yearRefitted || null,
      guests: body.guests || null,
      cabins: body.cabins || null,
      crew: body.crew || null,
      cruisingSpeed: body.cruisingSpeed || null,
      highlights: body.highlights || null,
      fromPrice: body.fromPrice || null,
      currency: body.currency || 'EUR',
      priceNote: body.priceNote || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoImage: body.seoImage || null,
      updatedAt: new Date(),
    };

    db.update(yachts).set(updatedYacht).where(eq(yachts.id, id)).run();

    // Update destination links
    if (body.destinationIds !== undefined) {
      // Delete existing links
      db.delete(yachtDestinations).where(eq(yachtDestinations.yachtId, id)).run();

      // Add new links
      const destinationIds = body.destinationIds || [];
      for (const destinationId of destinationIds) {
        db.insert(yachtDestinations).values({
          id: nanoid(),
          yachtId: id,
          destinationId,
        }).run();
      }
    }

    return NextResponse.json({ ...existingYacht, ...updatedYacht, destinationIds: body.destinationIds });
  } catch (error) {
    console.error('Error updating yacht:', error);
    return NextResponse.json({ error: 'Failed to update yacht' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingYacht = db.select().from(yachts).where(eq(yachts.id, id)).get();

    if (!existingYacht) {
      return NextResponse.json({ error: 'Yacht not found' }, { status: 404 });
    }

    db.delete(yachts).where(eq(yachts.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting yacht:', error);
    return NextResponse.json({ error: 'Failed to delete yacht' }, { status: 500 });
  }
}
