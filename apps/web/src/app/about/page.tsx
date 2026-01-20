import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anchor, Users, Award, Globe, Shield, Ship, Compass, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortableText } from "@/components/PortableText";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { aboutPageQuery } from "@/lib/sanity/queries";
import type { AboutPage, TeamMember } from "@/lib/sanity/types";

export const revalidate = 3600;

// Icon mapping
const iconMap: Record<string, any> = {
  anchor: Anchor,
  users: Users,
  award: Award,
  globe: Globe,
  shield: Shield,
  ship: Ship,
  compass: Compass,
  heart: Heart,
};

// Fallback data
const fallbackData: AboutPage = {
  heroTitle: "About Mediterana",
  heroSubtitle: "Your trusted partner for unforgettable Mediterranean yacht experiences.",
  heroImage: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80", alt: "Mediterranean coastline" },
  storyTitle: "Our Story",
  storyContent: [
    {
      _type: "block",
      _key: "1",
      style: "normal",
      children: [{ _type: "span", text: "Founded in 2009, Mediterana Yachting was born from a simple belief: that a yacht charter should be more than a vacation — it should be a transformative experience." }],
    },
    {
      _type: "block",
      _key: "2",
      style: "normal",
      children: [{ _type: "span", text: "What began as a small family operation has grown into one of the Mediterranean's most respected charter specialists, yet we've never lost the personal touch that defined our earliest days." }],
    },
    {
      _type: "block",
      _key: "3",
      style: "normal",
      children: [{ _type: "span", text: "Today, we work with a carefully curated fleet of motor yachts, sailing vessels, and catamarans, each selected for its exceptional quality, professional crew, and ability to deliver the experiences our clients dream of." }],
    },
  ],
  storyImage: { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80", alt: "Yacht at sunset" },
  storyCtaText: "Start Your Journey",
  storyCtaLink: "/contact",
  stats: [
    { value: "15+", label: "Years Experience" },
    { value: "500+", label: "Charters Completed" },
    { value: "1,200+", label: "Satisfied Clients" },
    { value: "80+", label: "Partner Yachts" },
  ],
  valuesTitle: "What We Stand For",
  valuesSubtitle: "Our values guide every charter we plan and every relationship we build.",
  values: [
    { icon: "anchor", title: "Expertise", description: "Deep knowledge of Mediterranean waters, vessels, and what makes a charter exceptional." },
    { icon: "users", title: "Personal Touch", description: "Every client is unique. We listen, understand, and deliver experiences tailored to you." },
    { icon: "award", title: "Excellence", description: "We partner only with vessels and crews that meet our exacting standards." },
    { icon: "globe", title: "Local Knowledge", description: "Insider access to hidden gems, the best anchorages, and exclusive experiences." },
  ],
  processTitle: "How We Work",
  processSubtitle: "From your first inquiry to your last sunset at sea, we're with you every step of the way.",
  processSteps: [
    { title: "Initial Consultation", description: "Share your vision with us. We'll discuss dates, destinations, group size, preferences, and any special occasions or requirements." },
    { title: "Tailored Proposals", description: "We present a curated selection of yachts and itineraries matched to your needs, complete with detailed information and transparent pricing." },
    { title: "Fine-Tuning", description: "Once you've chosen your yacht, we work together to perfect every detail — from provisioning to shore excursions to special requests." },
    { title: "Seamless Embarkation", description: "We coordinate transfers, brief you on everything you need to know, and introduce you to your captain and crew." },
    { title: "Ongoing Support", description: "Throughout your charter, we're available around the clock to assist with anything you need." },
  ],
  teamTitle: "Meet the Team",
  teamSubtitle: "Passionate professionals dedicated to making your charter dreams come true.",
  teamMembers: [
    { _id: "1", _type: "teamMember", name: "Elena Papadopoulos", role: "Founder & CEO", image: { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", alt: "Elena Papadopoulos" }, bio: "With 20 years in luxury travel, Elena founded Mediterana to share her passion for the sea." },
    { _id: "2", _type: "teamMember", name: "Marco Rossi", role: "Fleet Director", image: { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", alt: "Marco Rossi" }, bio: "Former yacht captain with intimate knowledge of every vessel in our fleet." },
    { _id: "3", _type: "teamMember", name: "Sophie Laurent", role: "Client Relations", image: { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80", alt: "Sophie Laurent" }, bio: "Dedicated to making every charter seamless from first inquiry to final farewell." },
  ],
  ctaTitle: "Let's plan your charter",
  ctaSubtitle: "Our team is ready to help you discover the Mediterranean in style.",
  ctaPrimaryText: "Get in Touch",
  ctaPrimaryLink: "/contact",
  ctaSecondaryText: "View Our Fleet",
  ctaSecondaryLink: "/yachts",
  seoTitle: "About Us",
  seoDescription: "Learn about Mediterana Yachting - your trusted partner for luxury yacht charters in the Mediterranean.",
};

async function getAboutPageData(): Promise<AboutPage> {
  if (!isSanityConfigured || !sanityClient) {
    return fallbackData;
  }

  try {
    const data = await sanityClient.fetch<AboutPage>(aboutPageQuery);
    return data || fallbackData;
  } catch (error) {
    console.error("Error fetching about page:", error);
    return fallbackData;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutPageData();
  return {
    title: data.seoTitle || "About Us",
    description: data.seoDescription || fallbackData.seoDescription,
  };
}

export default async function AboutPage() {
  const data = await getAboutPageData();
  const stats = data.stats || fallbackData.stats || [];
  const values = data.values || fallbackData.values || [];
  const processSteps = data.processSteps || fallbackData.processSteps || [];
  const teamMembers = data.teamMembers || fallbackData.teamMembers || [];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.heroImage?.url || fallbackData.heroImage?.url || ""}
            alt={data.heroImage?.alt || "About hero"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">{data.heroTitle || fallbackData.heroTitle}</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {data.heroSubtitle || fallbackData.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl">{data.storyTitle || fallbackData.storyTitle}</h2>
              <div className="mt-6">
                {data.storyContent && data.storyContent.length > 0 ? (
                  <PortableText value={data.storyContent} className="prose-luxury" />
                ) : (
                  <PortableText value={fallbackData.storyContent || []} className="prose-luxury" />
                )}
              </div>
              <Button asChild className="mt-8">
                <Link href={data.storyCtaLink || fallbackData.storyCtaLink || "/contact"}>
                  {data.storyCtaText || fallbackData.storyCtaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={data.storyImage?.url || fallbackData.storyImage?.url || ""}
                alt={data.storyImage?.alt || "Our story"}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-serif font-medium text-sand">
                  {stat.value}
                </p>
                <p className="mt-2 text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>{data.valuesTitle || fallbackData.valuesTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {data.valuesSubtitle || fallbackData.valuesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = iconMap[value.icon || "anchor"] || Anchor;
              return (
                <div key={index} className="bg-bg-base p-6 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-navy/10 rounded-full mb-4">
                    <IconComponent className="h-6 w-6 text-navy" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary">{value.title}</h3>
                  <p className="mt-2 text-text-secondary text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section-padding bg-bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>{data.processTitle || fallbackData.processTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {data.processSubtitle || fallbackData.processSubtitle}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {processSteps.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-serif text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                    <p className="mt-1 text-text-secondary">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>{data.teamTitle || fallbackData.teamTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {data.teamSubtitle || fallbackData.teamSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member._id} className="text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image?.url || ""}
                    alt={member.image?.alt || member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-text-primary">{member.name}</h3>
                <p className="text-navy text-sm">{member.role}</p>
                <p className="mt-2 text-text-secondary text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title={data.ctaTitle || fallbackData.ctaTitle || ""}
        subtitle={data.ctaSubtitle || fallbackData.ctaSubtitle || ""}
        primaryCta={{
          label: data.ctaPrimaryText || fallbackData.ctaPrimaryText || "Get in Touch",
          href: data.ctaPrimaryLink || fallbackData.ctaPrimaryLink || "/contact"
        }}
        secondaryCta={data.ctaSecondaryText ? {
          label: data.ctaSecondaryText,
          href: data.ctaSecondaryLink || "/yachts"
        } : undefined}
        variant="dark"
      />
    </>
  );
}
