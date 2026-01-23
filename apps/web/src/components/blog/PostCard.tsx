import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PostData } from "@/lib/types";

interface PostCardProps {
  post: Pick<PostData, "title" | "slug" | "excerpt" | "coverImage" | "tags" | "publishedAt">;
  variant?: "default" | "featured";
  className?: string;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post, variant = "default", className }: PostCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn("group block", className)}
    >
      <article
        className={cn(
          "card-hover bg-bg-surface rounded-lg overflow-hidden",
          isFeatured && "md:flex md:items-stretch"
        )}
      >
        {/* Image */}
        <div
          className={cn(
            "relative overflow-hidden",
            isFeatured ? "aspect-[16/9] md:aspect-auto md:w-1/2" : "aspect-[16/10]"
          )}
        >
          {post.coverImage?.url && (
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover image-zoom"
              sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            />
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "p-5",
            isFeatured && "md:w-1/2 md:p-8 md:flex md:flex-col md:justify-center"
          )}
        >
          {/* Meta */}
          {post.publishedAt && (
            <div className="flex items-center gap-4 text-text-muted text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            </div>
          )}

          {/* Title */}
          <h3
            className={cn(
              "font-serif font-medium text-text-primary mt-3 group-hover:text-navy transition-colors",
              isFeatured ? "text-2xl md:text-3xl" : "text-xl"
            )}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className={cn(
                "mt-3 text-text-secondary",
                isFeatured ? "line-clamp-3" : "line-clamp-2 text-sm"
              )}
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-bg-muted text-text-secondary text-xs px-2.5 py-1 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read more */}
          <span className="mt-4 text-sm font-medium text-navy inline-block">
            Read more →
          </span>
        </div>
      </article>
    </Link>
  );
}
