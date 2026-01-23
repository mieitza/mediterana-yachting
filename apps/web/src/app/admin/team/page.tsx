import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, teamMembers } from '@/lib/db';
import { asc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Users, GripVertical } from 'lucide-react';
import { DeleteTeamMemberButton } from './DeleteTeamMemberButton';

async function getTeamMembers() {
  return db.select().from(teamMembers).orderBy(asc(teamMembers.order), asc(teamMembers.name)).all();
}

export default async function AdminTeamPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const allTeamMembers = await getTeamMembers();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Team Members" />

      <div className="flex-1 p-6">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">
            {allTeamMembers.length} team member{allTeamMembers.length !== 1 ? 's' : ''} total
          </p>
          <Link href="/admin/team/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </Link>
        </div>

        {/* Team Members Table */}
        {allTeamMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No team members yet
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by adding your first team member.
            </p>
            <Link href="/admin/team/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 w-10">
                    #
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Member
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Contact
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allTeamMembers.map((member, index) => {
                  const image = member.image ? JSON.parse(member.image) : null;

                  return (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center text-slate-400">
                          <GripVertical className="h-4 w-4 mr-1" />
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {image?.url ? (
                            <img
                              src={image.url}
                              alt={image.alt || member.name}
                              className="h-10 w-10 object-cover rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <span className="font-medium text-slate-900">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {member.role}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="text-primary hover:underline block">
                              {member.email}
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary">
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/team/${member.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteTeamMemberButton id={member.id} name={member.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
