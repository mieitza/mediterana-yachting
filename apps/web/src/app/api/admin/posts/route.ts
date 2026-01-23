import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, posts } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allPosts = await db.select().from(posts).all();
    return NextResponse.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newPost = {
      id: nanoid(),
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      body: body.body || null,
      tags: body.tags || null,
      author: body.author || null,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      seoImage: body.seoImage || null,
    };

    db.insert(posts).values(newPost).run();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
