import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DestinationForm } from '../DestinationForm';

export default async function NewDestinationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add New Destination" />

      <div className="flex-1 p-6 max-w-4xl">
        <DestinationForm />
      </div>
    </div>
  );
}
