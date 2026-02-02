import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Compass, Ship, Shield, Users, Calendar, Phone, ArrowRight, Star, Heart, Award, Anchor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YachtCard } from "@/components/yachts/YachtCard";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { FAQSection, homepageFAQs } from "@/components/seo/FAQSection";
import { WebPageSchema } from "@/components/seo/StructuredData";
import {
  getFeaturedYachts,
  getAllDestinations,
  getLatestPosts,
  getHomePage,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Mediterranean Yacht Charter | Luxury Sailing & Motor Yachts | Mediterana Yachting",
  description: "Charter luxury yachts across the Mediterranean. Private sailing & motor yacht charters in Greece, Croatia, French Riviera & Amalfi Coast. Expert crew, bespoke itineraries. Enquire today!",
  alternates: {
    canonical: "https://www.mediteranayachting.com",
  },
  openGraph: {
    title: "Mediterranean Yacht Charter | Luxury Sailing & Motor Yachts",
    description: "Charter luxury yachts across the Mediterranean. Private sailing & motor yacht charters in Greece, Croatia, French Riviera & Amalfi Coast with expert crew.",
    url: "https://www.mediteranayachting.com",
    type: "website",
  },
};

// Disable caching to always fetch fresh data
export const revalidate = 0;

// Icon mapping
const iconMap: Record<string, any> = {
  compass: Compass,
  ship: Ship,
  shield: Shield,
  users: Users,
  calendar: Calendar,
  phone: Phone,
  star: Star,
  heart: Heart,
  award: Award,
  anchor: Anchor,
  check: Check,
};

// Default content
const defaultContent = {
  heroTitle: "Experience the Mediterranean",
  heroHighlight: "in Unparalleled Luxury",
  heroSubtitle: "Bespoke yacht charters with personalized service, curated itineraries, and access to the finest vessels.",
  heroImage: { url: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85", alt: "Luxury yacht in the Mediterranean" },
  featuredYachtsTitle: "Featured Yachts",
  featuredYachtsSubtitle: "Explore our curated selection of exceptional vessels, each offering a unique way to experience the Mediterranean.",
  destinationsTitle: "Destinations",
  destinationsSubtitle: "From the azure waters of Greece to the glamorous ports of the French Riviera, discover your perfect Mediterranean escape.",
  whyMediteranaTitle: "Why Mediterana Yachting",
  whyMediteranaSubtitle: "We match you with the right yacht, crew, and itinerary — discreetly, precisely.",
  whyMediteranaFeatures: [
    { icon: "shield", title: "Trusted Expertise", description: "Over a decade of experience in luxury Mediterranean charters." },
    { icon: "users", title: "Personal Service", description: "Dedicated charter specialists available around the clock." },
    { icon: "ship", title: "Curated Fleet", description: "Hand-selected yachts that meet our exacting standards." },
    { icon: "phone", title: "Concierge Support", description: "From provisioning to shore excursions, we handle every detail." },
  ],
  processTitle: "The Charter Process",
  processSubtitle: "From initial inquiry to setting sail, we make chartering effortless.",
  processSteps: [
    { icon: "compass", title: "Discover", description: "Tell us about your dream charter — destinations, dates, preferences, and special occasions." },
    { icon: "ship", title: "Match", description: "We curate a selection of yachts and itineraries tailored to your unique requirements." },
    { icon: "calendar", title: "Charter", description: "Set sail with confidence, knowing every detail has been meticulously arranged for you." },
  ],
  blogTitle: "From the Journal",
  blogSubtitle: "Insights, guides, and inspiration for your next Mediterranean adventure.",
  ctaTitle: "Ready to set sail?",
  ctaDescription: "Let us match you with the perfect yacht and itinerary for your Mediterranean adventure.",
  ctaButtonText: "Enquire Now",
  ctaButtonHref: "/contact",
  ctaBackgroundImage: null as string | null,
};

async function getData() {
  const [pageContent, yachts, destinations, posts] = await Promise.all([
    getHomePage(),
    getFeaturedYachts(6),
    getAllDestinations(),
    getLatestPosts(3),
  ]);

  return {
    pageContent,
    yachts,
    destinations,
    posts,
  };
}

export default async function HomePage() {
  const { pageContent, yachts, destinations, posts } = await getData();
  const page = pageContent || defaultContent;

  const whyFeatures = page.whyMediteranaFeatures
    ? (typeof page.whyMediteranaFeatures === 'string'
        ? JSON.parse(page.whyMediteranaFeatures)
        : page.whyMediteranaFeatures)
    : defaultContent.whyMediteranaFeatures;

  const processSteps = page.processSteps
    ? (typeof page.processSteps === 'string'
        ? JSON.parse(page.processSteps)
        : page.processSteps)
    : defaultContent.processSteps;

  const heroImage = page.heroImage
    ? (typeof page.heroImage === 'string'
        ? JSON.parse(page.heroImage)
        : page.heroImage)
    : defaultContent.heroImage;

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <Image
          src={heroImage?.url || defaultContent.heroImage.url}
          alt={heroImage?.alt || "Luxury yacht in the Mediterranean"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy/50" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-shadow animate-in">
            {page.heroTitle || defaultContent.heroTitle}
            <br />
            <span className="text-sand">{page.heroHighlight || defaultContent.heroHighlight}</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-in" style={{ animationDelay: "0.1s" }}>
            {page.heroSubtitle || defaultContent.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-in" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="xl" className="bg-sand text-navy hover:bg-sand/90">
              <Link href="/contact">
                Enquire Now
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-navy">
              <Link href="/yachts">
                View Yachts
              </Link>
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
            <h2>{page.featuredYachtsTitle || defaultContent.featuredYachtsTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {page.featuredYachtsSubtitle || defaultContent.featuredYachtsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yachts.slice(0, 6).map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} />
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
            <h2>{page.destinationsTitle || defaultContent.destinationsTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {page.destinationsSubtitle || defaultContent.destinationsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* First destination - large, spans 2 cols */}
            {destinations[0] && (
              <DestinationCard
                key={destinations[0].id}
                destination={destinations[0]}
                variant="large"
                className="md:col-span-2 md:row-span-2"
              />
            )}
            {/* Remaining destinations - regular size */}
            {destinations.slice(1, 4).map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
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
            <h2>{page.whyMediteranaTitle || defaultContent.whyMediteranaTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {page.whyMediteranaSubtitle || defaultContent.whyMediteranaSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyFeatures.map((item: any, index: number) => {
              const IconComponent = iconMap[item.icon || "shield"] || Shield;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-navy/10 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-navy" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-text-secondary text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="section-padding bg-bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>{page.processTitle || defaultContent.processTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {page.processSubtitle || defaultContent.processSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {processSteps.map((step: any, index: number) => {
              const IconComponent = iconMap[step.icon || "compass"] || Compass;
              return (
                <div key={index} className="relative text-center">
                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
                  )}

                  <div className="inline-flex items-center justify-center w-16 h-16 bg-navy text-white rounded-full mb-4 relative z-10">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-text-secondary">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="section-padding bg-bg-base">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2>{page.blogTitle || defaultContent.blogTitle}</h2>
              <p className="mt-4 text-lg max-w-2xl mx-auto">
                {page.blogSubtitle || defaultContent.blogSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
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
      )}

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about chartering a yacht in the Mediterranean."
        items={homepageFAQs}
      />

      {/* CTA Section */}
      <CTASection
        title={page.ctaTitle || defaultContent.ctaTitle}
        subtitle={page.ctaDescription || defaultContent.ctaDescription}
        primaryCta={{
          label: page.ctaButtonText || defaultContent.ctaButtonText,
          href: page.ctaButtonHref || defaultContent.ctaButtonHref
        }}
        secondaryCta={{
          label: "View Our Fleet",
          href: "/yachts"
        }}
        backgroundImage={page.ctaBackgroundImage || undefined}
      />

      {/* Page Structured Data */}
      <WebPageSchema
        title="Mediterranean Yacht Charter | Luxury Sailing & Motor Yachts"
        description="Charter luxury yachts across the Mediterranean. Private sailing & motor yacht charters in Greece, Croatia, French Riviera & Amalfi Coast."
        url="https://www.mediteranayachting.com"
      />
    </>
  );
}
