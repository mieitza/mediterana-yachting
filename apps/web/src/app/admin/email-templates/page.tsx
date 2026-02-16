import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, emailTemplates } from '@/lib/db';
import { EmailTemplatesForm } from './EmailTemplatesForm';

export default async function EmailTemplatesPage() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  let templates = null;
  try {
    templates = db.select().from(emailTemplates).get();
  } catch {
    // Table may not exist yet
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Email Templates</h1>
        <p className="mt-1 text-slate-500">
          Customize the emails sent to customers and newsletter subscribers.
        </p>
      </div>
      <EmailTemplatesForm templates={templates} />
    </div>
  );
}
