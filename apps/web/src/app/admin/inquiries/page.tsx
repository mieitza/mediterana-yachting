import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, inquiries } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { Mail, Eye, MessageSquare, Archive, Clock } from 'lucide-react';
import Link from 'next/link';

async function getInquiries() {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).all();
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
  archived: 'bg-slate-100 text-slate-800',
};

const statusIcons = {
  new: Mail,
  read: Eye,
  replied: MessageSquare,
  archived: Archive,
};

export default async function InquiriesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const allInquiries = await getInquiries();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Inquiries" />

      <div className="flex-1 p-6">
        {allInquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No inquiries yet
            </h3>
            <p className="text-sm text-slate-500">
              When visitors submit the contact form, their inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {allInquiries.map((inquiry) => {
                  const StatusIcon = statusIcons[inquiry.status];
                  return (
                    <tr key={inquiry.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[inquiry.status]
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {inquiry.status.charAt(0).toUpperCase() +
                            inquiry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {inquiry.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="text-sm text-slate-500">
                            {inquiry.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900 line-clamp-2 max-w-md">
                          {inquiry.message}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock className="h-4 w-4" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/inquiries/${inquiry.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </Link>
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
