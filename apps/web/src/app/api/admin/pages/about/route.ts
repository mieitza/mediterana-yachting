import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, aboutPage } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const page = db.select().from(aboutPage).get();
    return NextResponse.json(page || {});
  } catch (error) {
    console.error('Error fetching about page:', error);
    return NextResponse.json({ error: 'Failed to fetch about page' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existingPage = db.select().from(aboutPage).get();

    const updatedPage = {
      heroTitle: body.heroTitle || null,
      heroSubtitle: body.heroSubtitle || null,
      heroImage: body.heroImage || null,
      storyTitle: body.storyTitle || null,
      storyContent: body.storyContent || null,
      storyImage: body.storyImage || null,
      statistics: body.statistics || null,
      valuesTitle: body.valuesTitle || null,
      valuesSubtitle: body.valuesSubtitle || null,
      values: body.values || null,
      processTitle: body.processTitle || null,
      processSubtitle: body.processSubtitle || null,
      processSteps: body.processSteps || null,
      teamTitle: body.teamTitle || null,
      teamSubtitle: body.teamSubtitle || null,
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
      db.update(aboutPage).set(updatedPage).where(eq(aboutPage.id, 'about-page')).run();
    } else {
      db.insert(aboutPage).values({
        id: 'about-page',
        ...updatedPage,
      }).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating about page:', error);
    return NextResponse.json({ error: 'Failed to update about page' }, { status: 500 });
  }
}
