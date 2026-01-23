import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PostForm } from '../PostForm';
import { db, posts } from '@/lib/db';
import { eq } from 'drizzle-orm';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  return db.select().from(posts).where(eq(posts.id, id)).get();
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title={`Edit: ${post.title}`} />

      <div className="flex-1 p-6 max-w-4xl">
        <PostForm post={post} />
      </div>
    </div>
  );
}
