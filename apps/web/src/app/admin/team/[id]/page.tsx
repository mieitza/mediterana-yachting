import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TeamMemberForm } from '../TeamMemberForm';
import { db, teamMembers } from '@/lib/db';
import { eq } from 'drizzle-orm';

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

async function getTeamMember(id: string) {
  return db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();
}

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const member = await getTeamMember(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title={`Edit: ${member.name}`} />

      <div className="flex-1 p-6 max-w-4xl">
        <TeamMemberForm member={member} />
      </div>
    </div>
  );
}
