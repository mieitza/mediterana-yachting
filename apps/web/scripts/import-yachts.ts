import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

// Database imports
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';

// Initialize database - use the monorepo data directory
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), '../../data/mediterana.db');
console.log('Database path:', dbPath);
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite, { schema });

interface ScrapedYacht {
  name: string;
  slug: string;
  type: 'motor' | 'sailing' | 'power-catamaran' | 'sailing-catamaran';
  url: string;
  videoUrl?: string;
  images: string[];
  specs: {
    length?: string;
    beam?: string;
    draft?: string;
    year?: number;
    guests?: number;
    cabins?: number;
    crew?: number;
    cruisingSpeed?: string;
  };
  summary?: string;
  description?: string;
  highlights?: string[];
  destinations?: { name: string; url: string }[];
  fromPrice?: number;
}

interface DestinationContent {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  bestSeason?: string;
  images: string[];
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Get base URL for uploaded files
function getUploadUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mediteranayachting.com'}/uploads/${filename}`;
}

// Download and process image
async function downloadAndProcessImage(imageUrl: string, prefix: string): Promise<{
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
} | null> {
  try {
    // Convert small images to large
    let url = imageUrl;
    if (url.includes('?p=small')) {
      url = url.replace('?p=small', '?p=large');
    }

    console.log(`  Downloading: ${url.substring(0, 80)}...`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`  Failed to download: ${response.status}`);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      console.error(`  Not an image: ${contentType}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Process with sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Convert to webp and resize if needed
    const filename = `${prefix}-${nanoid(8)}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    let processed = image.webp({ quality: 85 });

    // Resize if too large
    if (metadata.width && metadata.width > 1920) {
      processed = processed.resize(1920, null, { withoutEnlargement: true });
    }

    await processed.toFile(outputPath);

    // Get final metadata
    const finalMeta = await sharp(outputPath).metadata();
    const stats = fs.statSync(outputPath);

    return {
      filename,
      url: getUploadUrl(filename),
      width: finalMeta.width || 0,
      height: finalMeta.height || 0,
      size: stats.size,
    };
  } catch (error) {
    console.error(`  Error processing image:`, error);
    return null;
  }
}

// Scrape more images from a yacht page
async function scrapeMoreImages(page: any, url: string): Promise<string[]> {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    const images = await page.evaluate(() => {
      const imgs: string[] = [];

      // Find all image links in galleries
      document.querySelectorAll('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".webp"]').forEach(a => {
        const href = (a as HTMLAnchorElement).href;
        if (href && !imgs.includes(href)) {
          imgs.push(href);
        }
      });

      // Find all large images
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.dataset.src || img.dataset.lazySrc;
        if (src && src.startsWith('http') &&
            !src.includes('logo') && !src.includes('icon') &&
            (img.naturalWidth > 200 || img.width > 200 || src.includes('large') || src.includes('asset'))) {
          // Get larger version if possible
          let largeSrc = src;
          if (largeSrc.includes('?p=small')) {
            largeSrc = largeSrc.replace('?p=small', '?p=large');
          }
          if (!imgs.includes(largeSrc)) {
            imgs.push(largeSrc);
          }
        }
      });

      return imgs;
    });

    return images;
  } catch (error) {
    console.error(`Error scraping images from ${url}:`, error);
    return [];
  }
}

// Scrape destination content
async function scrapeDestination(page: any, url: string): Promise<DestinationContent | null> {
  try {
    console.log(`\nScraping destination: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);

    const content = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const name = h1?.textContent?.trim() || '';

      // Get description paragraphs
      const paragraphs: string[] = [];
      document.querySelectorAll('main p, .content p, article p, .description p').forEach(p => {
        const text = p.textContent?.trim();
        if (text && text.length > 30) {
          paragraphs.push(text);
        }
      });

      // Get highlights/features
      const highlights: string[] = [];
      document.querySelectorAll('.features li, .highlights li, ul li').forEach(li => {
        const text = li.textContent?.trim();
        if (text && text.length > 5 && text.length < 150) {
          highlights.push(text);
        }
      });

      // Get images
      const images: string[] = [];
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.dataset.src;
        if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon')) {
          let largeSrc = src;
          if (largeSrc.includes('?p=small')) {
            largeSrc = largeSrc.replace('?p=small', '?p=large');
          }
          if (!images.includes(largeSrc)) {
            images.push(largeSrc);
          }
        }
      });

      // Try to find best season info
      const text = document.body.innerText;
      let bestSeason = '';
      const seasonMatch = text.match(/(?:best|ideal|peak)\s*(?:time|season|period)[:\s]+([^.]+)/i);
      if (seasonMatch) {
        bestSeason = seasonMatch[1].trim();
      }

      return {
        name,
        description: paragraphs.slice(0, 5).join('\n\n'),
        highlights: highlights.slice(0, 8),
        bestSeason,
        images: images.slice(0, 10),
      };
    });

    if (!content.name) return null;

    // Generate slug from URL
    const slug = url.split('/').pop() || '';

    return {
      ...content,
      slug,
    };
  } catch (error) {
    console.error(`Error scraping destination:`, error);
    return null;
  }
}

// Create image record in database
function createImageRecord(imageData: {
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}, originalName: string, alt?: string): schema.Image {
  const id = nanoid();
  const record = {
    id,
    filename: imageData.filename,
    originalName,
    url: imageData.url,
    alt: alt || null,
    width: imageData.width,
    height: imageData.height,
    size: imageData.size,
    mimeType: 'image/webp',
    storagePath: `uploads/${imageData.filename}`,
    createdAt: new Date(),
  };

  db.insert(schema.images).values(record).run();
  return record as schema.Image;
}

// Check if yacht already exists
function yachtExists(slug: string): boolean {
  const existing = db.select().from(schema.yachts).where(eq(schema.yachts.slug, slug)).get();
  return !!existing;
}

// Check if destination exists
function getDestinationBySlug(slug: string): schema.Destination | undefined {
  return db.select().from(schema.destinations).where(eq(schema.destinations.slug, slug)).get();
}

// Main import function
async function importYachts() {
  console.log('=== Starting Yacht Import ===\n');

  // Read scraped data
  const scrapedData: ScrapedYacht[] = JSON.parse(
    fs.readFileSync('/tmp/scraped-yachts.json', 'utf-8')
  );

  console.log(`Found ${scrapedData.length} yachts to import\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  // Track created destinations
  const destinationMap = new Map<string, string>(); // url -> id

  // Get all unique destination URLs that need to be created
  const destinationUrls = new Map<string, { name: string; url: string }>();

  for (const yacht of scrapedData) {
    if (yacht.destinations) {
      for (const dest of yacht.destinations) {
        // Clean up destination name
        const cleanName = dest.name.split('\n')[0].trim();

        // Skip generic destinations
        if (cleanName === 'Destinations' || !dest.url) continue;

        // Focus on Greek destinations for now
        const greekDestinations = [
          'cyclades', 'dodecanese', 'ionian', 'saronic', 'sporades', 'greece'
        ];
        const isGreekDest = greekDestinations.some(d => dest.url.toLowerCase().includes(d));

        if (isGreekDest && !destinationUrls.has(dest.url)) {
          destinationUrls.set(dest.url, { name: cleanName, url: dest.url });
        }
      }
    }
  }

  console.log(`\n=== Creating ${destinationUrls.size} destinations ===\n`);

  // Create destinations first
  for (const [url, dest] of destinationUrls) {
    const slug = url.split('/').pop() || '';

    // Check if exists
    const existing = getDestinationBySlug(slug);
    if (existing) {
      console.log(`Destination "${dest.name}" already exists, skipping`);
      destinationMap.set(url, existing.id);
      continue;
    }

    // Scrape destination content
    const content = await scrapeDestination(page, url);
    if (!content) {
      console.log(`Failed to scrape destination: ${url}`);
      continue;
    }

    // Download hero image
    let heroImage = null;
    if (content.images.length > 0) {
      const downloaded = await downloadAndProcessImage(content.images[0], `dest-${slug}`);
      if (downloaded) {
        createImageRecord(downloaded, `${content.name} hero`, content.name);
        heroImage = JSON.stringify({ url: downloaded.url, alt: content.name });
      }
    }

    // Create destination
    const destId = nanoid();
    const newDest = {
      id: destId,
      name: content.name,
      slug,
      heroImage,
      bestSeason: content.bestSeason || 'May to October',
      highlights: content.highlights.length > 0 ? JSON.stringify(content.highlights) : null,
      description: content.description || null,
      seoTitle: `${content.name} Yacht Charters | Mediterana Yachting`,
      seoDescription: content.description?.substring(0, 160) || `Discover luxury yacht charters in ${content.name}`,
    };

    db.insert(schema.destinations).values(newDest).run();
    destinationMap.set(url, destId);
    console.log(`Created destination: ${content.name}`);

    await page.waitForTimeout(1000);
  }

  console.log(`\n=== Importing ${scrapedData.length} yachts ===\n`);

  // Import yachts
  for (const yacht of scrapedData) {
    console.log(`\n--- Processing: ${yacht.name} ---`);

    // Check if exists
    if (yachtExists(yacht.slug)) {
      console.log(`Yacht "${yacht.name}" already exists, skipping`);
      continue;
    }

    // Scrape more images
    const allImageUrls = new Set(yacht.images);
    const moreImages = await scrapeMoreImages(page, yacht.url);
    moreImages.forEach(img => allImageUrls.add(img));

    console.log(`Found ${allImageUrls.size} total images`);

    // Download and process images
    const galleryImages: { url: string; alt?: string }[] = [];
    let heroImageData = null;
    let count = 0;

    for (const imageUrl of allImageUrls) {
      if (count >= 15) break; // Limit to 15 images per yacht

      const downloaded = await downloadAndProcessImage(imageUrl, yacht.slug);
      if (downloaded) {
        createImageRecord(downloaded, `${yacht.name} image ${count + 1}`, yacht.name);

        if (count === 0 && !yacht.videoUrl) {
          // First image is hero (if no video)
          heroImageData = { url: downloaded.url, alt: yacht.name };
        }
        galleryImages.push({ url: downloaded.url, alt: yacht.name });
        count++;
      }
    }

    // Create yacht
    const yachtId = nanoid();
    const newYacht = {
      id: yachtId,
      name: yacht.name,
      slug: yacht.slug,
      type: yacht.type,
      featured: false,
      videoUrl: yacht.videoUrl || null,
      heroImage: heroImageData ? JSON.stringify(heroImageData) : null,
      gallery: galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
      summary: yacht.summary || `Experience luxury aboard ${yacht.name}, a stunning ${yacht.type.replace('-', ' ')} yacht.`,
      description: yacht.description || null,
      length: yacht.specs.length || null,
      beam: yacht.specs.beam || null,
      draft: yacht.specs.draft || null,
      year: yacht.specs.year || null,
      cabins: yacht.specs.cabins || null,
      crew: yacht.specs.crew || null,
      cruisingSpeed: yacht.specs.cruisingSpeed || null,
      highlights: yacht.highlights ? JSON.stringify(yacht.highlights) : null,
      fromPrice: yacht.fromPrice || null,
      seoTitle: `${yacht.name} Yacht Charter | Mediterana Yachting`,
      seoDescription: `Charter ${yacht.name}, a ${yacht.specs.length || ''} ${yacht.type.replace('-', ' ')} yacht with ${yacht.specs.cabins || ''} cabins.`,
    };

    db.insert(schema.yachts).values(newYacht).run();
    console.log(`Created yacht: ${yacht.name}`);

    // Link to destinations
    if (yacht.destinations) {
      for (const dest of yacht.destinations) {
        const destId = destinationMap.get(dest.url);
        if (destId) {
          db.insert(schema.yachtDestinations).values({
            id: nanoid(),
            yachtId,
            destinationId: destId,
          }).run();
          console.log(`  Linked to: ${dest.name.split('\n')[0].trim()}`);
        }
      }
    }

    await page.waitForTimeout(500);
  }

  await browser.close();

  console.log('\n=== Import Complete ===');

  // Summary
  const yachtCount = db.select().from(schema.yachts).all().length;
  const destCount = db.select().from(schema.destinations).all().length;
  const imageCount = db.select().from(schema.images).all().length;

  console.log(`Total yachts: ${yachtCount}`);
  console.log(`Total destinations: ${destCount}`);
  console.log(`Total images: ${imageCount}`);
}

// Run
importYachts().catch(console.error);
