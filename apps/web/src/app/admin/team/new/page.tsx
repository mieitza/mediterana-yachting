import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TeamMemberForm } from '../TeamMemberForm';

export default async function NewTeamMemberPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add Team Member" />

      <div className="flex-1 p-6 max-w-4xl">
        <TeamMemberForm />
      </div>
    </div>
  );
}
