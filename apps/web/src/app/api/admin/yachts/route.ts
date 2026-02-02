import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, yachts, yachtDestinations } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allYachts = await db.select().from(yachts).all();
    return NextResponse.json(allYachts);
  } catch (error) {
    console.error('Error fetching yachts:', error);
    return NextResponse.json({ error: 'Failed to fetch yachts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newYacht = {
      id: nanoid(),
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
    };

    db.insert(yachts).values(newYacht).run();

    // Add destination links
    const destinationIds = body.destinationIds || [];
    for (const destinationId of destinationIds) {
      db.insert(yachtDestinations).values({
        id: nanoid(),
        yachtId: newYacht.id,
        destinationId,
      }).run();
    }

    return NextResponse.json({ ...newYacht, destinationIds }, { status: 201 });
  } catch (error) {
    console.error('Error creating yacht:', error);
    return NextResponse.json({ error: 'Failed to create yacht' }, { status: 500 });
  }
}
