import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, blogPage } from '@/lib/db';
import { BlogPageForm } from './BlogPageForm';

async function getBlogPage() {
  return db.select().from(blogPage).get();
}

export default async function AdminBlogPageEditor() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const page = await getBlogPage();

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Edit Blog Page" />

      <div className="flex-1 p-6 max-w-4xl overflow-y-auto">
        <BlogPageForm page={page} />
      </div>
    </div>
  );
}
