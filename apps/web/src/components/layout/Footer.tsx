import Link from "next/link";
import { Instagram, Facebook, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
}

interface FooterData {
  siteName?: string;
  footerTagline?: string;
  footerCharterLinks?: FooterLink[];
  footerCompanyLinks?: FooterLink[];
  footerLegalLinks?: FooterLink[];
  copyrightText?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialLinks?: SocialLinks;
}

// Fallback data
const fallbackData: FooterData = {
  siteName: "Mediterana",
  footerTagline: "Experience the Mediterranean in unparalleled luxury. We match you with the right yacht, crew, and itinerary — discreetly, precisely.",
  footerCharterLinks: [
    { label: "Our Yachts", href: "/yachts" },
    { label: "Destinations", href: "/destinations" },
    { label: "Charter Process", href: "/about#process" },
  ],
  footerCompanyLinks: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  footerLegalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyrightText: "Mediterana Yachting",
  contactEmail: "hello@mediteranayachting.com",
  contactPhone: "+30 123 456 789",
  contactAddress: "Athens, Greece",
  socialLinks: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
  },
};

async function getFooterData(): Promise<FooterData> {
  if (!isSanityConfigured || !sanityClient) {
    return fallbackData;
  }

  try {
    const data = await sanityClient.fetch<FooterData>(siteSettingsQuery);
    return data || fallbackData;
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return fallbackData;
  }
}

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export async function Footer() {
  const data = await getFooterData();
  const currentYear = new Date().getFullYear();

  const charterLinks = data.footerCharterLinks || fallbackData.footerCharterLinks || [];
  const companyLinks = data.footerCompanyLinks || fallbackData.footerCompanyLinks || [];
  const legalLinks = data.footerLegalLinks || fallbackData.footerLegalLinks || [];
  const socialLinks = data.socialLinks || fallbackData.socialLinks || {};

  // Build social links array
  const activeSocialLinks = Object.entries(socialLinks)
    .filter(([key, value]) => value && key !== "whatsapp" && socialIcons[key as keyof typeof socialIcons])
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      href: value as string,
      icon: socialIcons[key as keyof typeof socialIcons],
    }));

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-2xl font-medium tracking-tight text-white">
              {data.siteName || fallbackData.siteName}
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              {data.footerTagline || fallbackData.footerTagline}
            </p>
            {activeSocialLinks.length > 0 && (
              <div className="flex space-x-4 mt-6">
                {activeSocialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-white/60 hover:text-sand transition-colors"
                    aria-label={item.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <item.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Charter */}
          <div>
            <h3 className="text-sand font-medium text-sm uppercase tracking-wider mb-4">
              Charter
            </h3>
            <ul className="space-y-3">
              {charterLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sand font-medium text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sand font-medium text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              {(data.contactEmail || fallbackData.contactEmail) && (
                <li>
                  <a
                    href={`mailto:${data.contactEmail || fallbackData.contactEmail}`}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    {data.contactEmail || fallbackData.contactEmail}
                  </a>
                </li>
              )}
              {(data.contactPhone || fallbackData.contactPhone) && (
                <li>
                  <a
                    href={`tel:${(data.contactPhone || fallbackData.contactPhone)?.replace(/\s/g, "")}`}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    {data.contactPhone || fallbackData.contactPhone}
                  </a>
                </li>
              )}
              {(data.contactAddress || fallbackData.contactAddress) && (
                <li>
                  <span className="text-white/70 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    {data.contactAddress || fallbackData.contactAddress}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              &copy; {currentYear} {data.copyrightText || fallbackData.copyrightText}. All rights reserved.
            </p>
            {legalLinks.length > 0 && (
              <div className="flex space-x-6">
                {legalLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
