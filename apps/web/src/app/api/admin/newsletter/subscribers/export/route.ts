import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, newsletterSubscribers } from '@/lib/db';
import { eq } from 'drizzle-orm';

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Escape quotes by doubling them, and wrap in quotes if contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get active subscribers only for export
    const subscribers = db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.status, 'active'))
      .all();

    // Build CSV
    const headers = ['Email', 'Name', 'Source', 'Status', 'Subscribed At'];
    const rows = subscribers.map((sub) => [
      escapeCSV(sub.email),
      escapeCSV(sub.name),
      escapeCSV(sub.source),
      escapeCSV(sub.status),
      formatDate(sub.createdAt),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const date = new Date().toISOString().split('T')[0];
    const filename = `newsletter-subscribers-${date}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    return NextResponse.json({ error: 'Failed to export subscribers' }, { status: 500 });
  }
}
