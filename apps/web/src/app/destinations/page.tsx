import type { Metadata } from "next";
import Image from "next/image";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { allDestinationsQuery } from "@/lib/sanity/queries";
import type { Destination } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore the most beautiful Mediterranean destinations for your luxury yacht charter.",
};

export const revalidate = 3600;

// Fallback destinations data
const fallbackDestinations: Destination[] = [
  {
    _id: "1",
    _type: "destination",
    name: "Greek Islands",
    slug: { current: "greek-islands" },
    heroImage: { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", alt: "Santorini, Greek Islands" },
    gallery: [],
    bestSeason: "May - October",
    highlights: ["Ancient ruins", "Crystal waters", "Vibrant nightlife", "Traditional villages"],
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
    highlights: ["Medieval towns", "Hidden coves", "Fresh seafood", "National parks"],
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
    highlights: ["Cliffside villages", "Italian cuisine", "Scenic drives", "Capri"],
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
    highlights: ["Glamorous ports", "Art galleries", "Fine dining", "Casino"],
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
    highlights: ["Ancient history", "Turquoise bays", "Warm hospitality", "Bazaars"],
    description: [],
    itinerary: [],
  },
];

async function getDestinations(): Promise<Destination[]> {
  if (!isSanityConfigured || !sanityClient) {
    return fallbackDestinations;
  }

  try {
    const destinations = await sanityClient.fetch<Destination[]>(allDestinationsQuery);
    return destinations?.length > 0 ? destinations : fallbackDestinations;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return fallbackDestinations;
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80"
            alt="Mediterranean coastline"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">Destinations</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            From the azure waters of Greece to the glamorous ports of the French Riviera, discover your perfect Mediterranean escape.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <DestinationCard
                key={destination._id}
                destination={destination}
                variant={index === 0 ? "large" : "default"}
                className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Not sure where to go?"
        subtitle="Our charter specialists can help you choose the perfect destination based on your interests, time of year, and preferred experiences."
        primaryCta={{ label: "Get Expert Advice", href: "/contact" }}
        secondaryCta={{ label: "View Our Fleet", href: "/yachts" }}
        variant="light"
      />
    </>
  );
}
