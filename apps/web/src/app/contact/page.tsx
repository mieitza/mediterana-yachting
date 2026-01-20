import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Mediterana Yachting to start planning your luxury Mediterranean yacht charter.",
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@mediteranayachting.com",
    href: "mailto:hello@mediteranayachting.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+30 123 456 789",
    href: "tel:+30123456789",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/30123456789",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Athens, Greece",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80"
            alt="Mediterranean marina"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">Get in Touch</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Ready to start planning your Mediterranean adventure? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl md:text-3xl">Contact Information</h2>
              <p className="mt-4 text-text-secondary">
                Reach out directly or fill in the form and we&apos;ll get back to you within 24 hours.
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
              <div className="mt-10 p-6 bg-bg-muted rounded-lg">
                <h3 className="font-medium text-text-primary">Office Hours</h3>
                <div className="mt-3 space-y-2 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-text-muted">
                  All times are in Eastern European Time (EET/EEST)
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-bg-surface p-8 md:p-10 rounded-lg shadow-soft">
                <h2 className="text-2xl md:text-3xl mb-2">Send us a message</h2>
                <p className="text-text-secondary mb-8">
                  Tell us about your dream charter and we&apos;ll create a personalized proposal.
                </p>

                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
            New to yacht chartering? Check out our FAQ for answers to common questions about the process, costs, and what to expect.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            {[
              {
                q: "When should I book?",
                a: "For peak season (July-August), we recommend booking 6-12 months in advance. Shoulder seasons offer more flexibility.",
              },
              {
                q: "What's included in the price?",
                a: "Typically the yacht, crew, insurance, and standard equipment. Food, fuel, and docking fees are usually extra.",
              },
              {
                q: "Do I need sailing experience?",
                a: "Not at all! Our crewed charters include professional captains and crew who handle everything.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-bg-base p-6 rounded-lg">
                <h3 className="font-medium text-text-primary">{faq.q}</h3>
                <p className="mt-2 text-text-secondary text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
