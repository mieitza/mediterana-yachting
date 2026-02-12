import type { Metadata } from "next";
import Image from "next/image";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/StructuredData";
import { getAllPosts, getBlogPage } from "@/lib/data";
import { stripHtml } from "@/lib/utils/html";

export const revalidate = 0; // Disable caching to always fetch fresh data

// Default content
const defaultContent = {
  heroTitle: "The Journal",
  heroSubtitle: "Insights, guides, and inspiration for your next Mediterranean adventure.",
  heroImage: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80", alt: "Mediterranean seascape" },
  introTitle: "Latest Articles",
  featuredTitle: "Featured Stories",
  newsletterTitle: "Subscribe to Our Newsletter",
  newsletterDescription: "Get the latest articles and exclusive offers delivered to your inbox.",
  seoTitle: "Yacht Charter Blog | Mediterranean Sailing Guides & Tips",
  seoDescription: "Expert insights, destination guides, and inspiration for your Mediterranean yacht charter. Learn about sailing routes, best seasons, yacht types, and insider tips.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getBlogPage();
  const title = page?.seoTitle || defaultContent.seoTitle;
  const description = page?.seoDescription || defaultContent.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: "https://www.mediteranayachting.com/blog",
    },
    openGraph: {
      title,
      description,
      url: "https://www.mediteranayachting.com/blog",
      type: "website",
    },
  };
}

export default async function BlogPage() {
  const [posts, page] = await Promise.all([
    getAllPosts(),
    getBlogPage(),
  ]);
  const [featuredPost, ...otherPosts] = posts;

  const heroImage = page?.heroImage || defaultContent.heroImage;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.url || defaultContent.heroImage.url}
            alt={heroImage?.alt || "Blog hero"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">{page?.heroTitle || defaultContent.heroTitle}</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            {stripHtml(page?.heroSubtitle || defaultContent.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-bg-base">
          <div className="container mx-auto px-4">
            {(page?.featuredTitle || page?.featuredSubtitle) && (
              <div className="text-center mb-8">
                {page?.featuredTitle && <h2 className="text-2xl md:text-3xl">{page.featuredTitle}</h2>}
                {page?.featuredSubtitle && <p className="mt-2 text-text-secondary">{page.featuredSubtitle}</p>}
              </div>
            )}
            <PostCard post={featuredPost} variant="featured" />
          </div>
        </section>
      )}

      {/* All Posts */}
      {otherPosts.length > 0 && (
        <section className="section-padding bg-bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl mb-8">{page?.introTitle || defaultContent.introTitle}</h2>
            {page?.introDescription && (
              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: page.introDescription }}
              />
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <section className="section-padding bg-bg-base">
          <div className="container mx-auto px-4 text-center">
            <p className="text-text-secondary text-lg">
              No blog posts available at the moment.
            </p>
            <p className="text-text-muted mt-2">
              Please check back later for new content.
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title="Ready to experience it yourself?"
        subtitle="Turn inspiration into reality. Let us help you plan your perfect Mediterranean yacht charter."
        primaryCta={{ label: "Start Planning", href: "/contact" }}
        variant="dark"
      />

      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <WebPageSchema
        title={page?.seoTitle || defaultContent.seoTitle}
        description={page?.seoDescription || defaultContent.seoDescription}
        url="https://www.mediteranayachting.com/blog"
      />
    </>
  );
}
