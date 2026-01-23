import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, homePage } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const page = db.select().from(homePage).get();
    return NextResponse.json(page || {});
  } catch (error) {
    console.error('Error fetching home page:', error);
    return NextResponse.json({ error: 'Failed to fetch home page' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existingPage = db.select().from(homePage).get();

    const updatedPage = {
      heroTitle: body.heroTitle || null,
      heroHighlight: body.heroHighlight || null,
      heroSubtitle: body.heroSubtitle || null,
      heroImage: body.heroImage || null,
      heroCtas: body.heroCtas || null,
      featuredYachtsTitle: body.featuredYachtsTitle || null,
      featuredYachtsSubtitle: body.featuredYachtsSubtitle || null,
      destinationsTitle: body.destinationsTitle || null,
      destinationsSubtitle: body.destinationsSubtitle || null,
      whyMediteranaTitle: body.whyMediteranaTitle || null,
      whyMediteranaSubtitle: body.whyMediteranaSubtitle || null,
      whyMediteranaFeatures: body.whyMediteranaFeatures || null,
      processTitle: body.processTitle || null,
      processSubtitle: body.processSubtitle || null,
      processSteps: body.processSteps || null,
      blogTitle: body.blogTitle || null,
      blogSubtitle: body.blogSubtitle || null,
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
      db.update(homePage).set(updatedPage).where(eq(homePage.id, 'home-page')).run();
    } else {
      db.insert(homePage).values({
        id: 'home-page',
        ...updatedPage,
      }).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating home page:', error);
    return NextResponse.json({ error: 'Failed to update home page' }, { status: 500 });
  }
}
