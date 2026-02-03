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

    // Support both single file ('file') and multiple files ('files')
    const singleFile = formData.get('file') as File | null;
    const multipleFiles = formData.getAll('files') as File[];
    const alt = formData.get('alt') as string | null;

    // Determine which files to process
    const filesToUpload: File[] = [];
    if (multipleFiles.length > 0) {
      filesToUpload.push(...multipleFiles.filter(f => f instanceof File && f.size > 0));
    } else if (singleFile) {
      filesToUpload.push(singleFile);
    }

    if (filesToUpload.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    const uploadOptions = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85,
      format: 'webp' as const,
    };

    // Validate all files first
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: `File "${file.name}" must be an image` }, { status: 400 });
      }
      if (file.size > maxSize) {
        return NextResponse.json({ error: `File "${file.name}" too large (max 10MB)` }, { status: 400 });
      }
    }

    // Upload all files in parallel
    const uploadPromises = filesToUpload.map(async (file) => {
      const uploaded = await uploadImage(file, uploadOptions);

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
      return newImage;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Return single image for backward compatibility, array for multiple
    if (uploadedImages.length === 1 && singleFile) {
      return NextResponse.json(uploadedImages[0], { status: 201 });
    }

    return NextResponse.json({ images: uploadedImages }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
