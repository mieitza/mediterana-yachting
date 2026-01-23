import { db, posts } from '@/lib/db';
import { eq, desc, lte, and } from 'drizzle-orm';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: { url: string; alt?: string } | null;
  body: string | null;
  tags: string[] | null;
  author: string | null;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

function parsePost(post: typeof posts.$inferSelect): BlogPost {
  return {
    ...post,
    coverImage: post.coverImage ? JSON.parse(post.coverImage) : null,
    tags: post.tags ? JSON.parse(post.tags) : null,
  };
}

export async function getAllPosts() {
  const now = new Date();
  const rows = db
    .select()
    .from(posts)
    .where(lte(posts.publishedAt, now))
    .orderBy(desc(posts.publishedAt))
    .all();

  return rows.map(parsePost);
}

export async function getLatestPosts(limit = 3) {
  const now = new Date();
  const rows = db
    .select()
    .from(posts)
    .where(lte(posts.publishedAt, now))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .all();

  return rows.map(parsePost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get();

  if (!post) return null;

  return parsePost(post);
}

export async function getPostSlugs() {
  const now = new Date();
  const rows = db
    .select({ slug: posts.slug })
    .from(posts)
    .where(lte(posts.publishedAt, now))
    .all();

  return rows.map((row) => ({ slug: row.slug }));
}
