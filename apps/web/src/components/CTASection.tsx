import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { stripHtml } from "@/lib/utils/html";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  backgroundImage?: string;
  variant?: "default" | "dark" | "light";
  className?: string;
}

export function CTASection({
  title = "Ready to set sail?",
  subtitle = "Let us match you with the perfect yacht and itinerary for your Mediterranean adventure.",
  primaryCta = { label: "Enquire Now", href: "/contact" },
  secondaryCta,
  backgroundImage,
  variant = "default",
  className,
}: CTASectionProps) {
  const isDark = variant === "dark" || backgroundImage;
  const isLight = variant === "light";

  return (
    <section
      className={cn(
        "relative section-padding overflow-hidden",
        !backgroundImage && isDark && "bg-navy",
        !backgroundImage && isLight && "bg-bg-muted",
        !backgroundImage && !isDark && !isLight && "bg-sand/30",
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className={cn(
              "font-serif",
              isDark ? "text-white" : "text-text-primary"
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-4 text-lg",
              isDark ? "text-white/80" : "text-text-secondary"
            )}
          >
            {subtitle ? stripHtml(subtitle) : subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button
              asChild
              size="lg"
              variant={isDark ? "secondary" : "default"}
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>

            {secondaryCta && (
              <Button
                asChild
                size="lg"
                variant={isDark ? "outline" : "outline"}
                className={cn(isDark && "border-white text-white hover:bg-white hover:text-navy")}
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
