'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ExternalLink } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import type { BlogPage } from '@/lib/db/schema';
import Link from 'next/link';

// Default content - must match what's shown on the public page
const defaultContent = {
  heroTitle: 'The Journal',
  heroSubtitle: 'Insights, guides, and inspiration for your next Mediterranean adventure.',
  heroImage: { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80', alt: 'Mediterranean seascape' },
  introTitle: 'Latest Articles',
  introDescription: '',
  featuredTitle: '',
  featuredSubtitle: '',
  newsletterTitle: '',
  newsletterDescription: '',
  seoTitle: 'Yacht Charter Blog | Mediterranean Sailing Guides & Tips',
  seoDescription: 'Expert insights, destination guides, and inspiration for your Mediterranean yacht charter. Learn about sailing routes, best seasons, yacht types, and insider tips.',
};

interface BlogPageFormProps {
  page?: BlogPage | null;
}

export function BlogPageForm({ page }: BlogPageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Parse hero image from database or use default
  const initialHeroImage = page?.heroImage
    ? JSON.parse(page.heroImage)
    : defaultContent.heroImage;
  const [heroImage, setHeroImage] = useState<{ url: string; alt?: string } | null>(initialHeroImage);

  // Rich text fields - use database value or default
  const [introDescription, setIntroDescription] = useState(page?.introDescription || defaultContent.introDescription);
  const [newsletterDescription, setNewsletterDescription] = useState(page?.newsletterDescription || defaultContent.newsletterDescription);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      heroTitle: page?.heroTitle || defaultContent.heroTitle,
      heroSubtitle: page?.heroSubtitle || defaultContent.heroSubtitle,
      introTitle: page?.introTitle || defaultContent.introTitle,
      featuredTitle: page?.featuredTitle || defaultContent.featuredTitle,
      featuredSubtitle: page?.featuredSubtitle || defaultContent.featuredSubtitle,
      newsletterTitle: page?.newsletterTitle || defaultContent.newsletterTitle,
      seoTitle: page?.seoTitle || defaultContent.seoTitle,
      seoDescription: page?.seoDescription || defaultContent.seoDescription,
    },
  });

  const onSubmit = async (data: Record<string, string>) => {
    setIsSaving(true);

    try {
      const payload = {
        ...data,
        introDescription: introDescription || null,
        newsletterDescription: newsletterDescription || null,
        heroImage: heroImage ? JSON.stringify(heroImage) : null,
      };

      const response = await fetch('/api/admin/pages/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      router.refresh();
      alert('Blog page saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save blog page');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Preview Link */}
      <div className="flex justify-end">
        <Link
          href="/blog"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Blog Page
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input id="heroTitle" {...register('heroTitle')} placeholder="The Journal" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Input id="heroSubtitle" {...register('heroSubtitle')} placeholder="Insights, guides, and inspiration..." />
          </div>

          <ImagePicker
            label="Background Image"
            value={heroImage}
            onChange={setHeroImage}
            placeholder="Select a background image from media library"
          />
        </div>
      </div>

      {/* Intro Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Introduction Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="introTitle">Title</Label>
            <Input id="introTitle" {...register('introTitle')} placeholder="Latest Articles" />
          </div>

          <RichTextEditor
            label="Description"
            value={introDescription}
            onChange={setIntroDescription}
            placeholder="Welcome message for blog visitors..."
            minHeight="120px"
          />
        </div>
      </div>

      {/* Featured Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Featured Posts Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="featuredTitle">Title</Label>
            <Input id="featuredTitle" {...register('featuredTitle')} placeholder="Featured Stories" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredSubtitle">Subtitle</Label>
            <Input id="featuredSubtitle" {...register('featuredSubtitle')} placeholder="Our top picks for you" />
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Newsletter Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newsletterTitle">Title</Label>
            <Input id="newsletterTitle" {...register('newsletterTitle')} placeholder="Subscribe to Our Newsletter" />
          </div>

          <RichTextEditor
            label="Description"
            value={newsletterDescription}
            onChange={setNewsletterDescription}
            placeholder="Encourage visitors to subscribe..."
            minHeight="80px"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <Input id="seoTitle" {...register('seoTitle')} />
            <p className="text-xs text-slate-500">Recommended: 50-60 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <textarea
              id="seoDescription"
              {...register('seoDescription')}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-slate-500">Recommended: 150-160 characters</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 -mx-6 px-6 py-4 mt-8 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Blog Page
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
