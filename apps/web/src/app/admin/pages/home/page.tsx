import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, homePage } from '@/lib/db';
import { HomePageForm } from './HomePageForm';

async function getHomePage() {
  return db.select().from(homePage).get();
}

export default async function AdminHomePageEditor() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const page = await getHomePage();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Edit Homepage" />

      <div className="flex-1 p-6 max-w-4xl overflow-y-auto">
        <HomePageForm page={page} />
      </div>
    </div>
  );
}
