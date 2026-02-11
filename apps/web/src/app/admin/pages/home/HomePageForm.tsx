'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, X, ExternalLink } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import type { HomePage } from '@/lib/db/schema';
import Link from 'next/link';

interface HomePageFormProps {
  page?: HomePage | null;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function HomePageForm({ page }: HomePageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [features, setFeatures] = useState<Feature[]>(
    page?.whyMediteranaFeatures ? JSON.parse(page.whyMediteranaFeatures) : []
  );
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(
    page?.processSteps ? JSON.parse(page.processSteps) : []
  );
  const [faqItems, setFaqItems] = useState<FAQItem[]>(
    page?.faqItems ? JSON.parse(page.faqItems) : []
  );

  const initialHeroImage = page?.heroImage ? JSON.parse(page.heroImage) : null;
  const [heroImage, setHeroImage] = useState<{ url: string; alt?: string } | null>(initialHeroImage);
  const [ctaBackgroundImage, setCtaBackgroundImage] = useState<{ url: string; alt?: string } | null>(
    page?.ctaBackgroundImage ? { url: page.ctaBackgroundImage, alt: '' } : null
  );

  // Rich text fields
  const [heroSubtitle, setHeroSubtitle] = useState(page?.heroSubtitle || '');
  const [ctaDescription, setCtaDescription] = useState(page?.ctaDescription || '');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      heroTitle: page?.heroTitle || '',
      heroHighlight: page?.heroHighlight || '',
      featuredYachtsTitle: page?.featuredYachtsTitle || '',
      featuredYachtsSubtitle: page?.featuredYachtsSubtitle || '',
      destinationsTitle: page?.destinationsTitle || '',
      destinationsSubtitle: page?.destinationsSubtitle || '',
      whyMediteranaTitle: page?.whyMediteranaTitle || '',
      whyMediteranaSubtitle: page?.whyMediteranaSubtitle || '',
      processTitle: page?.processTitle || '',
      processSubtitle: page?.processSubtitle || '',
      faqTitle: page?.faqTitle || '',
      faqSubtitle: page?.faqSubtitle || '',
      blogTitle: page?.blogTitle || '',
      blogSubtitle: page?.blogSubtitle || '',
      ctaTitle: page?.ctaTitle || '',
      ctaButtonText: page?.ctaButtonText || '',
      ctaButtonHref: page?.ctaButtonHref || '',
      seoTitle: page?.seoTitle || '',
      seoDescription: page?.seoDescription || '',
    },
  });

  const addFeature = () => {
    setFeatures([...features, { icon: 'Anchor', title: '', description: '' }]);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addProcessStep = () => {
    setProcessSteps([
      ...processSteps,
      { step: `${processSteps.length + 1}`, title: '', description: '' },
    ]);
  };

  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...processSteps];
    updated[index][field] = value;
    setProcessSteps(updated);
  };

  const removeProcessStep = (index: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== index));
  };

  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: '', answer: '' }]);
  };

  const updateFaqItem = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqItems];
    updated[index][field] = value;
    setFaqItems(updated);
  };

  const removeFaqItem = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: Record<string, string>) => {
    setIsSaving(true);

    try {
      const payload = {
        ...data,
        heroSubtitle: heroSubtitle || null,
        ctaDescription: ctaDescription || null,
        heroImage: heroImage ? JSON.stringify(heroImage) : null,
        ctaBackgroundImage: ctaBackgroundImage?.url || null,
        whyMediteranaFeatures: features.length > 0 ? JSON.stringify(features) : null,
        processSteps: processSteps.length > 0 ? JSON.stringify(processSteps) : null,
        faqItems: faqItems.length > 0 ? JSON.stringify(faqItems) : null,
      };

      const response = await fetch('/api/admin/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      router.refresh();
      alert('Homepage saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save homepage');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Preview Link */}
      <div className="flex justify-end">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Homepage
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Title</Label>
              <Input id="heroTitle" {...register('heroTitle')} placeholder="Experience the Mediterranean" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heroHighlight">Highlight Text</Label>
              <Input id="heroHighlight" {...register('heroHighlight')} placeholder="in Ultimate Luxury" />
            </div>
          </div>

          <RichTextEditor
            label="Subtitle"
            value={heroSubtitle}
            onChange={setHeroSubtitle}
            placeholder="Discover the finest yacht charter experiences..."
            minHeight="80px"
          />

          <ImagePicker
            label="Background Image"
            value={heroImage}
            onChange={setHeroImage}
            placeholder="Select a background image from media library"
          />
        </div>
      </div>

      {/* Featured Yachts Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Featured Yachts Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="featuredYachtsTitle">Title</Label>
            <Input id="featuredYachtsTitle" {...register('featuredYachtsTitle')} placeholder="Our Fleet" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredYachtsSubtitle">Subtitle</Label>
            <Input id="featuredYachtsSubtitle" {...register('featuredYachtsSubtitle')} />
          </div>
        </div>
      </div>

      {/* Destinations Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Destinations Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="destinationsTitle">Title</Label>
            <Input id="destinationsTitle" {...register('destinationsTitle')} placeholder="Destinations" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationsSubtitle">Subtitle</Label>
            <Input id="destinationsSubtitle" {...register('destinationsSubtitle')} />
          </div>
        </div>
      </div>

      {/* Why Mediterana Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Why Mediterana Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="whyMediteranaTitle">Title</Label>
            <Input id="whyMediteranaTitle" {...register('whyMediteranaTitle')} placeholder="Why Choose Us" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whyMediteranaSubtitle">Subtitle</Label>
            <Input id="whyMediteranaSubtitle" {...register('whyMediteranaSubtitle')} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Features</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="h-4 w-4 mr-1" /> Add Feature
            </Button>
          </div>

          {features.map((feature, index) => (
            <div key={index} className="flex gap-2 items-start p-4 border border-slate-200 rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  placeholder="Icon name"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={feature.description}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Process Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="processTitle">Title</Label>
            <Input id="processTitle" {...register('processTitle')} placeholder="How It Works" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processSubtitle">Subtitle</Label>
            <Input id="processSubtitle" {...register('processSubtitle')} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Steps</Label>
            <Button type="button" variant="outline" size="sm" onClick={addProcessStep}>
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </Button>
          </div>

          {processSteps.map((step, index) => (
            <div key={index} className="flex gap-2 items-start p-4 border border-slate-200 rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  placeholder="Step number"
                  value={step.step}
                  onChange={(e) => updateProcessStep(index, 'step', e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={step.title}
                  onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={step.description}
                  onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeProcessStep(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">FAQ Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="faqTitle">Title</Label>
            <Input id="faqTitle" {...register('faqTitle')} placeholder="Frequently Asked Questions" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faqSubtitle">Subtitle</Label>
            <Input id="faqSubtitle" {...register('faqSubtitle')} placeholder="Everything you need to know..." />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Questions & Answers</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </div>

          {faqItems.map((item, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder="Question"
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                  />
                  <textarea
                    placeholder="Answer"
                    value={item.answer}
                    onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFaqItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {faqItems.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No FAQ items added. Default FAQ content will be shown on the homepage.
            </p>
          )}
        </div>
      </div>

      {/* Blog Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Blog Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="blogTitle">Title</Label>
            <Input id="blogTitle" {...register('blogTitle')} placeholder="Latest News" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blogSubtitle">Subtitle</Label>
            <Input id="blogSubtitle" {...register('blogSubtitle')} />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">CTA Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ctaTitle">Title</Label>
            <Input id="ctaTitle" {...register('ctaTitle')} placeholder="Ready to Set Sail?" />
          </div>

          <RichTextEditor
            label="Description"
            value={ctaDescription}
            onChange={setCtaDescription}
            placeholder="Encourage visitors to take action..."
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
            label="Background Image"
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

      {/* Actions - Sticky at bottom */}
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
              Save Homepage
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
