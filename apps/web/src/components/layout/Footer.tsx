import Link from "next/link";
import { Instagram, Facebook, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/data";
import { NewsletterSignup } from "@/components/NewsletterSignup";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLinks {
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  whatsapp?: string | null;
}

interface FooterData {
  siteName?: string;
  footerTagline?: string | null;
  footerCharterLinks?: FooterLink[];
  footerCompanyLinks?: FooterLink[];
  footerLegalLinks?: FooterLink[];
  copyrightText?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  socialLinks?: SocialLinks;
}

// Fallback data
const fallbackData: FooterData = {
  siteName: "Mediterana Yachting",
  footerTagline: "Experience the Mediterranean in unparalleled luxury. We match you with the right yacht, crew and itinerary.",
  footerCharterLinks: [
    { label: "Our Yachts", href: "/yachts" },
    { label: "Destinations", href: "/destinations" },
    { label: "Charter Process", href: "/about#process" },
  ],
  footerCompanyLinks: [
    { label: "About Us", href: "/about" },
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  footerLegalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyrightText: "Mediterana Yachting",
  contactEmail: "charter@mediteranayachting.com",
  contactPhone: "+30 123 456 789",
  contactAddress: "Athens, Greece\nBucharest, Romania",
  socialLinks: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
  },
};

async function getFooterData(): Promise<FooterData> {
  try {
    const settings = await getSiteSettings();

    if (!settings) {
      return fallbackData;
    }

    return {
      siteName: settings.siteName || fallbackData.siteName,
      footerTagline: settings.footerTagline || fallbackData.footerTagline,
      footerCharterLinks: settings.footerLinks?.charter?.length ? settings.footerLinks.charter : fallbackData.footerCharterLinks,
      footerCompanyLinks: settings.footerLinks?.company?.length ? settings.footerLinks.company : fallbackData.footerCompanyLinks,
      footerLegalLinks: settings.footerLinks?.legal?.length ? settings.footerLinks.legal : fallbackData.footerLegalLinks,
      copyrightText: settings.copyrightText || fallbackData.copyrightText,
      contactEmail: settings.contactEmail || fallbackData.contactEmail,
      contactPhone: settings.contactPhone || fallbackData.contactPhone,
      contactAddress: settings.contactAddress || fallbackData.contactAddress,
      socialLinks: {
        instagram: settings.instagram,
        facebook: settings.facebook,
        linkedin: settings.linkedin,
        twitter: settings.twitter,
        youtube: settings.youtube,
        whatsapp: settings.whatsapp,
      },
    };
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
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
                <>
                  {(data.contactAddress || fallbackData.contactAddress)!
                    .split("\n")
                    .filter(Boolean)
                    .map((addr, i) => (
                      <li key={i}>
                        <span className="text-white/70 text-sm flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {addr.trim()}
                        </span>
                      </li>
                    ))}
                </>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <NewsletterSignup variant="inline" source="footer" />
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              {(() => {
                const text = data.copyrightText || fallbackData.copyrightText || "";
                // If the text already contains © or "All rights reserved", use it as-is
                if (text.includes("©") || text.toLowerCase().includes("all rights reserved")) {
                  return text;
                }
                // Otherwise, wrap it with the standard format
                return `© ${currentYear} ${text}. All rights reserved.`;
              })()}
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
