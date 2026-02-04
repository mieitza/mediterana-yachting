import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ============================================
// Users (Admin Authentication)
// ============================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  role: text('role', { enum: ['admin', 'editor'] }).default('editor').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Images (Media Library)
// ============================================
export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  url: text('url').notNull(),
  alt: text('alt'),
  width: integer('width'),
  height: integer('height'),
  size: integer('size'),
  mimeType: text('mime_type'),
  storagePath: text('storage_path'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Yachts
// ============================================
export const yachts = sqliteTable('yachts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  type: text('type', { enum: ['motor', 'sailing', 'power-catamaran', 'sailing-catamaran'] }).notNull(),
  heroImage: text('hero_image'), // JSON: { url, alt }
  gallery: text('gallery'), // JSON array
  videoUrl: text('video_url'),
  summary: text('summary'),
  description: text('description'), // Rich text JSON
  // Specs
  length: text('length'),
  beam: text('beam'),
  draft: text('draft'),
  year: integer('year'),
  yearRefitted: integer('year_refitted'),
  guests: integer('guests'),
  cabins: integer('cabins'),
  crew: integer('crew'),
  cruisingSpeed: text('cruising_speed'),
  // Highlights
  highlights: text('highlights'), // JSON array
  // Pricing
  fromPrice: integer('from_price'),
  currency: text('currency').default('EUR'),
  priceNote: text('price_note'),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Yacht-Destination junction table
export const yachtDestinations = sqliteTable('yacht_destinations', {
  id: text('id').primaryKey(),
  yachtId: text('yacht_id').notNull().references(() => yachts.id, { onDelete: 'cascade' }),
  destinationId: text('destination_id').notNull().references(() => destinations.id, { onDelete: 'cascade' }),
});

// ============================================
// Destinations
// ============================================
export const destinations = sqliteTable('destinations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  heroImage: text('hero_image'), // JSON: { url, alt }
  gallery: text('gallery'), // JSON array
  bestSeason: text('best_season'),
  highlights: text('highlights'), // JSON array
  description: text('description'), // Rich text JSON
  itinerary: text('itinerary'), // Rich text JSON
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Destination-Yacht recommended junction table
export const destinationRecommendedYachts = sqliteTable('destination_recommended_yachts', {
  id: text('id').primaryKey(),
  destinationId: text('destination_id').notNull().references(() => destinations.id, { onDelete: 'cascade' }),
  yachtId: text('yacht_id').notNull().references(() => yachts.id, { onDelete: 'cascade' }),
  order: integer('order').default(0),
});

// ============================================
// Blog Posts
// ============================================
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'), // JSON: { url, alt }
  body: text('body'), // Rich text JSON
  tags: text('tags'), // JSON array
  author: text('author'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Team Members
// ============================================
export const teamMembers = sqliteTable('team_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  image: text('image'), // JSON: { url, alt }
  bio: text('bio'),
  email: text('email'),
  linkedin: text('linkedin'),
  order: integer('order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Site Settings (Singleton)
// ============================================
export const siteSettings = sqliteTable('site_settings', {
  id: text('id').primaryKey().default('site-settings'),
  siteName: text('site_name').default('Mediterana Yachting'),
  siteDescription: text('site_description'),
  logo: text('logo'), // JSON: { url, alt }
  // Contact
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  contactAddress: text('contact_address'),
  // Social
  instagram: text('instagram'),
  facebook: text('facebook'),
  linkedin: text('linkedin'),
  twitter: text('twitter'),
  youtube: text('youtube'),
  whatsapp: text('whatsapp'),
  // Footer
  footerTagline: text('footer_tagline'),
  footerLinks: text('footer_links'), // JSON array
  copyrightText: text('copyright_text'),
  // Featured yachts
  featuredYachts: text('featured_yachts'), // JSON array of yacht IDs
  // Default SEO
  defaultSeoImage: text('default_seo_image'),
  twitterHandle: text('twitter_handle'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Home Page (Singleton)
// ============================================
export const homePage = sqliteTable('home_page', {
  id: text('id').primaryKey().default('home-page'),
  // Hero Section
  heroTitle: text('hero_title'),
  heroHighlight: text('hero_highlight'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'), // JSON: { url, alt }
  heroCtas: text('hero_ctas'), // JSON array: [{ text, href, variant }]
  // Featured Yachts Section
  featuredYachtsTitle: text('featured_yachts_title'),
  featuredYachtsSubtitle: text('featured_yachts_subtitle'),
  // Destinations Section
  destinationsTitle: text('destinations_title'),
  destinationsSubtitle: text('destinations_subtitle'),
  // Why Mediterana Section
  whyMediteranaTitle: text('why_mediterana_title'),
  whyMediteranaSubtitle: text('why_mediterana_subtitle'),
  whyMediteranaFeatures: text('why_mediterana_features'), // JSON array
  // Process Section
  processTitle: text('process_title'),
  processSubtitle: text('process_subtitle'),
  processSteps: text('process_steps'), // JSON array
  // Blog Section
  blogTitle: text('blog_title'),
  blogSubtitle: text('blog_subtitle'),
  // CTA Section
  ctaTitle: text('cta_title'),
  ctaDescription: text('cta_description'),
  ctaButtonText: text('cta_button_text'),
  ctaButtonHref: text('cta_button_href'),
  ctaBackgroundImage: text('cta_background_image'),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// About Page (Singleton)
// ============================================
export const aboutPage = sqliteTable('about_page', {
  id: text('id').primaryKey().default('about-page'),
  // Hero Section
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'), // JSON: { url, alt }
  // Story Section
  storyTitle: text('story_title'),
  storyContent: text('story_content'), // Rich text JSON
  storyImage: text('story_image'),
  // Statistics
  statistics: text('statistics'), // JSON array: [{ value, label }]
  // Values Section
  valuesTitle: text('values_title'),
  valuesSubtitle: text('values_subtitle'),
  values: text('values'), // JSON array: [{ icon, title, description }]
  // Process Section
  processTitle: text('process_title'),
  processSubtitle: text('process_subtitle'),
  processSteps: text('process_steps'), // JSON array
  // Team Section
  teamTitle: text('team_title'),
  teamSubtitle: text('team_subtitle'),
  // CTA Section
  ctaTitle: text('cta_title'),
  ctaDescription: text('cta_description'),
  ctaButtonText: text('cta_button_text'),
  ctaButtonHref: text('cta_button_href'),
  ctaBackgroundImage: text('cta_background_image'),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Contact Page (Singleton)
// ============================================
export const contactPage = sqliteTable('contact_page', {
  id: text('id').primaryKey().default('contact-page'),
  // Hero Section
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'),
  // Contact Info
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  contactWhatsapp: text('contact_whatsapp'),
  contactAddress: text('contact_address'),
  // Office Hours
  officeHours: text('office_hours'), // JSON array: [{ days, hours }]
  timezoneNote: text('timezone_note'),
  // Form Section
  formTitle: text('form_title'),
  formDescription: text('form_description'),
  // FAQ Section
  faqTitle: text('faq_title'),
  faqItems: text('faq_items'), // JSON array: [{ question, answer }]
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Destinations Page (Singleton)
// ============================================
export const destinationsPage = sqliteTable('destinations_page', {
  id: text('id').primaryKey().default('destinations-page'),
  // Hero Section
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'), // JSON: { url, alt }
  // Intro Section
  introTitle: text('intro_title'),
  introDescription: text('intro_description'),
  // CTA Section
  ctaTitle: text('cta_title'),
  ctaDescription: text('cta_description'),
  ctaButtonText: text('cta_button_text'),
  ctaButtonHref: text('cta_button_href'),
  ctaBackgroundImage: text('cta_background_image'),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Blog Page (Singleton)
// ============================================
export const blogPage = sqliteTable('blog_page', {
  id: text('id').primaryKey().default('blog-page'),
  // Hero Section
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'), // JSON: { url, alt }
  // Intro Section
  introTitle: text('intro_title'),
  introDescription: text('intro_description'),
  // Featured Section
  featuredTitle: text('featured_title'),
  featuredSubtitle: text('featured_subtitle'),
  // Newsletter Section
  newsletterTitle: text('newsletter_title'),
  newsletterDescription: text('newsletter_description'),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Yachts Page (Singleton)
// ============================================
export const yachtsPage = sqliteTable('yachts_page', {
  id: text('id').primaryKey().default('yachts-page'),
  // Hero Section
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'), // JSON: { url, alt }
  // Intro Section
  introTitle: text('intro_title'),
  introDescription: text('intro_description'),
  // FAQ Section
  faqTitle: text('faq_title'),
  faqSubtitle: text('faq_subtitle'),
  // CTA Section
  ctaTitle: text('cta_title'),
  ctaDescription: text('cta_description'),
  ctaButtonText: text('cta_button_text'),
  ctaButtonHref: text('cta_button_href'),
  ctaBackgroundImage: text('cta_background_image'),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  // Timestamps
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Custom Pages (Visual Editor)
// ============================================
export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'), // Craft.js JSON
  status: text('status', { enum: ['draft', 'published'] }).default('draft').notNull(),
  // SEO
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoImage: text('seo_image'),
  seoCanonical: text('seo_canonical'),
  seoNoIndex: integer('seo_no_index', { mode: 'boolean' }).default(false),
  seoNoFollow: integer('seo_no_follow', { mode: 'boolean' }).default(false),
  // Open Graph
  ogTitle: text('og_title'),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  // Twitter Card
  twitterTitle: text('twitter_title'),
  twitterDescription: text('twitter_description'),
  twitterImage: text('twitter_image'),
  // Structured Data
  structuredData: text('structured_data'), // JSON-LD
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
});

// ============================================
// Page Versions (Draft/Publish)
// ============================================
export const pageVersions = sqliteTable('page_versions', {
  id: text('id').primaryKey(),
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  content: text('content'), // Craft.js JSON snapshot
  version: integer('version').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  createdBy: text('created_by').references(() => users.id),
});

// ============================================
// Inquiries (Form Submissions)
// ============================================
export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  // Context
  yachtId: text('yacht_id').references(() => yachts.id),
  destinationId: text('destination_id').references(() => destinations.id),
  source: text('source'), // Which page/form
  // Status
  status: text('status', { enum: ['new', 'read', 'replied', 'archived'] }).default('new').notNull(),
  notes: text('notes'),
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Newsletter Subscribers
// ============================================
export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  status: text('status', { enum: ['active', 'unsubscribed'] }).default('active').notNull(),
  source: text('source'), // 'footer', 'homepage', 'blog'
  unsubscribeToken: text('unsubscribe_token').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  unsubscribedAt: integer('unsubscribed_at', { mode: 'timestamp' }),
});

// ============================================
// Type Exports
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export type Yacht = typeof yachts.$inferSelect;
export type NewYacht = typeof yachts.$inferInsert;

export type Destination = typeof destinations.$inferSelect;
export type NewDestination = typeof destinations.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type HomePage = typeof homePage.$inferSelect;
export type AboutPage = typeof aboutPage.$inferSelect;
export type ContactPage = typeof contactPage.$inferSelect;
export type DestinationsPage = typeof destinationsPage.$inferSelect;
export type BlogPage = typeof blogPage.$inferSelect;
export type YachtsPage = typeof yachtsPage.$inferSelect;

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
