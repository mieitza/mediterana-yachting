import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { deleteBackup, getBackupInfo } from '@/lib/backup';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const filename = `${id}.db`;
    const backup = await getBackupInfo(filename);

    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    return NextResponse.json(backup);
  } catch (error) {
    console.error('Error fetching backup:', error);
    return NextResponse.json({ error: 'Failed to fetch backup' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const filename = `${id}.db`;

    // Verify backup exists
    const backup = await getBackupInfo(filename);
    if (!backup) {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }

    await deleteBackup(filename);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
  }
}
