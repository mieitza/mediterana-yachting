import type { Metadata } from "next";
import Image from "next/image";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { getAllPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, guides, and inspiration for your Mediterranean yacht charter adventure.",
};

export const revalidate = 0; // Disable caching to always fetch fresh data

export default async function BlogPage() {
  const posts = await getAllPosts();
  const [featuredPost, ...otherPosts] = posts;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80"
            alt="Mediterranean seascape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="text-shadow">The Journal</h1>
          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Insights, guides, and inspiration for your next Mediterranean adventure.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-bg-base">
          <div className="container mx-auto px-4">
            <PostCard post={featuredPost} variant="featured" />
          </div>
        </section>
      )}

      {/* All Posts */}
      {otherPosts.length > 0 && (
        <section className="section-padding bg-bg-surface">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl mb-8">Latest Articles</h2>
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
    </>
  );
}
