import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Sparkles, ArrowLeft, Sun, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortableText } from "@/components/PortableText";
import { YachtCard } from "@/components/yachts/YachtCard";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { destinationBySlugQuery, destinationSlugsQuery } from "@/lib/sanity/queries";
import type { Destination } from "@/lib/sanity/types";

export const revalidate = 0; // Disable caching to always fetch fresh data

// Fallback destination
const fallbackDestination: Destination = {
  _id: "1",
  _type: "destination",
  name: "Greek Islands",
  slug: { current: "greek-islands" },
  heroImage: { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=85", alt: "Santorini sunset" },
  gallery: [
    { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80", alt: "Santorini" },
    { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", alt: "Mykonos" },
    { url: "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=800&q=80", alt: "Greek beach" },
  ],
  bestSeason: "May - October",
  highlights: ["Ancient ruins and history", "Crystal clear waters", "World-renowned nightlife", "Traditional whitewashed villages", "Exceptional cuisine"],
  description: [
    {
      _type: "block",
      _key: "1",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "The Greek Islands offer an unparalleled yachting experience, combining ancient history, stunning natural beauty, and legendary hospitality. With over 6,000 islands and islets, Greece provides endless possibilities for exploration.",
        },
      ],
    },
    {
      _type: "block",
      _key: "2",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "From the iconic sunsets of Santorini to the cosmopolitan energy of Mykonos, the pristine beaches of the Cyclades to the lush greenery of the Ionian Islands, each destination offers its own unique character and charm.",
        },
      ],
    },
  ],
  itinerary: [
    {
      _type: "block",
      _key: "1",
      style: "h3",
      children: [{ _type: "span", text: "Day 1-2: Athens & Saronic Gulf" }],
    },
    {
      _type: "block",
      _key: "2",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Begin your journey in Athens, exploring the Acropolis before boarding your yacht. Cruise to the nearby Saronic Islands - Hydra, Poros, or Aegina - for a gentle introduction to island hopping.",
        },
      ],
    },
    {
      _type: "block",
      _key: "3",
      style: "h3",
      children: [{ _type: "span", text: "Day 3-4: Cyclades - Mykonos" }],
    },
    {
      _type: "block",
      _key: "4",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Sail to Mykonos, the cosmopolitan heart of the Cyclades. Explore the charming Chora with its windmills and Little Venice, enjoy world-class dining, and experience the legendary nightlife.",
        },
      ],
    },
    {
      _type: "block",
      _key: "5",
      style: "h3",
      children: [{ _type: "span", text: "Day 5-6: Cyclades - Santorini" }],
    },
    {
      _type: "block",
      _key: "6",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Continue to Santorini, anchoring in the dramatic caldera. Visit the villages of Oia and Fira, tour local wineries, and witness one of the world's most spectacular sunsets.",
        },
      ],
    },
    {
      _type: "block",
      _key: "7",
      style: "h3",
      children: [{ _type: "span", text: "Day 7: Return" }],
    },
    {
      _type: "block",
      _key: "8",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Leisurely cruise back toward Athens or extend your journey to explore more of the Cyclades, Dodecanese, or the unspoiled Sporades.",
        },
      ],
    },
  ],
};

async function getDestination(slug: string): Promise<Destination | null> {
  if (!isSanityConfigured || !sanityClient) {
    return slug === "greek-islands" ? fallbackDestination : null;
  }

  try {
    const destination = await sanityClient.fetch<Destination>(destinationBySlugQuery, { slug });
    return destination || (slug === "greek-islands" ? fallbackDestination : null);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return slug === "greek-islands" ? fallbackDestination : null;
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured || !sanityClient) {
    return [{ slug: "greek-islands" }];
  }

  try {
    const slugs = await sanityClient.fetch<string[]>(destinationSlugsQuery);
    return slugs?.map((slug) => ({ slug })) || [{ slug: "greek-islands" }];
  } catch (error) {
    return [{ slug: "greek-islands" }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    return {
      title: "Destination Not Found",
    };
  }

  return {
    title: destination.name,
    description: `Discover ${destination.name} by yacht. Best time to visit: ${destination.bestSeason}. ${destination.highlights.slice(0, 3).join(", ")}.`,
    openGraph: {
      title: `${destination.name} | Mediterana Yachting`,
      description: `Charter a yacht to explore ${destination.name}`,
      images: [destination.heroImage.url],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        <Image
          src={destination.heroImage.url}
          alt={destination.heroImage.alt || destination.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />

        {/* Back link */}
        <div className="absolute top-24 md:top-28 left-4 z-20">
          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Destinations
            </Link>
          </Button>
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-12 text-white">
          <h1 className="text-shadow">{destination.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-white/80">
              <Sun className="h-5 w-5" />
              <span>Best time: {destination.bestSeason}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Why Visit {destination.name}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-bg-surface rounded-lg">
                        <Sparkles className="h-5 w-5 text-sand flex-shrink-0" />
                        <span className="text-text-secondary">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {destination.description && destination.description.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Overview</h2>
                  <PortableText value={destination.description} className="prose-luxury" />
                </div>
              )}

              {/* Gallery */}
              {destination.gallery && destination.gallery.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {destination.gallery.map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt || `${destination.name} ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {destination.itinerary && destination.itinerary.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Suggested Itinerary</h2>
                  <div className="bg-bg-surface p-6 md:p-8 rounded-lg">
                    <PortableText value={destination.itinerary} className="prose-luxury" />
                  </div>
                  <p className="mt-4 text-text-muted text-sm">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    This is a sample itinerary. Your charter will be fully customized to your preferences.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Quick Info */}
                <div className="bg-bg-surface p-6 rounded-lg mb-6">
                  <h3 className="font-medium text-text-primary mb-4">Quick Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-navy" />
                      <div>
                        <p className="text-sm text-text-muted">Best Season</p>
                        <p className="font-medium">{destination.bestSeason}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="bg-bg-surface p-6 rounded-lg shadow-soft">
                  <h3 className="font-medium text-text-primary mb-4">Plan Your Charter</h3>
                  <InquiryForm
                    prefilledDestination={{ slug: destination.slug.current, name: destination.name }}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Yachts */}
      {destination.featuredYachts && destination.featuredYachts.length > 0 && (
        <section className="section-padding bg-bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">Recommended Yachts for {destination.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destination.featuredYachts.map((yacht) => (
                <YachtCard key={yacht._id} yacht={yacht} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title={`Ready to explore ${destination.name}?`}
        subtitle="Let our specialists create a bespoke itinerary tailored to your interests."
        primaryCta={{ label: "Start Planning", href: "/contact" }}
        secondaryCta={{ label: "View Our Fleet", href: "/yachts" }}
        backgroundImage={destination.heroImage.url}
      />
    </>
  );
}
