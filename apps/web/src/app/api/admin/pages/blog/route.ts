import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, blogPage } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const page = db.select().from(blogPage).get();
    return NextResponse.json(page || {});
  } catch (error) {
    console.error('Error fetching blog page:', error);
    return NextResponse.json({ error: 'Failed to fetch blog page' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existingPage = db.select().from(blogPage).get();

    const updatedPage = {
      heroTitle: body.heroTitle || null,
      heroSubtitle: body.heroSubtitle || null,
      heroImage: body.heroImage || null,
      introTitle: body.introTitle || null,
      introDescription: body.introDescription || null,
      featuredTitle: body.featuredTitle || null,
      featuredSubtitle: body.featuredSubtitle || null,
      newsletterTitle: body.newsletterTitle || null,
      newsletterDescription: body.newsletterDescription || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoImage: body.seoImage || null,
      updatedAt: new Date(),
    };

    if (existingPage) {
      db.update(blogPage).set(updatedPage).where(eq(blogPage.id, 'blog-page')).run();
    } else {
      db.insert(blogPage).values({
        id: 'blog-page',
        ...updatedPage,
      }).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating blog page:', error);
    return NextResponse.json({ error: 'Failed to update blog page' }, { status: 500 });
  }
}
