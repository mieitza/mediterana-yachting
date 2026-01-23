import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { getContactPage } from "@/lib/data";

export const revalidate = 0; // Disable caching to always fetch fresh data

// Default content
const defaultContent = {
  heroTitle: "Get in Touch",
  heroSubtitle: "Ready to start planning your Mediterranean adventure? We'd love to hear from you.",
  heroImage: { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80", alt: "Mediterranean marina" },
  contactTitle: "Contact Information",
  contactDescription: "Reach out directly or fill in the form and we'll get back to you within 24 hours.",
  email: "hello@mediteranayachting.com",
  phone: "+30 123 456 789",
  whatsapp: "+30123456789",
  location: "Athens, Greece",
  officeHours: [
    { days: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { days: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { days: "Sunday", hours: "Closed" },
  ],
  timezone: "All times are in Eastern European Time (EET/EEST)",
  formTitle: "Send us a message",
  formDescription: "Tell us about your dream charter and we'll create a personalized proposal.",
  faqTitle: "Frequently Asked Questions",
  faqDescription: "New to yacht chartering? Check out our FAQ for answers to common questions about the process, costs, and what to expect.",
  faqItems: [
    { question: "When should I book?", answer: "For peak season (July-August), we recommend booking 6-12 months in advance. Shoulder seasons offer more flexibility." },
    { question: "What's included in the price?", answer: "Typically the yacht, crew, insurance, and standard equipment. Food, fuel, and docking fees are usually extra." },
    { question: "Do I need sailing experience?", answer: "Not at all! Our crewed charters include professional captains and crew who handle everything." },
  ],
  seoTitle: "Contact Us",
  seoDescription: "Get in touch with Mediterana Yachting to start planning your luxury Mediterranean yacht charter.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return {
    title: page?.seoTitle || defaultContent.seoTitle,
    description: page?.seoDescription || defaultContent.seoDescription,
  };
}

export default async function ContactPage() {
  const page = await getContactPage();

  const heroImage = page?.heroImage || defaultContent.heroImage;
  const officeHours = page?.officeHours || defaultContent.officeHours;
  const faqItems = page?.faqItems || defaultContent.faqItems;

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: page?.contactEmail || defaultContent.email,
      href: `mailto:${page?.contactEmail || defaultContent.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: page?.contactPhone || defaultContent.phone,
      href: `tel:${(page?.contactPhone || defaultContent.phone || "").replace(/\s/g, "")}`,
    },
    ...((page?.contactWhatsapp || defaultContent.whatsapp)
      ? [
          {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "Chat with us",
            href: `https://wa.me/${(page?.contactWhatsapp || defaultContent.whatsapp || "").replace(/[^0-9]/g, "")}`,
          },
        ]
      : []),
    {
      icon: MapPin,
      label: "Location",
      value: page?.contactAddress || defaultContent.location,
      href: null as string | null,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.url || ""}
            alt={heroImage?.alt || "Contact hero"}
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

      {/* Contact Section */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl md:text-3xl">{defaultContent.contactTitle}</h2>
              <p className="mt-4 text-text-secondary">
                {defaultContent.contactDescription}
              </p>

              <div className="mt-8 space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-text-primary hover:text-navy transition-colors"
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-text-primary">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Office Hours */}
              {officeHours && officeHours.length > 0 && (
                <div className="mt-10 p-6 bg-bg-muted rounded-lg">
                  <h3 className="font-medium text-text-primary">Office Hours</h3>
                  <div className="mt-3 space-y-2 text-sm text-text-secondary">
                    {officeHours.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.days}</span>
                        <span>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-text-muted">
                    {page?.timezoneNote || defaultContent.timezone}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-bg-surface p-8 md:p-10 rounded-lg shadow-soft">
                <h2 className="text-2xl md:text-3xl mb-2">{page?.formTitle || defaultContent.formTitle}</h2>
                <p className="text-text-secondary mb-8">
                  {page?.formDescription || defaultContent.formDescription}
                </p>

                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      {faqItems && faqItems.length > 0 && (
        <section className="py-16 bg-bg-surface">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl">{page?.faqTitle || defaultContent.faqTitle}</h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              {defaultContent.faqDescription}
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              {faqItems.slice(0, 3).map((faq: any, index: number) => (
                <div key={index} className="bg-bg-base p-6 rounded-lg">
                  <h3 className="font-medium text-text-primary">{faq.question}</h3>
                  <p className="mt-2 text-text-secondary text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
