import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import path from 'path';
import * as schema from '../src/lib/db/schema';

// Database path
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), '../../data/mediterana.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite, { schema });

// Sample yacht data
const sampleYachts = [
  {
    id: nanoid(),
    name: 'Serenity',
    slug: 'serenity',
    featured: true,
    type: 'motor' as const,
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1600&q=80',
      alt: 'Serenity luxury motor yacht at sunset',
    }),
    gallery: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80', alt: 'Serenity deck' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', alt: 'Serenity interior lounge' },
      { url: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1200&q=80', alt: 'Serenity master cabin' },
    ]),
    summary: 'A stunning 45-meter motor yacht offering unparalleled luxury and comfort for Mediterranean cruising.',
    description: '<p>Serenity is a masterpiece of Italian craftsmanship, combining elegant design with cutting-edge technology. Her spacious interior features hand-stitched leather, exotic woods, and contemporary art throughout.</p><p>The yacht offers multiple entertainment areas including a cinema room, spa with sauna and hammam, and a beach club with direct sea access. Her experienced crew of 9 ensures every detail of your charter is perfect.</p>',
    length: '45m (148ft)',
    beam: '8.5m',
    draft: '2.8m',
    year: 2021,
    guests: 12,
    cabins: 6,
    crew: 9,
    cruisingSpeed: '14 knots',
    highlights: JSON.stringify([
      'Jacuzzi on sun deck',
      'Full-beam master suite',
      'Beach club with sea-level access',
      'Cinema room',
      'Spa with sauna and hammam',
      'Extensive water toys collection',
    ]),
    fromPrice: 185000,
    currency: 'EUR',
    priceNote: 'per week + expenses',
    seoTitle: 'Serenity | 45m Luxury Motor Yacht Charter',
    seoDescription: 'Charter the stunning Serenity, a 45-meter luxury motor yacht perfect for Mediterranean cruising. 6 cabins, 12 guests, world-class amenities.',
  },
  {
    id: nanoid(),
    name: 'Azure Dream',
    slug: 'azure-dream',
    featured: true,
    type: 'sailing' as const,
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=1600&q=80',
      alt: 'Azure Dream sailing yacht under full sail',
    }),
    gallery: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80', alt: 'Azure Dream cockpit' },
      { url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&q=80', alt: 'Azure Dream saloon' },
    ]),
    summary: 'An elegant 32-meter sailing yacht that combines traditional craftsmanship with modern performance.',
    description: '<p>Azure Dream represents the pinnacle of sailing yacht design. Built by one of the world\'s most prestigious shipyards, she offers an authentic sailing experience without compromising on luxury.</p><p>Her classic lines hide a thoroughly modern interior with the latest navigation technology and entertainment systems.</p>',
    length: '32m (105ft)',
    beam: '7.2m',
    draft: '4.5m',
    year: 2019,
    guests: 8,
    cabins: 4,
    crew: 5,
    cruisingSpeed: '11 knots',
    highlights: JSON.stringify([
      'Performance sailing capabilities',
      'Teak deck throughout',
      'Award-winning interior design',
      'Underwater lights for night swimming',
      'Full sailing instruction available',
    ]),
    fromPrice: 95000,
    currency: 'EUR',
    priceNote: 'per week + expenses',
    seoTitle: 'Azure Dream | 32m Luxury Sailing Yacht Charter',
    seoDescription: 'Experience authentic sailing on Azure Dream, a 32-meter luxury sailing yacht. Perfect for the Mediterranean with 4 cabins for 8 guests.',
  },
  {
    id: nanoid(),
    name: 'Ocean Oasis',
    slug: 'ocean-oasis',
    featured: true,
    type: 'catamaran' as const,
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1586018055391-fcc3ae9b4e53?w=1600&q=80',
      alt: 'Ocean Oasis luxury catamaran',
    }),
    gallery: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', alt: 'Ocean Oasis deck' },
    ]),
    summary: 'A spacious 24-meter catamaran offering exceptional stability and generous living spaces.',
    description: '<p>Ocean Oasis redefines catamaran charter with her impressive beam providing exceptional interior volume. The flybridge offers 360-degree views and multiple lounging areas.</p><p>Perfect for families or groups who want spacious accommodation with excellent stability at anchor.</p>',
    length: '24m (79ft)',
    beam: '11m',
    draft: '1.8m',
    year: 2022,
    guests: 10,
    cabins: 5,
    crew: 4,
    cruisingSpeed: '10 knots',
    highlights: JSON.stringify([
      'Exceptional stability',
      'Shallow draft for secluded anchorages',
      'Large flybridge with bar',
      'Trampolines for relaxation',
      'Water sports platform',
    ]),
    fromPrice: 65000,
    currency: 'EUR',
    priceNote: 'per week + expenses',
    seoTitle: 'Ocean Oasis | 24m Luxury Catamaran Charter',
    seoDescription: 'Charter Ocean Oasis, a spacious 24-meter luxury catamaran. 5 cabins, 10 guests, perfect stability for Mediterranean cruising.',
  },
  {
    id: nanoid(),
    name: 'Poseidon\'s Pride',
    slug: 'poseidons-pride',
    featured: false,
    type: 'motor' as const,
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1600&q=80',
      alt: 'Poseidon\'s Pride superyacht',
    }),
    summary: 'A commanding 55-meter superyacht with striking design and extensive amenities.',
    description: '<p>Poseidon\'s Pride makes a statement wherever she cruises. Her bold exterior lines complement a sophisticated interior designed for entertaining on a grand scale.</p>',
    length: '55m (180ft)',
    beam: '10m',
    draft: '3.2m',
    year: 2020,
    guests: 14,
    cabins: 7,
    crew: 12,
    cruisingSpeed: '16 knots',
    highlights: JSON.stringify([
      'Helipad',
      'Two-deck main saloon',
      'Full gym and spa',
      'Zero-speed stabilizers',
      'Touch-and-go submarine',
    ]),
    fromPrice: 295000,
    currency: 'EUR',
    priceNote: 'per week + expenses',
    seoTitle: 'Poseidon\'s Pride | 55m Superyacht Charter',
    seoDescription: 'Charter the magnificent Poseidon\'s Pride, a 55-meter superyacht with helipad and exceptional amenities.',
  },
];

// Sample destination data
const sampleDestinations = [
  {
    id: nanoid(),
    name: 'Croatian Coast',
    slug: 'croatian-coast',
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1555990538-1e8c6d9f4f1a?w=1600&q=80',
      alt: 'Dubrovnik old town aerial view',
    }),
    gallery: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80', alt: 'Hvar harbor' },
      { url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=1200&q=80', alt: 'Split waterfront' },
      { url: 'https://images.unsplash.com/photo-1565535996488-86ecdf2a7a8a?w=1200&q=80', alt: 'Croatian islands' },
    ]),
    bestSeason: 'May to October',
    highlights: JSON.stringify([
      'Over 1,000 islands to explore',
      'UNESCO World Heritage sites',
      'Crystal-clear Adriatic waters',
      'World-class gastronomy',
      'Game of Thrones filming locations',
      'Vibrant nightlife in Hvar',
    ]),
    description: '<p>The Croatian coast offers one of the most diverse and beautiful cruising grounds in the Mediterranean. From the historic walls of Dubrovnik to the party island of Hvar, every day brings new discoveries.</p><p>The Dalmatian islands offer protected anchorages, charming villages, and some of the clearest water in the world. Sample fresh seafood at konobas, swim in secluded bays, and explore ancient Roman ruins.</p>',
    itinerary: '<h3>Suggested 7-Day Itinerary</h3><p><strong>Day 1:</strong> Embark in Split, explore Diocletian\'s Palace</p><p><strong>Day 2:</strong> Sail to Bol, visit Zlatni Rat beach</p><p><strong>Day 3:</strong> Hvar town, evening exploration</p><p><strong>Day 4:</strong> Vis island, Blue Cave visit</p><p><strong>Day 5:</strong> Korcula, birthplace of Marco Polo</p><p><strong>Day 6:</strong> Mljet National Park</p><p><strong>Day 7:</strong> Dubrovnik, disembark</p>',
    seoTitle: 'Croatian Coast Yacht Charter | Dalmatian Islands Cruising',
    seoDescription: 'Explore the stunning Croatian coast by yacht. Discover 1,000+ islands, UNESCO sites, and crystal-clear Adriatic waters.',
  },
  {
    id: nanoid(),
    name: 'Greek Islands',
    slug: 'greek-islands',
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600&q=80',
      alt: 'Santorini blue domes and caldera view',
    }),
    gallery: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80', alt: 'Mykonos windmills' },
      { url: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=1200&q=80', alt: 'Greek island bay' },
      { url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1200&q=80', alt: 'Ancient ruins' },
    ]),
    bestSeason: 'June to September',
    highlights: JSON.stringify([
      'Iconic Cycladic architecture',
      'Ancient history and mythology',
      'World-famous sunsets in Santorini',
      'Excellent sailing conditions',
      'Authentic Greek cuisine',
      'Secluded beaches and coves',
    ]),
    description: '<p>Greece offers the ultimate Mediterranean yacht charter experience. With over 6,000 islands scattered across the Aegean and Ionian seas, the possibilities are endless.</p><p>The Cyclades offer iconic white-washed villages and sophisticated nightlife, while the Dodecanese provide history and culture. The Ionian islands feature lush green landscapes and Venetian influences.</p>',
    itinerary: '<h3>Suggested Cyclades Itinerary</h3><p><strong>Day 1:</strong> Athens marina, sail to Kea</p><p><strong>Day 2:</strong> Kythnos, hot springs</p><p><strong>Day 3:</strong> Serifos, charming Chora</p><p><strong>Day 4:</strong> Sifnos, gastronomy island</p><p><strong>Day 5:</strong> Paros, water sports</p><p><strong>Day 6:</strong> Mykonos, nightlife</p><p><strong>Day 7:</strong> Return to Athens</p>',
    seoTitle: 'Greek Islands Yacht Charter | Cyclades & Aegean Cruising',
    seoDescription: 'Charter a yacht in the Greek Islands. Explore the Cyclades, discover ancient history, and experience authentic Greek hospitality.',
  },
  {
    id: nanoid(),
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1600&q=80',
      alt: 'Positano colorful houses on cliffside',
    }),
    gallery: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80', alt: 'Amalfi town' },
      { url: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=1200&q=80', alt: 'Capri blue grotto' },
    ]),
    bestSeason: 'May to October',
    highlights: JSON.stringify([
      'UNESCO World Heritage coastline',
      'Glamorous Capri island',
      'World-renowned cuisine',
      'Historic Pompeii nearby',
      'Limoncello tasting',
      'Spectacular cliff-side villages',
    ]),
    description: '<p>The Amalfi Coast represents Italian glamour at its finest. This dramatic coastline of towering cliffs, pastel-colored villages, and azure waters has captivated travelers for centuries.</p><p>A yacht charter allows you to experience iconic locations like Positano, Ravello, and Capri away from the crowds, anchoring in secluded bays and arriving at restaurants by tender.</p>',
    seoTitle: 'Amalfi Coast Yacht Charter | Italian Riviera Cruising',
    seoDescription: 'Discover the Amalfi Coast by yacht. Explore Capri, Positano, and the Italian Riviera in ultimate luxury.',
  },
  {
    id: nanoid(),
    name: 'French Riviera',
    slug: 'french-riviera',
    heroImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=1600&q=80',
      alt: 'Nice coastline aerial view',
    }),
    bestSeason: 'June to September',
    highlights: JSON.stringify([
      'Glamorous Monaco',
      'Saint-Tropez beaches',
      'Cannes Film Festival atmosphere',
      'Michelin-starred restaurants',
      'Exclusive beach clubs',
      'Art museums and galleries',
    ]),
    description: '<p>The French Riviera is the birthplace of yacht charter, where celebrities and royalty have cruised for over a century. From the casino of Monte Carlo to the beaches of Saint-Tropez, this coast defines Mediterranean glamour.</p>',
    seoTitle: 'French Riviera Yacht Charter | Cote d\'Azur Cruising',
    seoDescription: 'Experience the legendary French Riviera by yacht. Monaco, Saint-Tropez, Cannes - the ultimate Mediterranean luxury.',
  },
];

// Sample blog posts
const samplePosts = [
  {
    id: nanoid(),
    title: 'Ultimate Guide to Chartering a Yacht in Croatia',
    slug: 'ultimate-guide-yacht-charter-croatia',
    excerpt: 'Everything you need to know about planning the perfect Croatian yacht charter, from choosing the right vessel to must-visit destinations.',
    coverImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1555990538-1e8c6d9f4f1a?w=1200&q=80',
      alt: 'Croatian coastline',
    }),
    body: '<h2>Why Croatia?</h2><p>Croatia has emerged as one of the world\'s premier yacht charter destinations, and for good reason. With over 1,200 islands, islets, and reefs dotting the Adriatic Sea, the cruising possibilities are virtually endless.</p><h2>Best Time to Visit</h2><p>The ideal charter season runs from May through October. June and September offer the perfect balance of warm weather, calm seas, and fewer crowds than the peak July-August period.</p><h2>Choosing Your Yacht</h2><p>From sleek motor yachts to classic sailing vessels, Croatia offers options for every preference. Consider a catamaran for families seeking stability, or a performance sailing yacht for experienced sailors.</p>',
    tags: JSON.stringify(['Croatia', 'Yacht Charter', 'Travel Guide']),
    author: 'Marina Kovac',
    publishedAt: new Date('2024-01-15'),
    seoTitle: 'Ultimate Guide to Yacht Charter in Croatia | Mediterana',
    seoDescription: 'Plan your perfect Croatian yacht charter with our comprehensive guide. Expert tips on vessels, itineraries, and hidden gems.',
  },
  {
    id: nanoid(),
    title: '5 Hidden Coves in the Greek Islands',
    slug: '5-hidden-coves-greek-islands',
    excerpt: 'Discover secluded anchorages away from the tourist crowds where you can swim in crystal-clear waters.',
    coverImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=1200&q=80',
      alt: 'Secluded Greek cove',
    }),
    body: '<h2>Escape the Crowds</h2><p>While Mykonos and Santorini capture the headlines, the Greek islands harbor countless secret spots known only to experienced captains and local sailors.</p><h2>1. Kleftiko, Milos</h2><p>Accessible only by sea, these dramatic white cliffs and caves were once used by pirates. The turquoise waters are perfect for snorkeling.</p><h2>2. Kolona Beach, Kythnos</h2><p>A dramatic double-sided beach connecting a small peninsula, rarely crowded even in high season.</p>',
    tags: JSON.stringify(['Greece', 'Hidden Gems', 'Sailing']),
    author: 'Captain Nikos',
    publishedAt: new Date('2024-02-20'),
    seoTitle: '5 Secret Coves in the Greek Islands | Mediterana',
    seoDescription: 'Discover hidden anchorages in the Greek Islands. Secret coves and secluded beaches only accessible by yacht.',
  },
  {
    id: nanoid(),
    title: 'What to Expect on Your First Yacht Charter',
    slug: 'first-yacht-charter-what-to-expect',
    excerpt: 'A complete guide for first-time charterers covering everything from boarding to disembarkation.',
    coverImage: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80',
      alt: 'Luxury yacht at sunset',
    }),
    body: '<h2>Before You Arrive</h2><p>Your charter broker will handle most preparations, but you\'ll want to discuss your preferences for itinerary, cuisine, and activities in advance.</p><h2>Boarding Day</h2><p>Typically scheduled for the afternoon, boarding begins with a welcome from the captain and crew, a safety briefing, and a tour of the yacht.</p><h2>Daily Life on Board</h2><p>Each day unfolds at your own pace. Wake up to coffee served on deck, swim before breakfast, cruise to a new destination, enjoy lunch at anchor, and perhaps visit a shore-side restaurant for dinner.</p>',
    tags: JSON.stringify(['First Charter', 'Tips', 'Yacht Life']),
    author: 'Sarah Mitchell',
    publishedAt: new Date('2024-03-10'),
    seoTitle: 'First Yacht Charter Guide | What to Expect | Mediterana',
    seoDescription: 'First time chartering a yacht? Our complete guide covers everything from boarding to disembarkation.',
  },
];

// Sample team members
const sampleTeamMembers = [
  {
    id: nanoid(),
    name: 'Alexandra Papadopoulos',
    role: 'Founder & CEO',
    image: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
      alt: 'Alexandra Papadopoulos',
    }),
    bio: 'With over 20 years in the luxury yacht industry, Alexandra founded Mediterana to share her passion for extraordinary sea experiences. She personally inspects every yacht in our fleet.',
    email: 'alexandra@mediterana.com',
    linkedin: 'https://linkedin.com/in/alexandrap',
    order: 1,
  },
  {
    id: nanoid(),
    name: 'Marco Bellini',
    role: 'Fleet Manager',
    image: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
      alt: 'Marco Bellini',
    }),
    bio: 'Former superyacht captain with experience on vessels up to 80 meters. Marco ensures our fleet meets the highest standards of safety and luxury.',
    email: 'marco@mediterana.com',
    linkedin: 'https://linkedin.com/in/marcob',
    order: 2,
  },
  {
    id: nanoid(),
    name: 'Sophie Laurent',
    role: 'Charter Consultant',
    image: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
      alt: 'Sophie Laurent',
    }),
    bio: 'Sophie brings a decade of luxury travel experience to crafting bespoke charter itineraries. She specializes in family charters and special celebrations.',
    email: 'sophie@mediterana.com',
    order: 3,
  },
  {
    id: nanoid(),
    name: 'James Crawford',
    role: 'Operations Director',
    image: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      alt: 'James Crawford',
    }),
    bio: 'James coordinates the complex logistics of yacht charter operations, ensuring every charter runs smoothly from embarkation to disembarkation.',
    email: 'james@mediterana.com',
    order: 4,
  },
];

async function seedContent() {
  console.log('🌊 Starting content seed...\n');

  // Seed Yachts
  console.log('🛥️  Seeding yachts...');
  const existingYachts = db.select().from(schema.yachts).all();
  if (existingYachts.length === 0) {
    for (const yacht of sampleYachts) {
      db.insert(schema.yachts).values(yacht).run();
      console.log(`   ✅ Created yacht: ${yacht.name}`);
    }
  } else {
    console.log(`   ⏭️  Skipping - ${existingYachts.length} yachts already exist`);
  }

  // Seed Destinations
  console.log('\n🏝️  Seeding destinations...');
  const existingDestinations = db.select().from(schema.destinations).all();
  if (existingDestinations.length === 0) {
    for (const destination of sampleDestinations) {
      db.insert(schema.destinations).values(destination).run();
      console.log(`   ✅ Created destination: ${destination.name}`);
    }
  } else {
    console.log(`   ⏭️  Skipping - ${existingDestinations.length} destinations already exist`);
  }

  // Seed Blog Posts
  console.log('\n📝 Seeding blog posts...');
  const existingPosts = db.select().from(schema.posts).all();
  if (existingPosts.length === 0) {
    for (const post of samplePosts) {
      db.insert(schema.posts).values(post).run();
      console.log(`   ✅ Created post: ${post.title}`);
    }
  } else {
    console.log(`   ⏭️  Skipping - ${existingPosts.length} posts already exist`);
  }

  // Seed Team Members
  console.log('\n👥 Seeding team members...');
  const existingTeam = db.select().from(schema.teamMembers).all();
  if (existingTeam.length === 0) {
    for (const member of sampleTeamMembers) {
      db.insert(schema.teamMembers).values(member).run();
      console.log(`   ✅ Created team member: ${member.name}`);
    }
  } else {
    console.log(`   ⏭️  Skipping - ${existingTeam.length} team members already exist`);
  }

  // Create yacht-destination relationships
  console.log('\n🔗 Creating relationships...');
  const yachts = db.select().from(schema.yachts).all();
  const destinations = db.select().from(schema.destinations).all();
  const existingRelations = db.select().from(schema.yachtDestinations).all();

  if (existingRelations.length === 0 && yachts.length > 0 && destinations.length > 0) {
    // Link each yacht to 2-3 destinations
    for (const yacht of yachts) {
      const numDestinations = 2 + Math.floor(Math.random() * 2); // 2-3 destinations
      const shuffled = [...destinations].sort(() => 0.5 - Math.random());
      const selectedDestinations = shuffled.slice(0, numDestinations);

      for (const destination of selectedDestinations) {
        db.insert(schema.yachtDestinations).values({
          id: nanoid(),
          yachtId: yacht.id,
          destinationId: destination.id,
        }).run();
      }
      console.log(`   ✅ Linked ${yacht.name} to ${numDestinations} destinations`);
    }

    // Link recommended yachts to destinations
    for (const destination of destinations) {
      const numYachts = 2 + Math.floor(Math.random() * 2); // 2-3 yachts
      const shuffled = [...yachts].sort(() => 0.5 - Math.random());
      const selectedYachts = shuffled.slice(0, numYachts);

      for (let i = 0; i < selectedYachts.length; i++) {
        db.insert(schema.destinationRecommendedYachts).values({
          id: nanoid(),
          destinationId: destination.id,
          yachtId: selectedYachts[i].id,
          order: i,
        }).run();
      }
      console.log(`   ✅ Added ${numYachts} recommended yachts to ${destination.name}`);
    }
  } else {
    console.log('   ⏭️  Skipping - relationships already exist');
  }

  // Update site settings with featured yachts
  console.log('\n⚙️  Updating site settings...');
  const featuredYachts = db
    .select()
    .from(schema.yachts)
    .all()
    .filter((y) => y.featured)
    .map((y) => y.id);

  if (featuredYachts.length > 0) {
    db.update(schema.siteSettings)
      .set({
        featuredYachts: JSON.stringify(featuredYachts),
        footerTagline: 'Experience the Mediterranean in unparalleled luxury. We match you with the right yacht, crew, and itinerary — discreetly, precisely.',
        instagram: 'https://instagram.com/mediteranayachting',
        facebook: 'https://facebook.com/mediteranayachting',
        linkedin: 'https://linkedin.com/company/mediteranayachting',
      })
      .run();
    console.log(`   ✅ Updated site settings with ${featuredYachts.length} featured yachts`);
  }

  // Update home page with section content
  console.log('\n🏠 Updating home page content...');
  db.update(schema.homePage)
    .set({
      heroImage: JSON.stringify({
        url: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=80',
        alt: 'Luxury yacht cruising Mediterranean waters',
      }),
      heroCtas: JSON.stringify([
        { text: 'Explore Our Fleet', href: '/yachts', variant: 'default' },
        { text: 'Contact Us', href: '/contact', variant: 'outline' },
      ]),
      featuredYachtsTitle: 'Our Fleet',
      featuredYachtsSubtitle: 'Handpicked vessels for unforgettable experiences',
      destinationsTitle: 'Destinations',
      destinationsSubtitle: 'Discover the most beautiful cruising grounds in the Mediterranean',
      whyMediteranaTitle: 'Why Mediterana',
      whyMediteranaSubtitle: 'What sets us apart',
      whyMediteranaFeatures: JSON.stringify([
        { icon: 'ship', title: 'Curated Fleet', description: 'Every yacht in our portfolio is personally inspected and approved by our team.' },
        { icon: 'users', title: 'Expert Guidance', description: 'Our charter specialists have decades of combined experience in luxury yachting.' },
        { icon: 'map', title: 'Local Knowledge', description: 'We know the best anchorages, restaurants, and hidden gems in every destination.' },
        { icon: 'clock', title: '24/7 Support', description: 'Our team is available around the clock to ensure your charter is perfect.' },
      ]),
      processTitle: 'Your Journey',
      processSubtitle: 'From inquiry to unforgettable memories',
      processSteps: JSON.stringify([
        { number: '01', title: 'Consultation', description: 'Share your vision with our charter specialists.' },
        { number: '02', title: 'Curation', description: 'We present handpicked yachts and itineraries.' },
        { number: '03', title: 'Customization', description: 'Fine-tune every detail to your preferences.' },
        { number: '04', title: 'Experience', description: 'Embark on your dream Mediterranean adventure.' },
      ]),
      blogTitle: 'Journal',
      blogSubtitle: 'Stories and insights from the Mediterranean',
      ctaTitle: 'Ready to set sail?',
      ctaDescription: 'Contact our team to start planning your perfect yacht charter.',
      ctaButtonText: 'Get in Touch',
      ctaButtonHref: '/contact',
    })
    .run();
  console.log('   ✅ Updated home page sections');

  // Update about page
  console.log('\n📖 Updating about page content...');
  db.update(schema.aboutPage)
    .set({
      heroImage: JSON.stringify({
        url: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&q=80',
        alt: 'Yacht deck with Mediterranean view',
      }),
      storyTitle: 'Our Story',
      storyContent: '<p>Founded in 2010 by passionate yachting enthusiasts, Mediterana was born from a simple belief: that everyone deserves to experience the magic of the Mediterranean from the deck of a beautiful yacht.</p><p>What started as a small fleet of carefully selected vessels has grown into one of the region\'s most respected charter companies, yet we\'ve never lost sight of our founding principles: personal service, attention to detail, and an unwavering commitment to excellence.</p>',
      storyImage: JSON.stringify({
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
        alt: 'Mediterranean coastline from yacht',
      }),
      statistics: JSON.stringify([
        { value: '50+', label: 'Yachts in Fleet' },
        { value: '15+', label: 'Years Experience' },
        { value: '1000+', label: 'Happy Clients' },
        { value: '20+', label: 'Destinations' },
      ]),
      valuesTitle: 'Our Values',
      valuesSubtitle: 'The principles that guide everything we do',
      values: JSON.stringify([
        { icon: 'heart', title: 'Passion', description: 'We love what we do, and it shows in every charter we organize.' },
        { icon: 'shield', title: 'Trust', description: 'Transparency and honesty are the foundation of every client relationship.' },
        { icon: 'star', title: 'Excellence', description: 'We settle for nothing less than perfection in every aspect of our service.' },
        { icon: 'users', title: 'Personal Touch', description: 'Every client is unique, and every charter is tailored to their desires.' },
      ]),
      teamTitle: 'Meet Our Team',
      teamSubtitle: 'The people behind your perfect charter',
      ctaTitle: 'Start Your Journey',
      ctaDescription: 'Let us help you create memories that last a lifetime.',
      ctaButtonText: 'Contact Us',
      ctaButtonHref: '/contact',
    })
    .run();
  console.log('   ✅ Updated about page sections');

  // Update contact page
  console.log('\n📞 Updating contact page content...');
  db.update(schema.contactPage)
    .set({
      heroImage: JSON.stringify({
        url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1920&q=80',
        alt: 'Mediterranean harbor',
      }),
      contactEmail: 'info@mediterana.com',
      contactPhone: '+385 91 123 4567',
      contactWhatsapp: '+385911234567',
      contactAddress: 'Riva 16, 21000 Split, Croatia',
      officeHours: JSON.stringify([
        { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
        { days: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { days: 'Sunday', hours: 'By appointment' },
      ]),
      timezoneNote: 'Central European Time (CET)',
      faqTitle: 'Frequently Asked Questions',
      faqItems: JSON.stringify([
        { question: 'How far in advance should I book?', answer: 'For peak season (July-August), we recommend booking 6-12 months in advance. For shoulder season, 3-6 months is usually sufficient.' },
        { question: 'What\'s included in the charter price?', answer: 'The base charter fee includes the yacht, crew, and basic insurance. Additional expenses typically include fuel, food, beverages, marina fees, and crew gratuity.' },
        { question: 'Can I customize my itinerary?', answer: 'Absolutely! While we provide suggested itineraries, your charter is completely flexible. Work with your captain to create the perfect route.' },
        { question: 'What if the weather is bad?', answer: 'Your experienced captain will adjust the itinerary to ensure your safety and comfort. The Mediterranean offers many protected anchorages.' },
      ]),
    })
    .run();
  console.log('   ✅ Updated contact page sections');

  console.log('\n🎉 Content seed completed successfully!\n');

  // Summary
  const finalCounts = {
    yachts: db.select().from(schema.yachts).all().length,
    destinations: db.select().from(schema.destinations).all().length,
    posts: db.select().from(schema.posts).all().length,
    teamMembers: db.select().from(schema.teamMembers).all().length,
  };

  console.log('📊 Database Summary:');
  console.log(`   • Yachts: ${finalCounts.yachts}`);
  console.log(`   • Destinations: ${finalCounts.destinations}`);
  console.log(`   • Blog Posts: ${finalCounts.posts}`);
  console.log(`   • Team Members: ${finalCounts.teamMembers}`);

  sqlite.close();
}

seedContent().catch((err) => {
  console.error('❌ Content seed failed:', err);
  process.exit(1);
});
