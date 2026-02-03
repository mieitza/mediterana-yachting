import type { Metadata } from "next";
import Image from "next/image";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CTASection } from "@/components/CTASection";
import { FAQSection, destinationFAQs } from "@/components/seo/FAQSection";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import { getAllDestinations, getDestinationsPage } from "@/lib/data";

export const revalidate = 0; // Disable caching to always fetch fresh data

// Default content
const defaultContent = {
  heroTitle: "Destinations",
  heroSubtitle: "From the azure waters of Greece to the glamorous ports of the French Riviera, discover your perfect Mediterranean escape.",
  heroImage: { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80", alt: "Mediterranean coastline" },
  introTitle: "Explore the Mediterranean",
  ctaTitle: "Not sure where to go?",
  ctaDescription: "Our charter specialists can help you choose the perfect destination based on your interests, time of year, and preferred experiences.",
  ctaButtonText: "Get Expert Advice",
  ctaButtonHref: "/contact",
  seoTitle: "Mediterranean Yacht Charter Destinations | Greece, Croatia, French Riviera",
  seoDescription: "Discover the best Mediterranean yacht charter destinations. Sail to Greek Islands, Croatian Coast, French Riviera, Amalfi Coast & more. Expert local knowledge, bespoke itineraries.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDestinationsPage();
  const title = page?.seoTitle || defaultContent.seoTitle;
  const description = page?.seoDescription || defaultContent.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.mediteranayachting.com/destinations",
    },
    openGraph: {
      title,
      description,
      url: "https://www.mediteranayachting.com/destinations",
      type: "website",
    },
  };
}

export default async function DestinationsPage() {
  const [destinations, page] = await Promise.all([
    getAllDestinations(),
    getDestinationsPage(),
  ]);

  const heroImage = page?.heroImage || defaultContent.heroImage;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.url || defaultContent.heroImage.url}
            alt={heroImage?.alt || "Destinations hero"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">{page?.heroTitle || defaultContent.heroTitle}</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {page?.heroSubtitle || defaultContent.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Intro Section */}
      {(page?.introTitle || page?.introDescription) && (
        <section className="py-16 bg-bg-surface">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            {page?.introTitle && <h2 className="text-2xl md:text-3xl mb-4">{page.introTitle}</h2>}
            {page?.introDescription && (
              <div
                className="prose prose-lg max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: page.introDescription }}
              />
            )}
          </div>
        </section>
      )}

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
        title={page?.ctaTitle || defaultContent.ctaTitle}
        subtitle={page?.ctaDescription || defaultContent.ctaDescription}
        primaryCta={{
          label: page?.ctaButtonText || defaultContent.ctaButtonText,
          href: page?.ctaButtonHref || defaultContent.ctaButtonHref
        }}
        secondaryCta={{ label: "View Our Fleet", href: "/yachts" }}
        backgroundImage={page?.ctaBackgroundImage?.url}
        variant={page?.ctaBackgroundImage?.url ? "default" : "light"}
      />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Destinations", url: "/destinations" },
        ]}
      />
      <WebPageSchema
        title={page?.seoTitle || defaultContent.seoTitle}
        description={page?.seoDescription || defaultContent.seoDescription}
        url="https://www.mediteranayachting.com/destinations"
      />
    </>
  );
}
