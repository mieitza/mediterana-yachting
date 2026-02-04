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
import type { YachtsPage } from '@/lib/db/schema';
import Link from 'next/link';

// Default content - must match what's shown on the public page
const defaultContent = {
  heroTitle: 'Our Fleet',
  heroSubtitle: 'Explore our curated selection of exceptional yachts, each handpicked for quality, comfort, and crew excellence.',
  heroImage: { url: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&q=80', alt: 'Luxury yachts' },
  introTitle: '',
  introDescription: '',
  faqTitle: 'Yacht Charter Questions',
  faqSubtitle: 'Learn about our yacht types and charter options.',
  ctaTitle: "Can't find what you're looking for?",
  ctaDescription: "Our team has access to an extensive network of yachts. Let us know your requirements and we'll find the perfect match.",
  ctaButtonText: 'Contact Us',
  ctaButtonHref: '/contact',
  seoTitle: 'Luxury Yacht Charter Fleet | Motor Yachts & Sailing Yachts',
  seoDescription: 'Browse our curated fleet of luxury motor yachts, sailing yachts, and catamarans for Mediterranean charter. Professional crew, premium amenities. Find your perfect yacht.',
};

interface YachtsPageFormProps {
  page?: YachtsPage | null;
}

export function YachtsPageForm({ page }: YachtsPageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Parse hero image from database or use default
  const initialHeroImage = page?.heroImage
    ? JSON.parse(page.heroImage)
    : defaultContent.heroImage;
  const [heroImage, setHeroImage] = useState<{ url: string; alt?: string } | null>(initialHeroImage);

  // CTA background image
  const [ctaBackgroundImage, setCtaBackgroundImage] = useState<{ url: string; alt?: string } | null>(
    page?.ctaBackgroundImage ? JSON.parse(page.ctaBackgroundImage) : null
  );

  // Rich text fields - use database value or default
  const [introDescription, setIntroDescription] = useState(page?.introDescription || defaultContent.introDescription);
  const [ctaDescription, setCtaDescription] = useState(page?.ctaDescription || defaultContent.ctaDescription);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      heroTitle: page?.heroTitle || defaultContent.heroTitle,
      heroSubtitle: page?.heroSubtitle || defaultContent.heroSubtitle,
      introTitle: page?.introTitle || defaultContent.introTitle,
      faqTitle: page?.faqTitle || defaultContent.faqTitle,
      faqSubtitle: page?.faqSubtitle || defaultContent.faqSubtitle,
      ctaTitle: page?.ctaTitle || defaultContent.ctaTitle,
      ctaButtonText: page?.ctaButtonText || defaultContent.ctaButtonText,
      ctaButtonHref: page?.ctaButtonHref || defaultContent.ctaButtonHref,
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
        ctaDescription: ctaDescription || null,
        heroImage: heroImage ? JSON.stringify(heroImage) : null,
        ctaBackgroundImage: ctaBackgroundImage ? JSON.stringify(ctaBackgroundImage) : null,
      };

      const response = await fetch('/api/admin/pages/yachts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      router.refresh();
      alert('Yachts page saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save yachts page');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Preview Link */}
      <div className="flex justify-end">
        <Link
          href="/yachts"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Yachts Page
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input id="heroTitle" {...register('heroTitle')} placeholder="Our Fleet" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Input id="heroSubtitle" {...register('heroSubtitle')} placeholder="Explore our curated selection..." />
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
        <p className="text-sm text-slate-500 mb-4">Optional section that appears above the yachts grid</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="introTitle">Title</Label>
            <Input id="introTitle" {...register('introTitle')} placeholder="Discover Our Fleet" />
          </div>

          <RichTextEditor
            label="Description"
            value={introDescription}
            onChange={setIntroDescription}
            placeholder="Describe your yacht fleet..."
            minHeight="120px"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">FAQ Section</h3>
        <p className="text-sm text-slate-500 mb-4">The FAQ items are managed separately. Here you can customize the section title and subtitle.</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faqTitle">Title</Label>
            <Input id="faqTitle" {...register('faqTitle')} placeholder="Yacht Charter Questions" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faqSubtitle">Subtitle</Label>
            <Input id="faqSubtitle" {...register('faqSubtitle')} placeholder="Learn about our yacht types and charter options." />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">CTA Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ctaTitle">Title</Label>
            <Input id="ctaTitle" {...register('ctaTitle')} placeholder="Can't find what you're looking for?" />
          </div>

          <RichTextEditor
            label="Description"
            value={ctaDescription}
            onChange={setCtaDescription}
            placeholder="Our team has access to an extensive network..."
            minHeight="80px"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaButtonText">Button Text</Label>
              <Input id="ctaButtonText" {...register('ctaButtonText')} placeholder="Contact Us" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaButtonHref">Button Link</Label>
              <Input id="ctaButtonHref" {...register('ctaButtonHref')} placeholder="/contact" />
            </div>
          </div>

          <ImagePicker
            label="Background Image (optional)"
            value={ctaBackgroundImage}
            onChange={setCtaBackgroundImage}
            placeholder="Select a CTA background image from media library"
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
              Save Yachts Page
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
