import type { Metadata } from "next";
import Image from "next/image";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CTASection } from "@/components/CTASection";
import { FAQSection, destinationFAQs } from "@/components/seo/FAQSection";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import { getAllDestinations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mediterranean Yacht Charter Destinations | Greece, Croatia, French Riviera",
  description: "Discover the best Mediterranean yacht charter destinations. Sail to Greek Islands, Croatian Coast, French Riviera, Amalfi Coast & more. Expert local knowledge, bespoke itineraries.",
  alternates: {
    canonical: "https://www.mediteranayachting.com/destinations",
  },
  openGraph: {
    title: "Mediterranean Yacht Charter Destinations",
    description: "Discover the best Mediterranean yacht charter destinations. Greek Islands, Croatian Coast, French Riviera & more.",
    url: "https://www.mediteranayachting.com/destinations",
    type: "website",
  },
};

export const revalidate = 0; // Disable caching to always fetch fresh data

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

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
          {destinations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  variant={index === 0 ? "large" : "default"}
                  className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">
                No destinations available at the moment.
              </p>
              <p className="text-text-muted mt-2">
                Please check back later or contact us for more information.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Destination Questions"
        subtitle="Learn about Mediterranean yacht charter destinations."
        items={destinationFAQs}
      />

      {/* CTA */}
      <CTASection
        title="Not sure where to go?"
        subtitle="Our charter specialists can help you choose the perfect destination based on your interests, time of year, and preferred experiences."
        primaryCta={{ label: "Get Expert Advice", href: "/contact" }}
        secondaryCta={{ label: "View Our Fleet", href: "/yachts" }}
        variant="light"
      />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Destinations", url: "/destinations" },
        ]}
      />
      <WebPageSchema
        title="Mediterranean Yacht Charter Destinations | Greece, Croatia, French Riviera"
        description="Discover the best Mediterranean yacht charter destinations. Greek Islands, Croatian Coast, French Riviera & more."
        url="https://www.mediteranayachting.com/destinations"
      />
    </>
  );
}
