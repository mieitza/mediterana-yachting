import { db, contactPage } from '@/lib/db';
import { ContactPageForm } from './ContactPageForm';

export default function ContactPageEditor() {
  const page = db.select().from(contactPage).get();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact Page</h1>
        <p className="text-sm text-slate-500 mt-1">Edit your contact page content and SEO settings</p>
      </div>

      <ContactPageForm page={page || null} />
    </div>
  );
}
