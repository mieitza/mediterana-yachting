import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DestinationForm } from '../DestinationForm';
import { db, destinations, destinationRecommendedYachts } from '@/lib/db';
import { eq } from 'drizzle-orm';

interface EditDestinationPageProps {
  params: Promise<{ id: string }>;
}

async function getDestination(id: string) {
  return db.select().from(destinations).where(eq(destinations.id, id)).get();
}

async function getRecommendedYachtIds(destinationId: string) {
  const rows = db
    .select({ yachtId: destinationRecommendedYachts.yachtId })
    .from(destinationRecommendedYachts)
    .where(eq(destinationRecommendedYachts.destinationId, destinationId))
    .orderBy(destinationRecommendedYachts.order)
    .all();
  return rows.map(r => r.yachtId);
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  const recommendedYachtIds = await getRecommendedYachtIds(id);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title={`Edit: ${destination.name}`} />

      <div className="flex-1 p-6 max-w-4xl">
        <DestinationForm destination={destination} recommendedYachtIds={recommendedYachtIds} />
      </div>
    </div>
  );
}
