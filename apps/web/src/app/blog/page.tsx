import type { Metadata } from "next";
import Image from "next/image";
import { PostCard } from "@/components/blog/PostCard";
import { CTASection } from "@/components/CTASection";
import { sanityClient, isSanityConfigured } from "@/lib/sanity/client";
import { allPostsQuery } from "@/lib/sanity/queries";
import type { Post } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, guides, and inspiration for your Mediterranean yacht charter adventure.",
};

export const revalidate = 3600;

// Fallback posts
const fallbackPosts: Post[] = [
  {
    _id: "1",
    _type: "post",
    title: "The Ultimate Guide to Mediterranean Yacht Chartering",
    slug: { current: "ultimate-guide-mediterranean-yacht-chartering" },
    excerpt: "Everything you need to know about planning your first luxury yacht charter in the Mediterranean, from choosing the right yacht to understanding costs.",
    coverImage: { url: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&q=80", alt: "Yacht at sunset" },
    body: [],
    tags: ["Guide", "Mediterranean", "Planning"],
    publishedAt: "2024-01-15",
    author: "Elena Papadopoulos",
  },
  {
    _id: "2",
    _type: "post",
    title: "Top 5 Hidden Gems in the Greek Islands",
    slug: { current: "top-5-hidden-gems-greek-islands" },
    excerpt: "Discover secluded beaches, charming villages, and pristine anchorages away from the tourist crowds in the Greek Islands.",
    coverImage: { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80", alt: "Greek island cove" },
    body: [],
    tags: ["Greece", "Travel Tips", "Islands"],
    publishedAt: "2024-01-10",
    author: "Marco Rossi",
  },
  {
    _id: "3",
    _type: "post",
    title: "What to Pack for Your Yacht Charter",
    slug: { current: "what-to-pack-yacht-charter" },
    excerpt: "A comprehensive packing list for the perfect yacht vacation, including essentials, optional items, and what to leave at home.",
    coverImage: { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", alt: "Beach accessories" },
    body: [],
    tags: ["Tips", "Packing", "Preparation"],
    publishedAt: "2024-01-05",
    author: "Sophie Laurent",
  },
  {
    _id: "4",
    _type: "post",
    title: "Sailing vs Motor Yachts: Which is Right for You?",
    slug: { current: "sailing-vs-motor-yachts" },
    excerpt: "Understanding the differences between sailing yachts and motor yachts to help you choose the perfect vessel for your charter.",
    coverImage: { url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80", alt: "Sailing yacht" },
    body: [],
    tags: ["Yachts", "Guide", "Comparison"],
    publishedAt: "2024-01-01",
    author: "Elena Papadopoulos",
  },
  {
    _id: "5",
    _type: "post",
    title: "Best Time to Charter in Croatia",
    slug: { current: "best-time-charter-croatia" },
    excerpt: "Month-by-month breakdown of the Croatian sailing season, weather patterns, and what to expect during peak and shoulder seasons.",
    coverImage: { url: "https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80", alt: "Dubrovnik" },
    body: [],
    tags: ["Croatia", "Planning", "Weather"],
    publishedAt: "2023-12-28",
    author: "Marco Rossi",
  },
  {
    _id: "6",
    _type: "post",
    title: "Gourmet Dining Aboard: Mediterranean Cuisine at Sea",
    slug: { current: "gourmet-dining-mediterranean-cuisine" },
    excerpt: "Explore the culinary experiences available on luxury yacht charters, from onboard chefs to local specialties at each port.",
    coverImage: { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", alt: "Mediterranean cuisine" },
    body: [],
    tags: ["Food", "Luxury", "Experience"],
    publishedAt: "2023-12-20",
    author: "Sophie Laurent",
  },
];

async function getPosts(): Promise<Post[]> {
  if (!isSanityConfigured || !sanityClient) {
    return fallbackPosts;
  }

  try {
    const posts = await sanityClient.fetch<Post[]>(allPostsQuery);
    return posts?.length > 0 ? posts : fallbackPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return fallbackPosts;
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
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
      <section className="section-padding bg-bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

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
