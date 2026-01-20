import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Ruler, Anchor, Calendar, Ship, Waves, Gauge, ArrowLeft, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YachtGallery } from "@/components/yachts/YachtGallery";
import { PortableText } from "@/components/PortableText";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { yachtBySlugQuery, yachtSlugsQuery } from "@/lib/sanity/queries";
import type { Yacht } from "@/lib/sanity/types";

export const revalidate = 0; // Disable caching to always fetch fresh data

// Fallback yacht for demo
const fallbackYacht: Yacht = {
  _id: "1",
  _type: "yacht",
  name: "Azure Dream",
  slug: { current: "azure-dream" },
  featured: true,
  type: "motor",
  heroImage: { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85", alt: "Azure Dream yacht" },
  gallery: [
    { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1200&q=80", alt: "Exterior view" },
    { url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1200&q=80", alt: "Sailing view" },
    { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1200&q=80", alt: "Sunset" },
    { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80", alt: "Interior" },
  ],
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  summary: "A stunning 45-meter motor yacht perfect for Mediterranean adventures.",
  description: [
    {
      _type: "block",
      _key: "1",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Azure Dream represents the pinnacle of luxury yachting, combining sophisticated Italian design with cutting-edge technology and uncompromising comfort. Built in 2021 by a renowned Italian shipyard, she offers an exceptional charter experience for up to 12 guests.",
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
          text: "Her spacious interior features six beautifully appointed staterooms, each with en-suite facilities and individually controlled climate systems. The master suite occupies the full beam of the yacht and includes a private study, walk-in wardrobe, and spa bathroom.",
        },
      ],
    },
    {
      _type: "block",
      _key: "3",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "On deck, guests can relax in the jacuzzi, enjoy al fresco dining, or take advantage of the extensive collection of water toys stored in the beach club. The experienced crew of 8 ensures every moment aboard is seamless and memorable.",
        },
      ],
    },
  ],
  specs: {
    length: 45,
    beam: 9,
    draft: 2.8,
    year: 2021,
    guests: 12,
    cabins: 6,
    crew: 8,
    cruisingSpeed: 14,
  },
  highlights: [
    "Jacuzzi on sun deck",
    "Extensive water toys collection",
    "Award-winning interior design",
    "Experienced international crew",
    "Zero-speed stabilizers",
    "Beach club with fold-out platforms",
  ],
  pricing: {
    fromPrice: 85000,
    currency: "EUR",
    priceNote: "Plus expenses (APA typically 30%)",
  },
};

async function getYacht(slug: string): Promise<Yacht | null> {
  if (!isSanityConfigured || !sanityClient) {
    return slug === "azure-dream" ? fallbackYacht : null;
  }

  try {
    const yacht = await sanityClient.fetch<Yacht>(yachtBySlugQuery, { slug });
    return yacht || (slug === "azure-dream" ? fallbackYacht : null);
  } catch (error) {
    console.error("Error fetching yacht:", error);
    return slug === "azure-dream" ? fallbackYacht : null;
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured || !sanityClient) {
    return [{ slug: "azure-dream" }];
  }

  try {
    const slugs = await sanityClient.fetch<string[]>(yachtSlugsQuery);
    return slugs?.map((slug) => ({ slug })) || [{ slug: "azure-dream" }];
  } catch (error) {
    return [{ slug: "azure-dream" }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yacht = await getYacht(slug);

  if (!yacht) {
    return {
      title: "Yacht Not Found",
    };
  }

  return {
    title: yacht.name,
    description: yacht.summary,
    openGraph: {
      title: `${yacht.name} | Mediterana Yachting`,
      description: yacht.summary,
      images: [yacht.heroImage.url],
    },
  };
}

const typeLabels = {
  motor: "Motor Yacht",
  sailing: "Sailing Yacht",
  catamaran: "Catamaran",
};

export default async function YachtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yacht = await getYacht(slug);

  if (!yacht) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: yacht.name,
    description: yacht.summary,
    image: yacht.heroImage.url,
    brand: {
      "@type": "Brand",
      name: "Mediterana Yachting",
    },
    offers: yacht.pricing?.fromPrice
      ? {
          "@type": "Offer",
          price: yacht.pricing.fromPrice,
          priceCurrency: yacht.pricing.currency,
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-24 md:pt-28">
        {/* Back link */}
        <div className="absolute top-24 md:top-28 left-4 z-20">
          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Link href="/yachts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fleet
            </Link>
          </Button>
        </div>

        {/* Gallery */}
        <div className="container mx-auto px-4 pt-12">
          <YachtGallery images={yacht.gallery.length > 0 ? yacht.gallery : [yacht.heroImage]} yachtName={yacht.name} />
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <span className="text-navy text-sm font-medium uppercase tracking-wider">
                  {typeLabels[yacht.type]}
                </span>
                <h1 className="mt-2">{yacht.name}</h1>
                <p className="mt-4 text-lg text-text-secondary">{yacht.summary}</p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-bg-surface rounded-lg mb-8">
                <div className="text-center">
                  <Ruler className="h-5 w-5 mx-auto text-navy" />
                  <p className="mt-1 font-medium">{yacht.specs.length}m</p>
                  <p className="text-sm text-text-muted">Length</p>
                </div>
                <div className="text-center">
                  <Users className="h-5 w-5 mx-auto text-navy" />
                  <p className="mt-1 font-medium">{yacht.specs.guests}</p>
                  <p className="text-sm text-text-muted">Guests</p>
                </div>
                <div className="text-center">
                  <Anchor className="h-5 w-5 mx-auto text-navy" />
                  <p className="mt-1 font-medium">{yacht.specs.cabins}</p>
                  <p className="text-sm text-text-muted">Cabins</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-5 w-5 mx-auto text-navy" />
                  <p className="mt-1 font-medium">{yacht.specs.year}</p>
                  <p className="text-sm text-text-muted">Built</p>
                </div>
              </div>

              {/* Description */}
              {yacht.description && yacht.description.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">About {yacht.name}</h2>
                  <PortableText value={yacht.description} className="prose-luxury" />
                </div>
              )}

              {/* Highlights */}
              {yacht.highlights && yacht.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Highlights</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {yacht.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-text-secondary">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="mb-12">
                <h2 className="text-2xl mb-6">Specifications</h2>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 p-6 bg-bg-surface rounded-lg">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> Length
                    </span>
                    <span className="font-medium">{yacht.specs.length}m</span>
                  </div>
                  {yacht.specs.beam && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Ship className="h-4 w-4" /> Beam
                      </span>
                      <span className="font-medium">{yacht.specs.beam}m</span>
                    </div>
                  )}
                  {yacht.specs.draft && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Waves className="h-4 w-4" /> Draft
                      </span>
                      <span className="font-medium">{yacht.specs.draft}m</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Year Built
                    </span>
                    <span className="font-medium">{yacht.specs.year}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted flex items-center gap-2">
                      <Users className="h-4 w-4" /> Guests
                    </span>
                    <span className="font-medium">{yacht.specs.guests}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-muted flex items-center gap-2">
                      <Anchor className="h-4 w-4" /> Cabins
                    </span>
                    <span className="font-medium">{yacht.specs.cabins}</span>
                  </div>
                  {yacht.specs.crew && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted">Crew</span>
                      <span className="font-medium">{yacht.specs.crew}</span>
                    </div>
                  )}
                  {yacht.specs.cruisingSpeed && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Gauge className="h-4 w-4" /> Cruising Speed
                      </span>
                      <span className="font-medium">{yacht.specs.cruisingSpeed} knots</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Video */}
              {yacht.videoUrl && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Video Tour</h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-bg-muted">
                    <iframe
                      src={yacht.videoUrl}
                      title={`${yacht.name} video tour`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Pricing Card */}
                <div className="bg-bg-surface p-6 rounded-lg shadow-soft mb-6">
                  {yacht.pricing?.fromPrice && (
                    <div className="mb-6">
                      <p className="text-text-muted text-sm">Charter rates from</p>
                      <p className="text-3xl font-serif font-medium text-navy">
                        {yacht.pricing.currency === "EUR" ? "€" : "$"}
                        {yacht.pricing.fromPrice.toLocaleString()}
                        <span className="text-lg text-text-muted font-normal"> /week</span>
                      </p>
                      {yacht.pricing.priceNote && (
                        <p className="text-sm text-text-muted mt-1">{yacht.pricing.priceNote}</p>
                      )}
                    </div>
                  )}

                  <InquiryForm
                    prefilledYacht={{ slug: yacht.slug.current, name: yacht.name }}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Destinations */}
      {yacht.destinations && yacht.destinations.length > 0 && (
        <section className="section-padding bg-bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">Explore with {yacht.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yacht.destinations.map((destination) => (
                <DestinationCard key={destination._id} destination={destination as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title="Ready to charter?"
        subtitle={`Experience the Mediterranean aboard ${yacht.name}. Our team is ready to plan your perfect voyage.`}
        primaryCta={{ label: "Request Availability", href: "/contact" }}
        secondaryCta={{ label: "View More Yachts", href: "/yachts" }}
        variant="dark"
      />
    </>
  );
}
