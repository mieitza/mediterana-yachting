import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { db, posts } from '@/lib/db';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, FileText, Calendar } from 'lucide-react';
import { DeletePostButton } from './DeletePostButton';

async function getPosts() {
  return db.select().from(posts).orderBy(desc(posts.publishedAt), desc(posts.createdAt)).all();
}

export default async function AdminPostsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  const allPosts = await getPosts();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Draft';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Blog Posts" />

      <div className="flex-1 p-6">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600">
            {allPosts.length} post{allPosts.length !== 1 ? 's' : ''} total
          </p>
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Posts Table */}
        {allPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No posts yet
            </h3>
            <p className="text-slate-600 mb-4">
              Get started by writing your first blog post.
            </p>
            <Link href="/admin/posts/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Post
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Tags
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allPosts.map((post) => {
                  const coverImage = post.coverImage ? JSON.parse(post.coverImage) : null;
                  const tags = post.tags ? JSON.parse(post.tags) : [];
                  const isPublished = post.publishedAt && new Date(post.publishedAt) <= new Date();

                  return (
                    <tr key={post.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {coverImage?.url ? (
                            <img
                              src={coverImage.url}
                              alt={coverImage.alt || post.title}
                              className="h-12 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-16 bg-slate-200 rounded flex items-center justify-center">
                              <FileText className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-slate-900">
                              {post.title}
                            </span>
                            <p className="text-sm text-slate-500 truncate max-w-md">
                              {post.excerpt || 'No excerpt'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isPublished
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 2).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/posts/${post.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeletePostButton id={post.id} title={post.title} />
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
