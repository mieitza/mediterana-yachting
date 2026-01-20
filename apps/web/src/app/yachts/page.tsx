import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { YachtCard } from "@/components/yachts/YachtCard";
import { YachtFilters } from "./YachtFilters";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { allYachtsQuery } from "@/lib/sanity/queries";
import type { Yacht } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Our Yachts",
  description: "Explore our curated fleet of luxury yachts available for charter in the Mediterranean.",
};

export const revalidate = 0; // Disable caching to always fetch fresh data

// Fallback yachts data
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
    summary: "A stunning 45-meter motor yacht perfect for Mediterranean adventures with spacious decks and luxurious interiors.",
    description: [],
    specs: { length: 45, beam: 9, year: 2021, guests: 12, cabins: 6, crew: 8 },
    highlights: ["Jacuzzi on deck", "Water toys included", "Experienced crew"],
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
    summary: "Classic sailing elegance meets modern luxury on this beautifully maintained 32-meter sailing yacht.",
    description: [],
    specs: { length: 32, beam: 7, year: 2019, guests: 8, cabins: 4, crew: 4 },
    highlights: ["Award-winning design", "Gourmet chef", "Diving equipment"],
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
    summary: "Spacious catamaran offering exceptional stability and comfort, perfect for family adventures.",
    description: [],
    specs: { length: 24, beam: 12, year: 2022, guests: 10, cabins: 5, crew: 3 },
    highlights: ["Family friendly", "Stable platform", "Large deck space"],
    pricing: { fromPrice: 35000, currency: "EUR" },
  },
  {
    _id: "4",
    _type: "yacht",
    name: "Mediterranean Pearl",
    slug: { current: "mediterranean-pearl" },
    featured: false,
    type: "motor",
    heroImage: { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80", alt: "Mediterranean Pearl yacht" },
    gallery: [],
    summary: "Elegant 38-meter motor yacht combining classic lines with contemporary comfort.",
    description: [],
    specs: { length: 38, beam: 8, year: 2020, guests: 10, cabins: 5, crew: 6 },
    highlights: ["Beach club", "Gym", "Cinema room"],
    pricing: { fromPrice: 65000, currency: "EUR" },
  },
  {
    _id: "5",
    _type: "yacht",
    name: "Wind Dancer",
    slug: { current: "wind-dancer" },
    featured: false,
    type: "sailing",
    heroImage: { url: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800&q=80", alt: "Wind Dancer sailing yacht" },
    gallery: [],
    summary: "Performance sailing yacht for those who appreciate the art of sailing without compromising on comfort.",
    description: [],
    specs: { length: 28, beam: 6, year: 2018, guests: 6, cabins: 3, crew: 3 },
    highlights: ["Racing pedigree", "Carbon fiber mast", "Eco-friendly"],
    pricing: { fromPrice: 32000, currency: "EUR" },
  },
  {
    _id: "6",
    _type: "yacht",
    name: "Horizon Explorer",
    slug: { current: "horizon-explorer" },
    featured: true,
    type: "motor",
    heroImage: { url: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=800&q=80", alt: "Horizon Explorer yacht" },
    gallery: [],
    summary: "Adventure-ready expedition yacht built for extended cruising and exploration.",
    description: [],
    specs: { length: 52, beam: 10, year: 2023, guests: 14, cabins: 7, crew: 10 },
    highlights: ["Long range", "Helipad", "Submarine"],
    pricing: { fromPrice: 120000, currency: "EUR" },
  },
  {
    _id: "7",
    _type: "yacht",
    name: "Sunset Breeze",
    slug: { current: "sunset-breeze" },
    featured: false,
    type: "catamaran",
    heroImage: { url: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80", alt: "Sunset Breeze catamaran" },
    gallery: [],
    summary: "Modern catamaran perfect for intimate groups seeking comfort and style.",
    description: [],
    specs: { length: 20, beam: 10, year: 2021, guests: 8, cabins: 4, crew: 2 },
    highlights: ["Solar powered", "Spacious saloon", "BBQ area"],
    pricing: { fromPrice: 28000, currency: "EUR" },
  },
  {
    _id: "8",
    _type: "yacht",
    name: "Royal Odyssey",
    slug: { current: "royal-odyssey" },
    featured: true,
    type: "motor",
    heroImage: { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80", alt: "Royal Odyssey yacht" },
    gallery: [],
    summary: "Superyacht offering unparalleled luxury, perfect for exclusive events and celebrations.",
    description: [],
    specs: { length: 60, beam: 11, year: 2022, guests: 16, cabins: 8, crew: 12 },
    highlights: ["Pool", "Spa", "Private chef"],
    pricing: { fromPrice: 180000, currency: "EUR" },
  },
  {
    _id: "9",
    _type: "yacht",
    name: "Azure Spirit",
    slug: { current: "azure-spirit" },
    featured: false,
    type: "sailing",
    heroImage: { url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80", alt: "Azure Spirit sailing yacht" },
    gallery: [],
    summary: "Traditional sailing yacht with modern amenities, ideal for authentic sailing experiences.",
    description: [],
    specs: { length: 26, beam: 5.5, year: 2017, guests: 6, cabins: 3, crew: 2 },
    highlights: ["Classic design", "Wood interior", "Intimate"],
    pricing: { fromPrice: 22000, currency: "EUR" },
  },
  {
    _id: "10",
    _type: "yacht",
    name: "Island Hopper",
    slug: { current: "island-hopper" },
    featured: false,
    type: "catamaran",
    heroImage: { url: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=800&q=80", alt: "Island Hopper catamaran" },
    gallery: [],
    summary: "Versatile catamaran designed for island exploration with shallow draft capability.",
    description: [],
    specs: { length: 22, beam: 11, year: 2020, guests: 10, cabins: 5, crew: 3 },
    highlights: ["Shallow draft", "Kayaks included", "Snorkeling gear"],
    pricing: { fromPrice: 30000, currency: "EUR" },
  },
];

async function getYachts(): Promise<Yacht[]> {
  if (!isSanityConfigured || !sanityClient) {
    return fallbackYachts;
  }

  try {
    const yachts = await sanityClient.fetch<Yacht[]>(allYachtsQuery);
    return yachts?.length > 0 ? yachts : fallbackYachts;
  } catch (error) {
    console.error("Error fetching yachts:", error);
    return fallbackYachts;
  }
}

interface PageProps {
  searchParams: Promise<{
    type?: string;
    guests?: string;
    length?: string;
  }>;
}

export default async function YachtsPage({ searchParams }: PageProps) {
  const yachts = await getYachts();
  const params = await searchParams;

  // Filter yachts based on query params
  let filteredYachts = [...yachts];

  if (params.type && params.type !== "all") {
    filteredYachts = filteredYachts.filter((y) => y.type === params.type);
  }

  if (params.guests) {
    const minGuests = parseInt(params.guests);
    if (!isNaN(minGuests)) {
      filteredYachts = filteredYachts.filter((y) => y.specs.guests >= minGuests);
    }
  }

  if (params.length) {
    const minLength = parseInt(params.length);
    if (!isNaN(minLength)) {
      filteredYachts = filteredYachts.filter((y) => y.specs.length >= minLength);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&q=80"
            alt="Luxury yachts"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">Our Fleet</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Explore our curated selection of exceptional yachts, each handpicked for quality, comfort, and crew excellence.
          </p>
        </div>
      </section>

      {/* Filters and Grid */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <Suspense fallback={<div className="h-16" />}>
            <YachtFilters />
          </Suspense>

          {/* Results count */}
          <p className="text-text-muted mb-8">
            Showing {filteredYachts.length} {filteredYachts.length === 1 ? "yacht" : "yachts"}
          </p>

          {/* Grid */}
          {filteredYachts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredYachts.map((yacht) => (
                <YachtCard key={yacht._id} yacht={yacht} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">
                No yachts match your current filters.
              </p>
              <p className="text-text-muted mt-2">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Can't find what you're looking for?"
        subtitle="Our team has access to an extensive network of yachts. Let us know your requirements and we'll find the perfect match."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
        variant="light"
      />
    </>
  );
}
