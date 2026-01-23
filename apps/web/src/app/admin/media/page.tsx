import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, images } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { MediaLibrary } from './MediaLibrary';

async function getImages() {
  return db.select().from(images).orderBy(desc(images.createdAt)).all();
}

export default async function AdminMediaPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const allImages = await getImages();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Media Library" />

      <div className="flex-1 p-6">
        <MediaLibrary images={allImages} />
      </div>
    </div>
  );
}
