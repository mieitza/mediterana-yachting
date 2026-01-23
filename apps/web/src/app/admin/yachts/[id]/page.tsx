import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { YachtForm } from '../YachtForm';
import { db, yachts } from '@/lib/db';
import { eq } from 'drizzle-orm';

interface EditYachtPageProps {
  params: Promise<{ id: string }>;
}

async function getYacht(id: string) {
  return db.select().from(yachts).where(eq(yachts.id, id)).get();
}

export default async function EditYachtPage({ params }: EditYachtPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const yacht = await getYacht(id);

  if (!yacht) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title={`Edit: ${yacht.name}`} />

      <div className="flex-1 p-6 max-w-4xl">
        <YachtForm yacht={yacht} />
      </div>
    </div>
  );
}
