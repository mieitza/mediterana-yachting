import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, newsletterSubscribers } from '@/lib/db';
import { desc, eq, sql, and, gte } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all subscribers
    const allSubscribers = db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt))
      .all();

    // Get stats
    const totalCount = db
      .select({ count: sql<number>`count(*)` })
      .from(newsletterSubscribers)
      .get();

    const activeCount = db
      .select({ count: sql<number>`count(*)` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'active'))
      .get();

    const unsubscribedCount = db
      .select({ count: sql<number>`count(*)` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'unsubscribed'))
      .get();

    // This month's new subscribers
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = db
      .select({ count: sql<number>`count(*)` })
      .from(newsletterSubscribers)
      .where(
        and(
          gte(newsletterSubscribers.createdAt, startOfMonth),
          eq(newsletterSubscribers.status, 'active')
        )
      )
      .get();

    return NextResponse.json({
      subscribers: allSubscribers,
      stats: {
        total: totalCount?.count || 0,
        active: activeCount?.count || 0,
        unsubscribed: unsubscribedCount?.count || 0,
        thisMonth: thisMonthCount?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
    }

    db.delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, id))
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}
