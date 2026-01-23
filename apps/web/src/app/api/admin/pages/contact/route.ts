import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, contactPage } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const page = db.select().from(contactPage).get();
    return NextResponse.json(page || {});
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return NextResponse.json({ error: 'Failed to fetch contact page' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existingPage = db.select().from(contactPage).get();

    const updatedPage = {
      heroTitle: body.heroTitle || null,
      heroSubtitle: body.heroSubtitle || null,
      heroImage: body.heroImage || null,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
      contactWhatsapp: body.contactWhatsapp || null,
      contactAddress: body.contactAddress || null,
      officeHours: body.officeHours || null,
      timezoneNote: body.timezoneNote || null,
      formTitle: body.formTitle || null,
      formDescription: body.formDescription || null,
      faqTitle: body.faqTitle || null,
      faqItems: body.faqItems || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoImage: body.seoImage || null,
      updatedAt: new Date(),
    };

    if (existingPage) {
      db.update(contactPage).set(updatedPage).where(eq(contactPage.id, 'contact-page')).run();
    } else {
      db.insert(contactPage).values({
        id: 'contact-page',
        ...updatedPage,
      }).run();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contact page:', error);
    return NextResponse.json({ error: 'Failed to update contact page' }, { status: 500 });
  }
}
