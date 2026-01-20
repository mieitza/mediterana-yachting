import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Anchor, Users, Award, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Mediterana Yachting - your trusted partner for luxury yacht charters in the Mediterranean.",
};

const stats = [
  { label: "Years Experience", value: "15+" },
  { label: "Charters Completed", value: "500+" },
  { label: "Satisfied Clients", value: "1,200+" },
  { label: "Partner Yachts", value: "80+" },
];

const values = [
  {
    icon: Anchor,
    title: "Expertise",
    description: "Deep knowledge of Mediterranean waters, vessels, and what makes a charter exceptional.",
  },
  {
    icon: Users,
    title: "Personal Touch",
    description: "Every client is unique. We listen, understand, and deliver experiences tailored to you.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We partner only with vessels and crews that meet our exacting standards.",
  },
  {
    icon: Globe,
    title: "Local Knowledge",
    description: "Insider access to hidden gems, the best anchorages, and exclusive experiences.",
  },
];

const team = [
  {
    name: "Elena Papadopoulos",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "With 20 years in luxury travel, Elena founded Mediterana to share her passion for the sea.",
  },
  {
    name: "Marco Rossi",
    role: "Fleet Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Former yacht captain with intimate knowledge of every vessel in our fleet.",
  },
  {
    name: "Sophie Laurent",
    role: "Client Relations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    bio: "Dedicated to making every charter seamless from first inquiry to final farewell.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80"
            alt="Mediterranean coastline"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">About Mediterana</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Your trusted partner for unforgettable Mediterranean yacht experiences.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl">Our Story</h2>
              <div className="mt-6 space-y-4 text-text-secondary">
                <p>
                  Founded in 2009, Mediterana Yachting was born from a simple belief: that a yacht charter should be more than a vacation — it should be a transformative experience.
                </p>
                <p>
                  What began as a small family operation has grown into one of the Mediterranean&apos;s most respected charter specialists, yet we&apos;ve never lost the personal touch that defined our earliest days.
                </p>
                <p>
                  Today, we work with a carefully curated fleet of motor yachts, sailing vessels, and catamarans, each selected for its exceptional quality, professional crew, and ability to deliver the experiences our clients dream of.
                </p>
              </div>
              <Button asChild className="mt-8">
                <Link href="/contact">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80"
                alt="Yacht at sunset"
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
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
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
            <h2>What We Stand For</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Our values guide every charter we plan and every relationship we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-bg-base p-6 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-navy/10 rounded-full mb-4">
                  <value.icon className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-lg font-medium text-text-primary">{value.title}</h3>
                <p className="mt-2 text-text-secondary text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section-padding bg-bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2>How We Work</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              From your first inquiry to your last sunset at sea, we&apos;re with you every step of the way.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Initial Consultation",
                  description: "Share your vision with us. We'll discuss dates, destinations, group size, preferences, and any special occasions or requirements.",
                },
                {
                  step: "02",
                  title: "Tailored Proposals",
                  description: "We present a curated selection of yachts and itineraries matched to your needs, complete with detailed information and transparent pricing.",
                },
                {
                  step: "03",
                  title: "Fine-Tuning",
                  description: "Once you've chosen your yacht, we work together to perfect every detail — from provisioning to shore excursions to special requests.",
                },
                {
                  step: "04",
                  title: "Seamless Embarkation",
                  description: "We coordinate transfers, brief you on everything you need to know, and introduce you to your captain and crew.",
                },
                {
                  step: "05",
                  title: "Ongoing Support",
                  description: "Throughout your charter, we're available around the clock to assist with anything you need.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-serif text-lg">
                    {item.step}
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
            <h2>Meet the Team</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Passionate professionals dedicated to making your charter dreams come true.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
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
        title="Let's plan your charter"
        subtitle="Our team is ready to help you discover the Mediterranean in style."
        primaryCta={{ label: "Get in Touch", href: "/contact" }}
        secondaryCta={{ label: "View Our Fleet", href: "/yachts" }}
        variant="dark"
      />
    </>
  );
}
