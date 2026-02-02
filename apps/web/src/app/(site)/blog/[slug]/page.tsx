import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import { getPostBySlug, getLatestPosts } from "@/lib/data";

export const dynamic = 'force-dynamic'; // Always render dynamically
export const revalidate = 0; // Disable caching to always fetch fresh data

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const url = `https://www.mediteranayachting.com/blog/${slug}`;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
    },
  };
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getLatestPosts(4),
  ]);

  if (!post) {
    notFound();
  }

  // Get related posts (exclude current post)
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // JSON-LD structured data for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    url: `https://www.mediteranayachting.com/blog/${slug}`,
    datePublished: post.publishedAt?.toISOString(),
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Mediterana Yachting",
      url: "https://www.mediteranayachting.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mediteranayachting.com/logo.png",
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <Script
        id={`blog-post-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${slug}` },
        ]}
      />
      <WebPageSchema
        title={post.title}
        description={post.excerpt || ""}
        url={`https://www.mediteranayachting.com/blog/${slug}`}
        dateModified={post.publishedAt?.toISOString()}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 z-0">
          {post.coverImage?.url && (
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-navy/70" />
        </div>

        {/* Back link */}
        <div className="absolute top-24 md:top-28 left-4 z-20">
          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center max-w-4xl">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex justify-center gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-shadow">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center justify-center gap-6 mt-6 text-white/80">
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            {post.excerpt && (
              <div
                className="text-xl text-text-secondary mb-8 pb-8 border-b border-border prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}

            {/* Body */}
            {post.body && (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            )}

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-muted">
                <Tag className="h-4 w-4" />
                {post.tags?.join(", ")}
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-12">More from the Journal</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title="Ready to make it happen?"
        subtitle="Turn inspiration into reality. Let us help you plan your perfect Mediterranean yacht charter."
        primaryCta={{ label: "Start Planning", href: "/contact" }}
        variant="dark"
      />
    </>
  );
}
