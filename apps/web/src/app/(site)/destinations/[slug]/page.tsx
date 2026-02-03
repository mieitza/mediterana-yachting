import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Sparkles, ArrowLeft, Sun, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YachtCard } from "@/components/yachts/YachtCard";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbSchema, DestinationSchema, WebPageSchema } from "@/components/seo/StructuredData";
import { getDestinationBySlug } from "@/lib/data";

export const dynamic = 'force-dynamic'; // Always render dynamically
export const revalidate = 0; // Disable caching to always fetch fresh data

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Destination Not Found",
    };
  }

  const title = destination.seoTitle || `${destination.name} Yacht Charter | Sailing & Motor Yacht Holidays`;
  const description = destination.seoDescription || `Charter a luxury yacht to explore ${destination.name}. Best time to visit: ${destination.bestSeason}. ${destination.highlights?.slice(0, 3).join(", ")}. Expert crew & bespoke itineraries.`;
  const url = `https://www.mediteranayachting.com/destinations/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${destination.name} Yacht Charter | Mediterana Yachting`,
      description: `Charter a luxury yacht to explore ${destination.name}. ${destination.highlights?.slice(0, 2).join(", ")}.`,
      url,
      type: "website",
      images: destination.heroImage?.url ? [destination.heroImage.url] : [],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end">
        {destination.heroImage?.url && (
          <Image
            src={destination.heroImage.url}
            alt={destination.heroImage.alt || destination.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />

        {/* Back link */}
        <div className="absolute top-24 md:top-28 left-4 z-20">
          <Button asChild variant="outline" size="sm" className="bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-md">
            <Link href="/destinations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Destinations
            </Link>
          </Button>
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-12 text-white">
          <h1 className="text-shadow">{destination.name}</h1>
          {destination.bestSeason && (
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-white/80">
                <Sun className="h-5 w-5" />
                <span>Best time: {destination.bestSeason}</span>
              </div>
            </div>
          )}
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
              {destination.description && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Overview</h2>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: destination.description }}
                  />
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
              {destination.itinerary && (
                <div className="mb-12">
                  <h2 className="text-2xl mb-6">Suggested Itinerary</h2>
                  <div className="bg-bg-surface p-6 md:p-8 rounded-lg">
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: destination.itinerary }}
                    />
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
                {destination.bestSeason && (
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
                )}

                {/* Inquiry Form */}
                <div className="bg-bg-surface p-6 rounded-lg shadow-soft">
                  <h3 className="font-medium text-text-primary mb-4">Plan Your Charter</h3>
                  <InquiryForm
                    prefilledDestination={{ slug: destination.slug, name: destination.name }}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Yachts */}
      {destination.recommendedYachts && destination.recommendedYachts.length > 0 && (
        <section className="section-padding bg-bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">Recommended Yachts for {destination.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destination.recommendedYachts.map((yacht) => (
                <YachtCard key={yacht.id} yacht={yacht as any} />
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
        backgroundImage={destination.heroImage?.url}
      />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Destinations", url: "/destinations" },
          { name: destination.name, url: `/destinations/${slug}` },
        ]}
      />
      <DestinationSchema
        name={destination.name}
        description={destination.seoDescription || `Charter a luxury yacht to explore ${destination.name}. Best time: ${destination.bestSeason}.`}
        image={destination.heroImage?.url || ""}
        url={`/destinations/${slug}`}
      />
      <WebPageSchema
        title={`${destination.name} Yacht Charter`}
        description={`Charter a luxury yacht to explore ${destination.name}.`}
        url={`https://www.mediteranayachting.com/destinations/${slug}`}
      />
    </>
  );
}
