import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, images } from '@/lib/db';
import { uploadImage } from '@/lib/storage';
import { nanoid } from 'nanoid';
import { desc } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allImages = db.select().from(images).orderBy(desc(images.createdAt)).all();
    return NextResponse.json(allImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt = formData.get('alt') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Upload and process image
    const uploaded = await uploadImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85,
      format: 'webp',
    });

    // Save to database
    const newImage = {
      id: uploaded.id,
      filename: uploaded.filename,
      originalName: uploaded.originalName,
      url: uploaded.url,
      alt: alt || null,
      width: uploaded.width,
      height: uploaded.height,
      size: uploaded.size,
      mimeType: uploaded.mimeType,
      storagePath: uploaded.storagePath,
    };

    db.insert(images).values(newImage).run();

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
