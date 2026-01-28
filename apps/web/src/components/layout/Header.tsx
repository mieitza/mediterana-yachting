"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Yachts", href: "/yachts" },
  { name: "Destinations", href: "/destinations" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if we're on a page with a full-bleed hero (needs transparent header)
  // Only homepage and destination detail pages have true full-bleed heroes
  const hasHero = pathname === "/" || pathname.startsWith("/destinations/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const headerBg = hasHero && !isScrolled
    ? "bg-transparent"
    : "bg-bg-surface/95 backdrop-blur-md shadow-soft";

  const textColor = hasHero && !isScrolled
    ? "text-white"
    : "text-text-primary";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-slow",
        headerBg
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-serif text-xl md:text-2xl font-medium tracking-tight transition-colors",
              textColor
            )}
          >
            Mediterana Yachting
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors link-underline",
                  textColor,
                  pathname === item.href && "opacity-70"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button
              asChild
              variant={hasHero && !isScrolled ? "outline" : "default"}
              className={cn(
                hasHero && !isScrolled && "border-white text-white hover:bg-white hover:text-navy"
              )}
            >
              <Link href="/contact">Enquire</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn("lg:hidden p-2", textColor)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-bg-surface border-t"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-lg font-medium text-text-primary py-2 transition-colors hover:text-navy",
                    pathname === item.href && "text-navy"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="w-full mt-4">
                <Link href="/contact">Enquire Now</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
