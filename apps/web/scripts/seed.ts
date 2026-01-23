import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { hash } from 'bcryptjs';
import { nanoid } from 'nanoid';
import path from 'path';
import * as schema from '../src/lib/db/schema';

// Database path
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), '../../data/mediterana.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log('🌱 Starting database seed...');

  // Check if admin user already exists
  const existingAdmin = db.select().from(schema.users).get();

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping user creation.');
  } else {
    // Create admin user
    const passwordHash = await hash('admin123', 12);

    db.insert(schema.users).values({
      id: nanoid(),
      email: 'admin@mediterana.com',
      passwordHash,
      name: 'Admin',
      role: 'admin',
    }).run();

    console.log('✅ Created admin user:');
    console.log('   Email: admin@mediterana.com');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change the password after first login!');
  }

  // Initialize singleton tables if they don't exist
  const existingSiteSettings = db.select().from(schema.siteSettings).get();
  if (!existingSiteSettings) {
    db.insert(schema.siteSettings).values({
      id: 'site-settings',
      siteName: 'Mediterana Yachting',
      siteDescription: 'Premium yacht charter experiences in the Mediterranean',
      contactEmail: 'info@mediterana.com',
      contactPhone: '+385 91 123 4567',
    }).run();
    console.log('✅ Created default site settings');
  }

  const existingHomePage = db.select().from(schema.homePage).get();
  if (!existingHomePage) {
    db.insert(schema.homePage).values({
      id: 'home-page',
      heroTitle: 'Experience the Mediterranean',
      heroHighlight: 'in Ultimate Luxury',
      heroSubtitle: 'Discover the finest yacht charter experiences across the most breathtaking destinations.',
      seoTitle: 'Mediterana Yachting | Premium Yacht Charters',
      seoDescription: 'Experience luxury yacht charters in the Mediterranean. Book your dream vacation today.',
    }).run();
    console.log('✅ Created default home page');
  }

  const existingAboutPage = db.select().from(schema.aboutPage).get();
  if (!existingAboutPage) {
    db.insert(schema.aboutPage).values({
      id: 'about-page',
      heroTitle: 'About Mediterana',
      heroSubtitle: 'Your trusted partner for exceptional yacht charter experiences',
      seoTitle: 'About Us | Mediterana Yachting',
      seoDescription: 'Learn about Mediterana Yachting and our commitment to providing unforgettable yacht charter experiences.',
    }).run();
    console.log('✅ Created default about page');
  }

  const existingContactPage = db.select().from(schema.contactPage).get();
  if (!existingContactPage) {
    db.insert(schema.contactPage).values({
      id: 'contact-page',
      heroTitle: 'Contact Us',
      heroSubtitle: 'Get in touch with our charter specialists',
      formTitle: 'Send us a message',
      formDescription: 'Fill out the form below and we\'ll get back to you within 24 hours.',
      seoTitle: 'Contact Us | Mediterana Yachting',
      seoDescription: 'Contact Mediterana Yachting for your yacht charter inquiries. Our team is ready to assist you.',
    }).run();
    console.log('✅ Created default contact page');
  }

  console.log('🎉 Seed completed successfully!');

  sqlite.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
