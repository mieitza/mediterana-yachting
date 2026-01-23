import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { YachtCard } from "@/components/yachts/YachtCard";
import { YachtFilters } from "./YachtFilters";
import { CTASection } from "@/components/CTASection";
import { getAllYachts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Yachts",
  description: "Explore our curated fleet of luxury yachts available for charter in the Mediterranean.",
};

export const revalidate = 0; // Disable caching to always fetch fresh data

interface PageProps {
  searchParams: Promise<{
    type?: string;
    guests?: string;
    length?: string;
  }>;
}

export default async function YachtsPage({ searchParams }: PageProps) {
  const yachts = await getAllYachts();
  const params = await searchParams;

  // Filter yachts based on query params
  let filteredYachts = [...yachts];

  if (params.type && params.type !== "all") {
    filteredYachts = filteredYachts.filter((y) => y.type === params.type);
  }

  if (params.guests) {
    const minGuests = parseInt(params.guests);
    if (!isNaN(minGuests)) {
      filteredYachts = filteredYachts.filter((y) => (y.guests || 0) >= minGuests);
    }
  }

  if (params.length) {
    const minLength = parseInt(params.length);
    if (!isNaN(minLength)) {
      filteredYachts = filteredYachts.filter((y) => parseInt(y.length || "0") >= minLength);
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
                <YachtCard key={yacht.id} yacht={yacht} />
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
