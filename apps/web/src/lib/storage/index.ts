import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export interface UploadedImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  storagePath: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

export interface ProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

const DEFAULT_OPTIONS: ProcessOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 85,
  format: 'webp',
};

/**
 * Upload and process an image file
 */
export async function uploadImage(
  file: File,
  options: ProcessOptions = {}
): Promise<UploadedImage> {
  await ensureUploadDir();

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const id = nanoid();
  const ext = opts.format || 'webp';
  const filename = `${id}.${ext}`;
  const storagePath = path.join(UPLOAD_DIR, filename);
  const url = `/uploads/${filename}`;

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Process with Sharp
  let sharpInstance = sharp(buffer);

  // Get original metadata
  const metadata = await sharpInstance.metadata();

  // Resize if needed
  if (opts.maxWidth || opts.maxHeight) {
    sharpInstance = sharpInstance.resize({
      width: opts.maxWidth,
      height: opts.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert format and set quality
  if (opts.format === 'webp') {
    sharpInstance = sharpInstance.webp({ quality: opts.quality });
  } else if (opts.format === 'jpeg') {
    sharpInstance = sharpInstance.jpeg({ quality: opts.quality });
  } else if (opts.format === 'png') {
    sharpInstance = sharpInstance.png({ quality: opts.quality });
  }

  // Save to disk
  const outputBuffer = await sharpInstance.toBuffer();
  await fs.writeFile(storagePath, outputBuffer);

  // Get processed metadata
  const processedMetadata = await sharp(outputBuffer).metadata();

  return {
    id,
    filename,
    originalName: file.name,
    url,
    storagePath,
    width: processedMetadata.width || 0,
    height: processedMetadata.height || 0,
    size: outputBuffer.length,
    mimeType: `image/${ext}`,
  };
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  options: ProcessOptions = {}
): Promise<UploadedImage[]> {
  const results = await Promise.all(
    files.map((file) => uploadImage(file, options))
  );
  return results;
}

/**
 * Delete an image from storage
 */
export async function deleteImage(storagePath: string): Promise<boolean> {
  try {
    await fs.unlink(storagePath);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Create thumbnail version of an image
 */
export async function createThumbnail(
  originalPath: string,
  width: number = 400,
  height: number = 300
): Promise<string> {
  const dir = path.dirname(originalPath);
  const ext = path.extname(originalPath);
  const name = path.basename(originalPath, ext);
  const thumbPath = path.join(dir, `${name}-thumb${ext}`);

  await sharp(originalPath)
    .resize(width, height, { fit: 'cover' })
    .toFile(thumbPath);

  return thumbPath;
}

/**
 * Get image metadata
 */
export async function getImageMetadata(
  filePath: string
): Promise<sharp.Metadata> {
  return sharp(filePath).metadata();
}
