import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { restoreBackup, getBackupInfo } from '@/lib/backup';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
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

    // Restore creates an automatic pre-restore backup
    await restoreBackup(filename);

    return NextResponse.json({
      success: true,
      message: `Database restored from ${filename}. A pre-restore backup was created.`,
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}
