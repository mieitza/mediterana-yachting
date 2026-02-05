import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';

const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');
const dbPath = path.join(process.cwd(), '../../data/mediterana.db');

console.log('Database path:', dbPath);
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite, { schema });

function getUploadUrl(filename: string): string {
  return `https://mediteranayachting.com/uploads/${filename}`;
}

async function downloadImage(imageUrl: string, prefix: string): Promise<{
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
} | null> {
  try {
    let url = imageUrl;
    // Try to get larger version
    if (url.includes('?p=small')) {
      url = url.replace('?p=small', '?p=large');
    }

    console.log(`  Downloading: ${url.substring(0, 80)}...`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
        'Referer': 'https://www.istionluxuryyachts.com/',
      },
    });

    if (!response.ok) {
      console.error(`  Failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      console.error(`  Not an image: ${contentType}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 1000) {
      console.error(`  Image too small: ${buffer.length} bytes`);
      return null;
    }

    const image = sharp(buffer);
    const metadata = await image.metadata();

    const filename = `${prefix}-${nanoid(8)}.webp`;
    const outputPath = path.join(UPLOADS_DIR, filename);

    let processed = image.webp({ quality: 85 });
    if (metadata.width && metadata.width > 1920) {
      processed = processed.resize(1920, null, { withoutEnlargement: true });
    }

    await processed.toFile(outputPath);

    const finalMeta = await sharp(outputPath).metadata();
    const stats = fs.statSync(outputPath);

    console.log(`  Saved: ${filename} (${finalMeta.width}x${finalMeta.height})`);

    return {
      filename,
      url: getUploadUrl(filename),
      width: finalMeta.width || 0,
      height: finalMeta.height || 0,
      size: stats.size,
    };
  } catch (error) {
    console.error(`  Error:`, error);
    return null;
  }
}

function createImageRecord(imageData: {
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}, originalName: string, alt?: string) {
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
  return record;
}

async function fixYacht(page: any, slug: string, sourceUrl: string) {
  console.log(`\n=== Fixing yacht: ${slug} ===`);

  await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scroll to load lazy images
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);

  // Get all image URLs
  const imageUrls = await page.evaluate(() => {
    const urls: string[] = [];

    // Get swiper/gallery images
    document.querySelectorAll('.swiper-slide img, .gallery img, [class*="gallery"] img').forEach(img => {
      const el = img as HTMLImageElement;
      const src = el.dataset.src || el.src;
      if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon')) {
        urls.push(src);
      }
    });

    // Get any other large images
    document.querySelectorAll('img').forEach(img => {
      const el = img as HTMLImageElement;
      const src = el.dataset.src || el.src;
      if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon') &&
          !urls.includes(src) && (el.naturalWidth > 200 || el.width > 200)) {
        urls.push(src);
      }
    });

    return urls;
  });

  console.log(`Found ${imageUrls.length} image URLs`);

  // Download images
  const galleryImages: { url: string; alt?: string }[] = [];
  let heroImageData = null;
  let count = 0;

  for (const imageUrl of imageUrls) {
    if (count >= 15) break;

    const downloaded = await downloadImage(imageUrl, slug);
    if (downloaded) {
      createImageRecord(downloaded, `${slug} image ${count + 1}`, slug);

      if (count === 0) {
        heroImageData = { url: downloaded.url, alt: slug };
      }
      galleryImages.push({ url: downloaded.url, alt: slug });
      count++;
    }
  }

  if (galleryImages.length === 0) {
    console.log(`No images downloaded for ${slug}`);
    return;
  }

  // Get yacht name for proper casing
  const yachtRecord = db.select().from(schema.yachts).where(eq(schema.yachts.slug, slug)).get();
  const yachtName = yachtRecord?.name || slug;

  // Update database
  db.update(schema.yachts)
    .set({
      heroImage: heroImageData ? JSON.stringify({ url: heroImageData.url, alt: yachtName }) : null,
      gallery: JSON.stringify(galleryImages.map(img => ({ url: img.url, alt: yachtName }))),
      summary: `Experience luxury aboard ${yachtName}, a stunning yacht perfect for Mediterranean cruises.`,
      updatedAt: new Date(),
    })
    .where(eq(schema.yachts.slug, slug))
    .run();

  console.log(`Updated ${slug}: ${galleryImages.length} images`);
}

async function fixDestination(page: any, slug: string, sourceUrl: string) {
  console.log(`\n=== Fixing destination: ${slug} ===`);

  await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scroll to load content
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(1000);

  // Get content
  const content = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const name = h1?.textContent?.trim() || '';

    // Get description from intro/content area
    const paragraphs: string[] = [];
    document.querySelectorAll('main p, .content p, article p, [class*="intro"] p, [class*="description"] p').forEach(p => {
      const text = p.textContent?.trim();
      if (text && text.length > 50 && !text.includes('Cookie') && !text.includes('cookie')) {
        paragraphs.push(text);
      }
    });

    // Get images
    const images: string[] = [];
    document.querySelectorAll('img').forEach(img => {
      const el = img as HTMLImageElement;
      const src = el.dataset.src || el.src;
      if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon') &&
          (el.naturalWidth > 200 || el.width > 200 || src.includes('asset') || src.includes('large'))) {
        let largeSrc = src;
        if (largeSrc.includes('?p=small')) {
          largeSrc = largeSrc.replace('?p=small', '?p=large');
        }
        if (!images.includes(largeSrc)) {
          images.push(largeSrc);
        }
      }
    });

    return {
      name,
      description: paragraphs.slice(0, 4).join('\n\n'),
      images: images.slice(0, 8),
    };
  });

  console.log(`Name: ${content.name}`);
  console.log(`Description length: ${content.description.length}`);
  console.log(`Images found: ${content.images.length}`);

  // Download hero image
  let heroImageData = null;
  const galleryImages: { url: string; alt?: string }[] = [];

  for (let i = 0; i < content.images.length && i < 6; i++) {
    const downloaded = await downloadImage(content.images[i], `dest-${slug}`);
    if (downloaded) {
      createImageRecord(downloaded, `${content.name || slug} image`, content.name || slug);

      if (i === 0) {
        heroImageData = { url: downloaded.url, alt: content.name || slug };
      }
      galleryImages.push({ url: downloaded.url, alt: content.name || slug });
    }
  }

  // Generate a proper description if scraping failed
  const destinationDescriptions: Record<string, string> = {
    'cyclades': 'The Cyclades islands are a stunning archipelago in the heart of the Aegean Sea. Known for their iconic whitewashed buildings with blue domes, crystal-clear waters, and vibrant nightlife, these islands offer the quintessential Greek island experience. From the cosmopolitan Mykonos to the romantic Santorini, each island has its unique character while sharing the authentic Cycladic charm.',
    'dodecanese': 'The Dodecanese islands stretch along the Turkish coast in the southeastern Aegean Sea. This diverse island group combines ancient Greek heritage with medieval architecture left by the Knights of St. John. Rhodes, the largest island, features a UNESCO World Heritage Old Town, while smaller islands like Patmos and Symi offer tranquil harbors and pristine beaches.',
    'ionian-islands': 'The Ionian Islands lie off the western coast of Greece, blessed with lush green landscapes, Venetian architecture, and some of the clearest waters in the Mediterranean. Corfu enchants with its elegant town and royal palaces, Kefalonia impresses with dramatic coastlines, and Zakynthos captivates with its famous shipwreck beach and sea caves.',
    'saronic-gulf': 'The Saronic Gulf islands are the closest island group to Athens, making them perfect for shorter yacht charters. Aegina charms with its pistachio groves and ancient temple, Hydra captivates with its car-free streets and artistic heritage, while Spetses combines pine forests with cosmopolitan beaches. These islands offer a taste of Greek island life within easy reach of the capital.',
    'sporades': 'The Sporades islands in the northwestern Aegean are a verdant paradise of pine forests meeting turquoise seas. Skiathos is known for its sixty beaches and vibrant nightlife, Skopelos gained fame as the filming location for Mamma Mia!, and Alonissos anchors a national marine park home to rare Mediterranean monk seals. These islands offer a greener, more relaxed alternative to the Cyclades.',
    'greece': 'Greece offers one of the world\'s most diverse and rewarding yacht charter destinations. With over 6,000 islands and islets, countless ancient sites, and a cuisine celebrated worldwide, Greece provides endless discovery. From the glamorous Cyclades to the lush Ionian, from historic Rhodes to unspoiled Sporades, every voyage reveals new treasures of history, culture, and natural beauty.',
  };

  const description = content.description.length > 100
    ? content.description
    : destinationDescriptions[slug] || `Discover the beauty of ${content.name || slug} on a luxury yacht charter. This stunning destination offers crystal-clear waters, charming harbors, and unforgettable experiences.`;

  // Update database
  db.update(schema.destinations)
    .set({
      heroImage: heroImageData ? JSON.stringify(heroImageData) : null,
      gallery: galleryImages.length > 0 ? JSON.stringify(galleryImages) : null,
      description: description,
      bestSeason: 'May to October',
      updatedAt: new Date(),
    })
    .where(eq(schema.destinations.slug, slug))
    .run();

  console.log(`Updated ${slug}: hero=${!!heroImageData}, gallery=${galleryImages.length}, desc=${description.length} chars`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });
  const page = await context.newPage();

  // Fix yachts with missing data
  const yachtsToFix = [
    { slug: 'alma', url: 'https://www.istionluxuryyachts.com/fleet/catamarans/alma' },
    { slug: 'gigreca', url: 'https://www.istionluxuryyachts.com/fleet/sailing-yachts/gigreca' },
    { slug: 'why-not', url: 'https://www.istionluxuryyachts.com/fleet/motor-yachts/why-not' },
    { slug: 'm-five', url: 'https://www.istionluxuryyachts.com/fleet/motor-yachts/m-five' },
    { slug: 'explorion', url: 'https://www.istionluxuryyachts.com/fleet/power-catamarans/explorion' },
    { slug: 'd2', url: 'https://www.istionluxuryyachts.com/fleet/power-catamarans/d2' },
  ];

  for (const yacht of yachtsToFix) {
    // Check if already has images
    const existing = db.select().from(schema.yachts).where(eq(schema.yachts.slug, yacht.slug)).get();
    if (!existing?.gallery) {
      await fixYacht(page, yacht.slug, yacht.url);
      await page.waitForTimeout(2000);
    } else {
      console.log(`\nSkipping ${yacht.slug} - already has gallery`);
    }
  }

  // Fix destinations
  const destinationsToFix = [
    { slug: 'cyclades', url: 'https://www.istionluxuryyachts.com/destinations/cyclades' },
    { slug: 'dodecanese', url: 'https://www.istionluxuryyachts.com/destinations/dodecanese' },
    { slug: 'ionian-islands', url: 'https://www.istionluxuryyachts.com/destinations/ionian-islands' },
    { slug: 'saronic-gulf', url: 'https://www.istionluxuryyachts.com/destinations/saronic-gulf' },
    { slug: 'sporades', url: 'https://www.istionluxuryyachts.com/destinations/sporades' },
    { slug: 'greece', url: 'https://www.istionluxuryyachts.com/destinations/greece' },
  ];

  for (const dest of destinationsToFix) {
    await fixDestination(page, dest.slug, dest.url);
    await page.waitForTimeout(2000);
  }

  await browser.close();

  console.log('\n=== Fix Complete ===');

  // Summary
  const yachts = db.select().from(schema.yachts).all();
  const destinations = db.select().from(schema.destinations).all();

  console.log('\nYachts with galleries:', yachts.filter((y: any) => y.gallery).length);
  console.log('Destinations with hero images:', destinations.filter((d: any) => d.heroImage).length);
}

main().catch(console.error);
