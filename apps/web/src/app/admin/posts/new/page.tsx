import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PostForm } from '../PostForm';

export default async function NewPostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="New Blog Post" />

      <div className="flex-1 p-6 max-w-4xl">
        <PostForm />
      </div>
    </div>
  );
}
