import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Ruler, Anchor, Calendar, Ship, Waves, Gauge, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YachtGallery } from "@/components/yachts/YachtGallery";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CTASection } from "@/components/CTASection";
import { getYachtBySlug, getYachtSlugs } from "@/lib/data";

export const revalidate = 0; // Disable caching to always fetch fresh data

export async function generateStaticParams() {
  const slugs = await getYachtSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yacht = await getYachtBySlug(slug);

  if (!yacht) {
    return {
      title: "Yacht Not Found",
    };
  }

  return {
    title: yacht.seoTitle || yacht.name,
    description: yacht.seoDescription || yacht.summary || undefined,
    openGraph: {
      title: `${yacht.name} | Mediterana Yachting`,
      description: yacht.summary || undefined,
      images: yacht.heroImage?.url ? [yacht.heroImage.url] : [],
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
  const yacht = await getYachtBySlug(slug);

  if (!yacht) {
    notFound();
  }

  const gallery = yacht.gallery || [];
  const images = gallery.length > 0 ? gallery : yacht.heroImage ? [yacht.heroImage] : [];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: yacht.name,
    description: yacht.summary,
    image: yacht.heroImage?.url,
    brand: {
      "@type": "Brand",
      name: "Mediterana Yachting",
    },
    offers: yacht.fromPrice
      ? {
          "@type": "Offer",
          price: yacht.fromPrice,
          priceCurrency: yacht.currency || "EUR",
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
          <YachtGallery images={images} yachtName={yacht.name} />
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
                {yacht.length && (
                  <div className="text-center">
                    <Ruler className="h-5 w-5 mx-auto text-navy" />
                    <p className="mt-1 font-medium">{yacht.length}m</p>
                    <p className="text-sm text-text-muted">Length</p>
                  </div>
                )}
                {yacht.guests && (
                  <div className="text-center">
                    <Users className="h-5 w-5 mx-auto text-navy" />
                    <p className="mt-1 font-medium">{yacht.guests}</p>
                    <p className="text-sm text-text-muted">Guests</p>
                  </div>
                )}
                {yacht.cabins && (
                  <div className="text-center">
                    <Anchor className="h-5 w-5 mx-auto text-navy" />
                    <p className="mt-1 font-medium">{yacht.cabins}</p>
                    <p className="text-sm text-text-muted">Cabins</p>
                  </div>
                )}
                {yacht.year && (
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto text-navy" />
                    <p className="mt-1 font-medium">{yacht.year}</p>
                    <p className="text-sm text-text-muted">Built</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {yacht.description && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">About {yacht.name}</h2>
                  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: yacht.description }} />
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
                  {yacht.length && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Ruler className="h-4 w-4" /> Length
                      </span>
                      <span className="font-medium">{yacht.length}m</span>
                    </div>
                  )}
                  {yacht.beam && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Ship className="h-4 w-4" /> Beam
                      </span>
                      <span className="font-medium">{yacht.beam}m</span>
                    </div>
                  )}
                  {yacht.draft && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Waves className="h-4 w-4" /> Draft
                      </span>
                      <span className="font-medium">{yacht.draft}m</span>
                    </div>
                  )}
                  {yacht.year && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Year Built
                      </span>
                      <span className="font-medium">{yacht.year}</span>
                    </div>
                  )}
                  {yacht.yearRefitted && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Year Refitted
                      </span>
                      <span className="font-medium">{yacht.yearRefitted}</span>
                    </div>
                  )}
                  {yacht.guests && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Users className="h-4 w-4" /> Guests
                      </span>
                      <span className="font-medium">{yacht.guests}</span>
                    </div>
                  )}
                  {yacht.cabins && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Anchor className="h-4 w-4" /> Cabins
                      </span>
                      <span className="font-medium">{yacht.cabins}</span>
                    </div>
                  )}
                  {yacht.crew && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted">Crew</span>
                      <span className="font-medium">{yacht.crew}</span>
                    </div>
                  )}
                  {yacht.cruisingSpeed && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-text-muted flex items-center gap-2">
                        <Gauge className="h-4 w-4" /> Cruising Speed
                      </span>
                      <span className="font-medium">{yacht.cruisingSpeed} knots</span>
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
                  {yacht.fromPrice && (
                    <div className="mb-6">
                      <p className="text-text-muted text-sm">Charter rates from</p>
                      <p className="text-3xl font-serif font-medium text-navy">
                        {yacht.currency === "EUR" ? "€" : "$"}
                        {yacht.fromPrice.toLocaleString()}
                        <span className="text-lg text-text-muted font-normal"> /week</span>
                      </p>
                      {yacht.priceNote && (
                        <p className="text-sm text-text-muted mt-1">{yacht.priceNote}</p>
                      )}
                    </div>
                  )}

                  <InquiryForm
                    prefilledYacht={{ slug: yacht.slug, name: yacht.name }}
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
                <DestinationCard key={destination.id} destination={destination as any} />
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
