import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, siteSettings } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = db.select().from(siteSettings).get();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existingSettings = db.select().from(siteSettings).get();

    const updatedSettings = {
      siteName: body.siteName,
      siteDescription: body.siteDescription || null,
      logo: body.logo || null,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
      contactAddress: body.contactAddress || null,
      instagram: body.instagram || null,
      facebook: body.facebook || null,
      linkedin: body.linkedin || null,
      twitter: body.twitter || null,
      youtube: body.youtube || null,
      whatsapp: body.whatsapp || null,
      footerTagline: body.footerTagline || null,
      footerLinks: body.footerLinks || null,
      copyrightText: body.copyrightText || null,
      defaultSeoImage: body.defaultSeoImage || null,
      twitterHandle: body.twitterHandle || null,
      updatedAt: new Date(),
    };

    if (existingSettings) {
      db.update(siteSettings).set(updatedSettings).where(eq(siteSettings.id, 'site-settings')).run();
    } else {
      db.insert(siteSettings).values({
        id: 'site-settings',
        ...updatedSettings,
      }).run();
    }

    return NextResponse.json({ ...existingSettings, ...updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
