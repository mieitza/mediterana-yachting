import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortableText } from "@/components/PortableText";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { postBySlugQuery, postSlugsQuery, latestPostsQuery } from "@/lib/sanity/queries";
import type { Post } from "@/lib/sanity/types";

export const revalidate = 3600;

// Fallback post
const fallbackPost: Post = {
  _id: "1",
  _type: "post",
  title: "The Ultimate Guide to Mediterranean Yacht Chartering",
  slug: { current: "ultimate-guide-mediterranean-yacht-chartering" },
  excerpt: "Everything you need to know about planning your first luxury yacht charter in the Mediterranean.",
  coverImage: { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&q=85", alt: "Yacht at sunset" },
  body: [
    {
      _type: "block",
      _key: "1",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Chartering a yacht in the Mediterranean is one of life's great luxuries — a chance to explore some of the world's most beautiful coastlines in complete privacy and comfort. But for first-time charterers, the process can seem daunting. This guide will walk you through everything you need to know.",
        },
      ],
    },
    {
      _type: "block",
      _key: "2",
      style: "h2",
      children: [{ _type: "span", text: "Choosing Your Yacht" }],
    },
    {
      _type: "block",
      _key: "3",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "The first major decision is selecting the type of yacht. Motor yachts offer speed and spacious interiors, perfect for covering longer distances or those who prefer a more resort-like experience. Sailing yachts provide an authentic maritime experience with the thrill of harnessing the wind. Catamarans offer exceptional stability and space, making them ideal for families.",
        },
      ],
    },
    {
      _type: "block",
      _key: "4",
      style: "h2",
      children: [{ _type: "span", text: "Understanding Costs" }],
    },
    {
      _type: "block",
      _key: "5",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Charter costs typically include the yacht, crew, and insurance. Additional expenses — known as APA (Advance Provisioning Allowance) — cover fuel, food, drinks, docking fees, and any special requests. APA is usually 20-35% of the base charter fee.",
        },
      ],
    },
    {
      _type: "block",
      _key: "6",
      style: "h2",
      children: [{ _type: "span", text: "When to Book" }],
    },
    {
      _type: "block",
      _key: "7",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "The Mediterranean charter season runs from May to October, with peak demand in July and August. For the best selection of yachts and preferred dates, we recommend booking 6-12 months in advance for high season. Shoulder seasons (May-June, September-October) offer better availability and often better value.",
        },
      ],
    },
    {
      _type: "block",
      _key: "8",
      style: "h2",
      children: [{ _type: "span", text: "Planning Your Itinerary" }],
    },
    {
      _type: "block",
      _key: "9",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Your captain will work with you to create a bespoke itinerary based on your interests, the weather, and local conditions. Whether you dream of exploring ancient ruins, discovering hidden beaches, enjoying vibrant nightlife, or simply relaxing in pristine anchorages, your charter can be tailored to your exact preferences.",
        },
      ],
    },
    {
      _type: "block",
      _key: "10",
      style: "h2",
      children: [{ _type: "span", text: "What to Expect Onboard" }],
    },
    {
      _type: "block",
      _key: "11",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "A crewed charter is the ultimate in luxury travel. Your crew — typically including a captain, chef, and stewardess on smaller yachts, with additional crew on larger vessels — will attend to your every need. Expect gourmet meals prepared to your preferences, water sports and toys at your disposal, and a level of personalized service that rivals the finest hotels.",
        },
      ],
    },
    {
      _type: "block",
      _key: "12",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Ready to begin planning your Mediterranean yacht charter? Our team of specialists is here to guide you through every step of the process, from selecting the perfect yacht to planning an unforgettable itinerary.",
        },
      ],
    },
  ],
  tags: ["Guide", "Mediterranean", "Planning"],
  publishedAt: "2024-01-15",
  author: "Elena Papadopoulos",
};

async function getPost(slug: string): Promise<Post | null> {
  if (!isSanityConfigured || !sanityClient) {
    return slug === "ultimate-guide-mediterranean-yacht-chartering" ? fallbackPost : null;
  }

  try {
    const post = await sanityClient.fetch<Post>(postBySlugQuery, { slug });
    return post || (slug === "ultimate-guide-mediterranean-yacht-chartering" ? fallbackPost : null);
  } catch (error) {
    console.error("Error fetching post:", error);
    return slug === "ultimate-guide-mediterranean-yacht-chartering" ? fallbackPost : null;
  }
}

async function getRelatedPosts(currentSlug: string): Promise<Post[]> {
  if (!isSanityConfigured || !sanityClient) {
    return [];
  }

  try {
    const posts = await sanityClient.fetch<Post[]>(latestPostsQuery);
    return posts?.filter((p) => p.slug.current !== currentSlug).slice(0, 3) || [];
  } catch (error) {
    return [];
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured || !sanityClient) {
    return [{ slug: "ultimate-guide-mediterranean-yacht-chartering" }];
  }

  try {
    const slugs = await sanityClient.fetch<string[]>(postSlugsQuery);
    return slugs?.map((slug) => ({ slug })) || [{ slug: "ultimate-guide-mediterranean-yacht-chartering" }];
  } catch (error) {
    return [{ slug: "ultimate-guide-mediterranean-yacht-chartering" }];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [post.coverImage.url],
    },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
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
  const [post, relatedPosts] = await Promise.all([
    getPost(slug),
    getRelatedPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.url,
    datePublished: post.publishedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Mediterana Yachting",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mediteranayachting.com/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
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
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
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
            <p className="text-xl text-text-secondary mb-8 pb-8 border-b border-border">
              {post.excerpt}
            </p>

            {/* Body */}
            <PortableText value={post.body} className="prose-luxury" />

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
                <PostCard key={relatedPost._id} post={relatedPost} />
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
