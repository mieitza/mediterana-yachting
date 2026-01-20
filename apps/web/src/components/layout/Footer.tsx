import Link from "next/link";
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerNavigation = {
  charter: [
    { name: "Our Yachts", href: "/yachts" },
    { name: "Destinations", href: "/destinations" },
    { name: "Charter Process", href: "/about#process" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "LinkedIn", href: "#", icon: Linkedin },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-2xl font-medium tracking-tight">
              Mediterana
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              Experience the Mediterranean in unparalleled luxury. We match you with the right yacht, crew, and itinerary — discreetly, precisely.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Charter */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">
              Charter
            </h3>
            <ul className="space-y-3">
              {footerNavigation.charter.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@mediteranayachting.com"
                  className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  hello@mediteranayachting.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+30123456789"
                  className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  +30 123 456 789
                </a>
              </li>
              <li>
                <span className="text-white/70 text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Athens, Greece
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              &copy; {currentYear} Mediterana Yachting. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
