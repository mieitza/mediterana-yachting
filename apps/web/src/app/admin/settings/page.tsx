import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, siteSettings } from '@/lib/db';
import { SiteSettingsForm } from './SiteSettingsForm';

async function getSiteSettings() {
  return db.select().from(siteSettings).get();
}

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Site Settings" />

      <div className="flex-1 p-6 max-w-4xl">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
