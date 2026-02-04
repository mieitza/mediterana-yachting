import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, yachtsPage } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const page = db.select().from(yachtsPage).get();
    return NextResponse.json(page || {});
  } catch (error) {
    console.error('Error fetching yachts page:', error);
    return NextResponse.json({ error: 'Failed to fetch yachts page' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existingPage = db.select().from(yachtsPage).get();

    const updatedPage = {
      heroTitle: body.heroTitle || null,
      heroSubtitle: body.heroSubtitle || null,
      heroImage: body.heroImage || null,
      introTitle: body.introTitle || null,
      introDescription: body.introDescription || null,
      faqTitle: body.faqTitle || null,
      faqSubtitle: body.faqSubtitle || null,
      ctaTitle: body.ctaTitle || null,
      ctaDescription: body.ctaDescription || null,
      ctaButtonText: body.ctaButtonText || null,
      ctaButtonHref: body.ctaButtonHref || null,
      ctaBackgroundImage: body.ctaBackgroundImage || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoImage: body.seoImage || null,
      updatedAt: new Date(),
    };

    if (existingPage) {
      db.update(yachtsPage).set(updatedPage).where(eq(yachtsPage.id, 'yachts-page')).run();
    } else {
      db.insert(yachtsPage).values({
        id: 'yachts-page',
        ...updatedPage,
      }).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating yachts page:', error);
    return NextResponse.json({ error: 'Failed to update yachts page' }, { status: 500 });
  }
}
