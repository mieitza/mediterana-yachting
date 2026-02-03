import Image from "next/image";
import Link from "next/link";
import { Users, Ruler, Anchor } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { YachtData } from "@/lib/types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

interface YachtCardProps {
  yacht: Pick<YachtData, "name" | "slug" | "type" | "heroImage" | "summary" | "length" | "guests" | "cabins" | "fromPrice" | "currency">;
  className?: string;
}

const typeLabels: Record<string, string> = {
  motor: "Motor Yacht",
  sailing: "Sailing Yacht",
  "power-catamaran": "Power Catamaran",
  "sailing-catamaran": "Sailing Catamaran",
};

export function YachtCard({ yacht, className }: YachtCardProps) {
  return (
    <Link
      href={`/yachts/${yacht.slug}`}
      className={cn("group block", className)}
    >
      <article className="card-hover bg-bg-surface rounded-lg overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {yacht.heroImage?.url && (
            <Image
              src={yacht.heroImage.url}
              alt={yacht.heroImage.alt || yacht.name}
              fill
              className="object-cover image-zoom"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              {typeLabels[yacht.type]}
            </span>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-slow" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-xl font-medium text-text-primary group-hover:text-navy transition-colors">
            {yacht.name}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 mt-3 text-text-muted text-sm">
            {yacht.length && (
              <div className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4" />
                <span>{yacht.length}m</span>
              </div>
            )}
            {yacht.guests && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{yacht.guests} guests</span>
              </div>
            )}
            {yacht.cabins && (
              <div className="flex items-center gap-1.5">
                <Anchor className="h-4 w-4" />
                <span>{yacht.cabins} cabins</span>
              </div>
            )}
          </div>

          {/* Price */}
          {yacht.fromPrice && (
            <p className="mt-4 text-navy font-medium">
              From {yacht.currency === "EUR" ? "€" : "$"}
              {yacht.fromPrice.toLocaleString()}
              <span className="text-text-muted text-sm font-normal"> /week</span>
            </p>
          )}

          {/* Summary */}
          {yacht.summary && (
            <p className="mt-3 text-text-secondary text-sm line-clamp-2">
              {stripHtml(yacht.summary)}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
