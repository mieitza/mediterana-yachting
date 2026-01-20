import Image from "next/image";
import Link from "next/link";
import { Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Destination } from "@/lib/sanity/types";

interface DestinationCardProps {
  destination: Pick<Destination, "name" | "slug" | "heroImage" | "bestSeason" | "highlights">;
  variant?: "default" | "large";
  className?: string;
}

export function DestinationCard({
  destination,
  variant = "default",
  className,
}: DestinationCardProps) {
  const isLarge = variant === "large";

  return (
    <Link
      href={`/destinations/${destination.slug.current}`}
      className={cn("group block", className)}
    >
      <article
        className={cn(
          "relative overflow-hidden rounded-lg",
          isLarge ? "aspect-[16/10]" : "aspect-[4/5]"
        )}
      >
        {/* Background Image */}
        <Image
          src={destination.heroImage.url}
          alt={destination.heroImage.alt || destination.name}
          fill
          className="object-cover image-zoom"
          sizes={isLarge ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <h3
            className={cn(
              "font-serif font-medium",
              isLarge ? "text-3xl md:text-4xl" : "text-2xl"
            )}
          >
            {destination.name}
          </h3>

          {/* Best Season */}
          <div className="flex items-center gap-2 mt-3 text-white/80 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{destination.bestSeason}</span>
          </div>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {destination.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full"
                >
                  <Sparkles className="h-3 w-3" />
                  {highlight}
                </span>
              ))}
            </div>
          )}

          {/* Hover indicator */}
          <span className="mt-4 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
            Explore destination →
          </span>
        </div>
      </article>
    </Link>
  );
}
