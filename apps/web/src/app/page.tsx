import Image from "next/image";
import Link from "next/link";
import { Compass, Ship, Shield, Users, Calendar, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YachtCard } from "@/components/yachts/YachtCard";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import {
  featuredYachtsQuery,
  allDestinationsQuery,
  latestPostsQuery,
} from "@/lib/sanity/queries";
import type { Yacht, Destination, Post } from "@/lib/sanity/types";

// Revalidate every hour
export const revalidate = 3600;

// Fallback data for when Sanity is not configured
const fallbackYachts: Yacht[] = [
  {
    _id: "1",
    _type: "yacht",
    name: "Azure Dream",
    slug: { current: "azure-dream" },
    featured: true,
    type: "motor",
    heroImage: { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80", alt: "Azure Dream yacht" },
    gallery: [],
    summary: "A stunning 45-meter motor yacht perfect for Mediterranean adventures.",
    description: [],
    specs: { length: 45, year: 2021, guests: 12, cabins: 6 },
    highlights: [],
    pricing: { fromPrice: 85000, currency: "EUR" },
  },
  {
    _id: "2",
    _type: "yacht",
    name: "Bella Vita",
    slug: { current: "bella-vita" },
    featured: true,
    type: "sailing",
    heroImage: { url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80", alt: "Bella Vita sailing yacht" },
    gallery: [],
    summary: "Classic sailing elegance meets modern luxury on this 32-meter beauty.",
    description: [],
    specs: { length: 32, year: 2019, guests: 8, cabins: 4 },
    highlights: [],
    pricing: { fromPrice: 45000, currency: "EUR" },
  },
  {
    _id: "3",
    _type: "yacht",
    name: "Sea Serenity",
    slug: { current: "sea-serenity" },
    featured: true,
    type: "catamaran",
    heroImage: { url: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=80", alt: "Sea Serenity catamaran" },
    gallery: [],
    summary: "Spacious catamaran offering stability and comfort for family adventures.",
    description: [],
    specs: { length: 24, year: 2022, guests: 10, cabins: 5 },
    highlights: [],
    pricing: { fromPrice: 35000, currency: "EUR" },
  },
];

const fallbackDestinations: Destination[] = [
  {
    _id: "1",
    _type: "destination",
    name: "Greek Islands",
    slug: { current: "greek-islands" },
    heroImage: { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", alt: "Santorini, Greek Islands" },
    gallery: [],
    bestSeason: "May - October",
    highlights: ["Ancient ruins", "Crystal waters", "Vibrant nightlife"],
    description: [],
    itinerary: [],
  },
  {
    _id: "2",
    _type: "destination",
    name: "Croatian Coast",
    slug: { current: "croatian-coast" },
    heroImage: { url: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80", alt: "Dubrovnik, Croatia" },
    gallery: [],
    bestSeason: "June - September",
    highlights: ["Medieval towns", "Hidden coves", "Fresh seafood"],
    description: [],
    itinerary: [],
  },
  {
    _id: "3",
    _type: "destination",
    name: "Amalfi Coast",
    slug: { current: "amalfi-coast" },
    heroImage: { url: "https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800&q=80", alt: "Positano, Amalfi Coast" },
    gallery: [],
    bestSeason: "April - October",
    highlights: ["Cliffside villages", "Italian cuisine", "Scenic drives"],
    description: [],
    itinerary: [],
  },
  {
    _id: "4",
    _type: "destination",
    name: "French Riviera",
    slug: { current: "french-riviera" },
    heroImage: { url: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&q=80", alt: "Nice, French Riviera" },
    gallery: [],
    bestSeason: "May - September",
    highlights: ["Glamorous ports", "Art galleries", "Fine dining"],
    description: [],
    itinerary: [],
  },
  {
    _id: "5",
    _type: "destination",
    name: "Turkish Coast",
    slug: { current: "turkish-coast" },
    heroImage: { url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80", alt: "Bodrum, Turkey" },
    gallery: [],
    bestSeason: "May - October",
    highlights: ["Ancient history", "Turquoise bays", "Warm hospitality"],
    description: [],
    itinerary: [],
  },
];

const fallbackPosts: Post[] = [
  {
    _id: "1",
    _type: "post",
    title: "The Ultimate Guide to Mediterranean Yacht Chartering",
    slug: { current: "ultimate-guide-mediterranean-yacht-chartering" },
    excerpt: "Everything you need to know about planning your first luxury yacht charter in the Mediterranean.",
    coverImage: { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80", alt: "Yacht at sunset" },
    body: [],
    tags: ["Guide", "Mediterranean"],
    publishedAt: "2024-01-15",
  },
  {
    _id: "2",
    _type: "post",
    title: "Top 5 Hidden Gems in the Greek Islands",
    slug: { current: "top-5-hidden-gems-greek-islands" },
    excerpt: "Discover secluded beaches and charming villages away from the tourist crowds.",
    coverImage: { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", alt: "Greek island cove" },
    body: [],
    tags: ["Greece", "Travel Tips"],
    publishedAt: "2024-01-10",
  },
  {
    _id: "3",
    _type: "post",
    title: "What to Pack for Your Yacht Charter",
    slug: { current: "what-to-pack-yacht-charter" },
    excerpt: "A comprehensive packing list for the perfect yacht vacation.",
    coverImage: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", alt: "Beach accessories" },
    body: [],
    tags: ["Tips", "Packing"],
    publishedAt: "2024-01-05",
  },
];

async function getData() {
  if (!isSanityConfigured || !sanityClient) {
    return {
      yachts: fallbackYachts,
      destinations: fallbackDestinations,
      posts: fallbackPosts,
    };
  }

  try {
    const [yachts, destinations, posts] = await Promise.all([
      sanityClient.fetch<Yacht[]>(featuredYachtsQuery),
      sanityClient.fetch<Destination[]>(allDestinationsQuery),
      sanityClient.fetch<Post[]>(latestPostsQuery),
    ]);

    return {
      yachts: yachts?.length > 0 ? yachts : fallbackYachts,
      destinations: destinations?.length > 0 ? destinations : fallbackDestinations,
      posts: posts?.length > 0 ? posts : fallbackPosts,
    };
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return {
      yachts: fallbackYachts,
      destinations: fallbackDestinations,
      posts: fallbackPosts,
    };
  }
}

const processSteps = [
  {
    icon: Compass,
    title: "Discover",
    description: "Tell us about your dream charter — destinations, dates, preferences, and special occasions.",
  },
  {
    icon: Ship,
    title: "Match",
    description: "We curate a selection of yachts and itineraries tailored to your unique requirements.",
  },
  {
    icon: Calendar,
    title: "Charter",
    description: "Set sail with confidence, knowing every detail has been meticulously arranged for you.",
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Trusted Expertise",
    description: "Over a decade of experience in luxury Mediterranean charters.",
  },
  {
    icon: Users,
    title: "Personal Service",
    description: "Dedicated charter specialists available around the clock.",
  },
  {
    icon: Ship,
    title: "Curated Fleet",
    description: "Hand-selected yachts that meet our exacting standards.",
  },
  {
    icon: Phone,
    title: "Concierge Support",
    description: "From provisioning to shore excursions, we handle every detail.",
  },
];

export default async function HomePage() {
  const { yachts, destinations, posts } = await getData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85"
          alt="Luxury yacht in the Mediterranean"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/50" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-shadow animate-in">
            Experience the Mediterranean
            <br />
            <span className="text-sand">in Unparalleled Luxury</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-in" style={{ animationDelay: "0.1s" }}>
            Bespoke yacht charters with personalized service, curated itineraries, and access to the finest vessels.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-in" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="xl" className="bg-sand text-navy hover:bg-sand/90">
              <Link href="/contact">Enquire Now</Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
              <Link href="/yachts">View Yachts</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Yachts */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>Featured Yachts</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Explore our curated selection of exceptional vessels, each offering a unique way to experience the Mediterranean.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yachts.slice(0, 6).map((yacht) => (
              <YachtCard key={yacht._id} yacht={yacht} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/yachts">
                View All Yachts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-padding bg-bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>Destinations</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              From the azure waters of Greece to the glamorous ports of the French Riviera, discover your perfect Mediterranean escape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 3).map((destination, index) => (
              <DestinationCard
                key={destination._id}
                destination={destination}
                variant={index === 0 ? "large" : "default"}
                className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
              />
            ))}
            {destinations.slice(3, 5).map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinations">
                Explore All Destinations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Mediterana */}
      <section className="section-padding bg-bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>Why Mediterana</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              We match you with the right yacht, crew, and itinerary — discreetly, precisely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-navy/10 rounded-full mb-4">
                  <item.icon className="h-8 w-8 text-navy" />
                </div>
                <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                <p className="mt-2 text-text-secondary text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="section-padding bg-bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>The Charter Process</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              From initial inquiry to setting sail, we make chartering effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Connector line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                )}

                <div className="inline-flex items-center justify-center w-16 h-16 bg-navy text-white rounded-full mb-4 relative z-10">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-medium text-text-primary">{step.title}</h3>
                <p className="mt-2 text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>From the Journal</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Insights, guides, and inspiration for your next Mediterranean adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                Read More Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to set sail?"
        subtitle="Let us match you with the perfect yacht and itinerary for your Mediterranean adventure."
        primaryCta={{ label: "Enquire Now", href: "/contact" }}
        secondaryCta={{ label: "View Our Fleet", href: "/yachts" }}
        backgroundImage="https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&q=80"
      />
    </>
  );
}
