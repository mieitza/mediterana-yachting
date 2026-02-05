import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listBackups, createBackup } from '@/lib/backup';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backups = await listBackups();
    return NextResponse.json(backups);
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const description = body.description as string | undefined;

    const backup = await createBackup(description);
    return NextResponse.json(backup, { status: 201 });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}
