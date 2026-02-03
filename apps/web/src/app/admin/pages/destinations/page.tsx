import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, destinationsPage } from '@/lib/db';
import { DestinationsPageForm } from './DestinationsPageForm';

async function getDestinationsPage() {
  return db.select().from(destinationsPage).get();
}

export default async function AdminDestinationsPageEditor() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const page = await getDestinationsPage();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Edit Destinations Page" />

      <div className="flex-1 p-6 max-w-4xl overflow-y-auto">
        <DestinationsPageForm page={page} />
      </div>
    </div>
  );
}
