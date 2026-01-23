import { db, aboutPage } from '@/lib/db';
import { AboutPageForm } from './AboutPageForm';

export default function AboutPageEditor() {
  const page = db.select().from(aboutPage).get();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">About Page</h1>
        <p className="text-sm text-slate-500 mt-1">Edit your about page content and SEO settings</p>
      </div>

      <AboutPageForm page={page || null} />
    </div>
  );
}
