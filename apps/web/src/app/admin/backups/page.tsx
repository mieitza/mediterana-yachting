import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { BackupManager } from './BackupManager';

export default async function BackupsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Database Backups" />

      <div className="flex-1 p-6">
        <BackupManager />
      </div>
    </div>
  );
}
