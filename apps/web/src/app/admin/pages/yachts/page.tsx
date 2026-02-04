import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, yachtsPage } from '@/lib/db';
import { YachtsPageForm } from './YachtsPageForm';

async function getYachtsPage() {
  return db.select().from(yachtsPage).get();
}

export default async function AdminYachtsPageEditor() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const page = await getYachtsPage();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Edit Yachts Page" />

      <div className="flex-1 p-6 max-w-4xl overflow-y-auto">
        <YachtsPageForm page={page} />
      </div>
    </div>
  );
}
