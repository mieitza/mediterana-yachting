import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { FAQSection } from "@/components/seo/FAQSection";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import { getContactPage } from "@/lib/data";
import { stripHtml } from "@/lib/utils/html";

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
  const title = page?.seoTitle || "Contact Us | Book Your Mediterranean Yacht Charter";
  const description = page?.seoDescription || "Contact Mediterana Yachting to book your luxury Mediterranean yacht charter. Expert charter specialists available to plan your bespoke sailing or motor yacht vacation.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.mediteranayachting.com/contact",
    },
    openGraph: {
      title: "Contact Mediterana Yachting | Book Your Yacht Charter",
      description: "Contact our expert charter specialists to plan your luxury Mediterranean yacht vacation.",
      url: "https://www.mediteranayachting.com/contact",
      type: "website",
    },
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
            {stripHtml(page?.heroSubtitle || defaultContent.heroSubtitle)}
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

      {/* FAQ Section with Schema */}
      {faqItems && faqItems.length > 0 && (
        <FAQSection
          title={page?.faqTitle || defaultContent.faqTitle}
          subtitle={defaultContent.faqDescription}
          items={faqItems}
          className="bg-bg-surface"
        />
      )}

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <WebPageSchema
        title="Contact Us | Book Your Mediterranean Yacht Charter"
        description="Contact Mediterana Yachting to book your luxury Mediterranean yacht charter."
        url="https://www.mediteranayachting.com/contact"
      />
    </>
  );
}
