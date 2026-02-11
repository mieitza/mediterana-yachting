-- Import Meliti yacht images and create yacht record
-- Run this against the production database after deploying images

-- Insert images into the images table (IGNORE if already exist)
INSERT OR IGNORE INTO images (id, filename, original_name, url, alt, width, height, size, mime_type, storage_path, created_at) VALUES
  ('meliti-img-01', 'meliti-09b79066.webp', '_3311702.jpg', '/uploads/meliti-09b79066.webp', 'Meliti sailing yacht - exterior', NULL, NULL, 628066, 'image/webp', 'uploads/meliti-09b79066.webp', unixepoch()),
  ('meliti-img-02', 'meliti-b2041745.webp', 'dji_20250619163439_0010_d.jpg', '/uploads/meliti-b2041745.webp', 'Meliti sailing yacht - aerial view', NULL, NULL, 1510158, 'image/webp', 'uploads/meliti-b2041745.webp', unixepoch()),
  ('meliti-img-03', 'meliti-74875fef.webp', 'dji_20250619164218_0026_d.jpg', '/uploads/meliti-74875fef.webp', 'Meliti sailing yacht - drone shot', NULL, NULL, 729552, 'image/webp', 'uploads/meliti-74875fef.webp', unixepoch()),
  ('meliti-img-04', 'meliti-b21de815.webp', 'mpd_000056l.jpg', '/uploads/meliti-b21de815.webp', 'Meliti sailing yacht - interior salon', NULL, NULL, 931218, 'image/webp', 'uploads/meliti-b21de815.webp', unixepoch()),
  ('meliti-img-05', 'meliti-dde4be83.webp', 'dls03817.jpg', '/uploads/meliti-dde4be83.webp', 'Meliti sailing yacht - deck', NULL, NULL, 143368, 'image/webp', 'uploads/meliti-dde4be83.webp', unixepoch()),
  ('meliti-img-06', 'meliti-d31e0b0c.webp', 'img_3941.jpg', '/uploads/meliti-d31e0b0c.webp', 'Meliti sailing yacht - sailing', NULL, NULL, 668410, 'image/webp', 'uploads/meliti-d31e0b0c.webp', unixepoch()),
  ('meliti-img-07', 'meliti-c7a5fb09.webp', 'dls03788.jpg', '/uploads/meliti-c7a5fb09.webp', 'Meliti sailing yacht - detail', NULL, NULL, 274552, 'image/webp', 'uploads/meliti-c7a5fb09.webp', unixepoch()),
  ('meliti-img-08', 'meliti-129b5f86.webp', 'mpd_000062l.jpg', '/uploads/meliti-129b5f86.webp', 'Meliti sailing yacht - cabin', NULL, NULL, 421290, 'image/webp', 'uploads/meliti-129b5f86.webp', unixepoch()),
  ('meliti-img-09', 'meliti-73965860.webp', 'mpd_000113l.jpg', '/uploads/meliti-73965860.webp', 'Meliti sailing yacht - master cabin', NULL, NULL, 640408, 'image/webp', 'uploads/meliti-73965860.webp', unixepoch()),
  ('meliti-img-10', 'meliti-62c261f2.webp', 'dls03433.jpg', '/uploads/meliti-62c261f2.webp', 'Meliti sailing yacht - dining', NULL, NULL, 68530, 'image/webp', 'uploads/meliti-62c261f2.webp', unixepoch()),
  ('meliti-img-11', 'meliti-d66801c8.webp', 'dls03402.jpg', '/uploads/meliti-d66801c8.webp', 'Meliti sailing yacht - galley', NULL, NULL, 179320, 'image/webp', 'uploads/meliti-d66801c8.webp', unixepoch()),
  ('meliti-img-12', 'meliti-7280a4fa.webp', 'dls03411.jpg', '/uploads/meliti-7280a4fa.webp', 'Meliti sailing yacht - bathroom', NULL, NULL, 83412, 'image/webp', 'uploads/meliti-7280a4fa.webp', unixepoch()),
  ('meliti-img-13', 'meliti-9a59381f.webp', 'dls04490.jpg', '/uploads/meliti-9a59381f.webp', 'Meliti sailing yacht - cockpit', NULL, NULL, 96296, 'image/webp', 'uploads/meliti-9a59381f.webp', unixepoch()),
  ('meliti-img-14', 'meliti-0beb22d9.webp', 'dls03413.jpg', '/uploads/meliti-0beb22d9.webp', 'Meliti sailing yacht - helm', NULL, NULL, 84324, 'image/webp', 'uploads/meliti-0beb22d9.webp', unixepoch()),
  ('meliti-img-15', 'meliti-b8bf1fb0.webp', 'dls04470_1_.jpg', '/uploads/meliti-b8bf1fb0.webp', 'Meliti sailing yacht - anchorage', NULL, NULL, 132324, 'image/webp', 'uploads/meliti-b8bf1fb0.webp', unixepoch());

-- Create the Meliti yacht record (IGNORE if already exists)
INSERT OR IGNORE INTO yachts (id, name, slug, featured, type, hero_image, gallery, video_url, summary, description, length, beam, draft, year, year_refitted, guests, cabins, crew, cruising_speed, highlights, from_price, currency, price_note, seo_title, seo_description, created_at, updated_at) VALUES (
  'IAK2o5AoPo4Bo1XK_YJgL',
  'Meliti',
  'meliti',
  0,
  'sailing',
  '{"url":"/uploads/meliti-09b79066.webp","alt":"Meliti sailing yacht"}',
  '[{"url":"/uploads/meliti-09b79066.webp","alt":"Meliti sailing yacht - exterior"},{"url":"/uploads/meliti-b2041745.webp","alt":"Meliti - aerial view"},{"url":"/uploads/meliti-74875fef.webp","alt":"Meliti - drone shot"},{"url":"/uploads/meliti-b21de815.webp","alt":"Meliti - interior salon"},{"url":"/uploads/meliti-dde4be83.webp","alt":"Meliti - deck"},{"url":"/uploads/meliti-d31e0b0c.webp","alt":"Meliti - sailing"},{"url":"/uploads/meliti-c7a5fb09.webp","alt":"Meliti - detail"},{"url":"/uploads/meliti-129b5f86.webp","alt":"Meliti - cabin"},{"url":"/uploads/meliti-73965860.webp","alt":"Meliti - master cabin"},{"url":"/uploads/meliti-62c261f2.webp","alt":"Meliti - dining"},{"url":"/uploads/meliti-d66801c8.webp","alt":"Meliti - galley"},{"url":"/uploads/meliti-7280a4fa.webp","alt":"Meliti - bathroom"},{"url":"/uploads/meliti-9a59381f.webp","alt":"Meliti - cockpit"},{"url":"/uploads/meliti-0beb22d9.webp","alt":"Meliti - helm"},{"url":"/uploads/meliti-b8bf1fb0.webp","alt":"Meliti - anchorage"}]',
  NULL,
  'A unique Garcia 86 sailing yacht — the only one ever built. Meliti combines blue-water cruising capability with luxury charter comfort across the Mediterranean.',
  '<p>Meliti is a truly one-of-a-kind sailing yacht — the only Garcia 86 ever constructed. Built in 2004 and refitted in 2021, she offers an exceptional blend of performance sailing and luxury charter experience.</p><p>With her aluminium hull and centreboard design, Meliti can access shallow anchorages that other yachts of her size cannot reach, opening up a world of secluded bays and pristine beaches.</p><p>Her spacious interior accommodates 6 guests in 3 beautifully appointed cabins, each with en-suite facilities. The master cabin is particularly impressive, offering panoramic views and generous living space.</p><p>A professional crew of 4 ensures every aspect of your charter is taken care of, from gourmet dining to water sports and shore excursions.</p>',
  '26.32',
  '6.25',
  '4.35',
  2004,
  2021,
  6,
  3,
  4,
  '9',
  '["One-of-a-kind Garcia 86 — only one ever built","Shallow draft centreboard for accessing secluded anchorages","Refitted in 2021 with modern amenities","Professional crew of 4 including chef","Spacious master cabin with panoramic views","Full complement of water toys"]',
  23500,
  'EUR',
  'From €23,500/week (low season) to €26,500/week (July-August)',
  'Meliti Sailing Yacht Charter | Garcia 86 | Mediterranean',
  'Charter the unique Meliti, a one-of-a-kind Garcia 86 sailing yacht. 6 guests, 3 cabins, professional crew. Available for Mediterranean charters.',
  unixepoch(),
  unixepoch()
);

-- Also update the hero text to remove invisible space characters
UPDATE home_page SET
  hero_title = TRIM(REPLACE(REPLACE(REPLACE(hero_title, X'C2A0', ' '), X'E2808B', ''), X'E2808C', '')),
  hero_highlight = TRIM(REPLACE(REPLACE(REPLACE(hero_highlight, X'C2A0', ' '), X'E2808B', ''), X'E2808C', '')),
  hero_subtitle = TRIM(REPLACE(REPLACE(REPLACE(hero_subtitle, X'C2A0', ' '), X'E2808B', ''), X'E2808C', ''))
WHERE id = 'home-page';

-- Update site_settings contact address for dual locations
UPDATE site_settings SET contact_address = 'Athens, Greece
Bucharest, Romania' WHERE id = 'site-settings';

-- Add FAQ columns to home_page table if they don't exist
-- SQLite doesn't support IF NOT EXISTS for ALTER TABLE, so these may fail if already present
ALTER TABLE home_page ADD COLUMN faq_title TEXT;
ALTER TABLE home_page ADD COLUMN faq_subtitle TEXT;
ALTER TABLE home_page ADD COLUMN faq_items TEXT;
