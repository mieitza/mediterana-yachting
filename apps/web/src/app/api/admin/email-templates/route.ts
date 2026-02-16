import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, emailTemplates } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = db.select().from(emailTemplates).get();
    return NextResponse.json(templates || {});
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Failed to fetch email templates' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const existing = db.select().from(emailTemplates).get();

    const data = {
      inquirySubject: body.inquirySubject || null,
      inquiryBody: body.inquiryBody || null,
      welcomeSubject: body.welcomeSubject || null,
      welcomeBody: body.welcomeBody || null,
      senderName: body.senderName || null,
      signatureText: body.signatureText || null,
      contactEmail: body.contactEmail || null,
      contactPhone: body.contactPhone || null,
      updatedAt: new Date(),
    };

    if (existing) {
      db.update(emailTemplates).set(data).where(eq(emailTemplates.id, 'email-templates')).run();
    } else {
      db.insert(emailTemplates).values({
        id: 'email-templates',
        ...data,
      }).run();
    }

    return NextResponse.json({ ...existing, ...data });
  } catch (error) {
    console.error('Error updating email templates:', error);
    return NextResponse.json({ error: 'Failed to update email templates' }, { status: 500 });
  }
}
