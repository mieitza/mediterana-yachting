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
import type { AboutPage } from '@/lib/db/schema';
import Link from 'next/link';

interface AboutPageFormProps {
  page?: AboutPage | null;
}

interface Statistic {
  value: string;
  label: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export function AboutPageForm({ page }: AboutPageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const initialHeroImage = page?.heroImage ? JSON.parse(page.heroImage) : null;
  const initialStoryImage = page?.storyImage ? JSON.parse(page.storyImage) : null;
  const [heroImage, setHeroImage] = useState<{ url: string; alt?: string } | null>(initialHeroImage);
  const [storyImage, setStoryImage] = useState<{ url: string; alt?: string } | null>(initialStoryImage);
  const [ctaBackgroundImage, setCtaBackgroundImage] = useState<{ url: string; alt?: string } | null>(
    page?.ctaBackgroundImage ? { url: page.ctaBackgroundImage, alt: '' } : null
  );

  const [statistics, setStatistics] = useState<Statistic[]>(
    page?.statistics ? JSON.parse(page.statistics) : []
  );
  const [values, setValues] = useState<Value[]>(
    page?.values ? JSON.parse(page.values) : []
  );
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(
    page?.processSteps ? JSON.parse(page.processSteps) : []
  );

  // Rich text fields
  const [heroSubtitle, setHeroSubtitle] = useState(page?.heroSubtitle || '');
  const [storyContent, setStoryContent] = useState(page?.storyContent || '');
  const [ctaDescription, setCtaDescription] = useState(page?.ctaDescription || '');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      heroTitle: page?.heroTitle || '',
      storyTitle: page?.storyTitle || '',
      valuesTitle: page?.valuesTitle || '',
      valuesSubtitle: page?.valuesSubtitle || '',
      processTitle: page?.processTitle || '',
      processSubtitle: page?.processSubtitle || '',
      teamTitle: page?.teamTitle || '',
      teamSubtitle: page?.teamSubtitle || '',
      ctaTitle: page?.ctaTitle || '',
      ctaButtonText: page?.ctaButtonText || '',
      ctaButtonHref: page?.ctaButtonHref || '',
      seoTitle: page?.seoTitle || '',
      seoDescription: page?.seoDescription || '',
    },
  });

  // Statistics handlers
  const addStatistic = () => {
    setStatistics([...statistics, { value: '', label: '' }]);
  };

  const updateStatistic = (index: number, field: keyof Statistic, value: string) => {
    const updated = [...statistics];
    updated[index][field] = value;
    setStatistics(updated);
  };

  const removeStatistic = (index: number) => {
    setStatistics(statistics.filter((_, i) => i !== index));
  };

  // Values handlers
  const addValue = () => {
    setValues([...values, { icon: 'Star', title: '', description: '' }]);
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const updated = [...values];
    updated[index][field] = value;
    setValues(updated);
  };

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  // Process steps handlers
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

  const onSubmit = async (data: Record<string, string>) => {
    setIsSaving(true);

    try {
      const payload = {
        ...data,
        heroSubtitle: heroSubtitle || null,
        storyContent: storyContent || null,
        ctaDescription: ctaDescription || null,
        heroImage: heroImage ? JSON.stringify(heroImage) : null,
        storyImage: storyImage ? JSON.stringify(storyImage) : null,
        ctaBackgroundImage: ctaBackgroundImage?.url || null,
        statistics: statistics.length > 0 ? JSON.stringify(statistics) : null,
        values: values.length > 0 ? JSON.stringify(values) : null,
        processSteps: processSteps.length > 0 ? JSON.stringify(processSteps) : null,
      };

      const response = await fetch('/api/admin/pages/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      router.refresh();
      alert('About page saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save about page');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Preview Link */}
      <div className="flex justify-end">
        <Link
          href="/about"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Preview About Page
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input id="heroTitle" {...register('heroTitle')} placeholder="About Mediterana Yachting" />
          </div>

          <RichTextEditor
            label="Subtitle"
            value={heroSubtitle}
            onChange={setHeroSubtitle}
            placeholder="Your trusted partner in luxury yacht charters..."
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

      {/* Story Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Our Story Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storyTitle">Title</Label>
            <Input id="storyTitle" {...register('storyTitle')} placeholder="Our Story" />
          </div>

          <RichTextEditor
            label="Content"
            value={storyContent}
            onChange={setStoryContent}
            placeholder="Tell your company's story..."
            minHeight="200px"
          />

          <ImagePicker
            label="Story Image"
            value={storyImage}
            onChange={setStoryImage}
            placeholder="Select a story image from media library"
          />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistics</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Add key statistics to highlight your achievements</p>
            <Button type="button" variant="outline" size="sm" onClick={addStatistic}>
              <Plus className="h-4 w-4 mr-1" /> Add Statistic
            </Button>
          </div>

          {statistics.map((stat, index) => (
            <div key={index} className="flex gap-2 items-start p-4 border border-slate-200 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="Value (e.g., 500+)"
                  value={stat.value}
                  onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                />
                <Input
                  placeholder="Label (e.g., Happy Clients)"
                  value={stat.label}
                  onChange={(e) => updateStatistic(index, 'label', e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeStatistic(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Our Values Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="valuesTitle">Title</Label>
            <Input id="valuesTitle" {...register('valuesTitle')} placeholder="Our Values" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valuesSubtitle">Subtitle</Label>
            <Input id="valuesSubtitle" {...register('valuesSubtitle')} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Values</Label>
            <Button type="button" variant="outline" size="sm" onClick={addValue}>
              <Plus className="h-4 w-4 mr-1" /> Add Value
            </Button>
          </div>

          {values.map((value, index) => (
            <div key={index} className="flex gap-2 items-start p-4 border border-slate-200 rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input
                  placeholder="Icon name"
                  value={value.icon}
                  onChange={(e) => updateValue(index, 'icon', e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={value.title}
                  onChange={(e) => updateValue(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Description"
                  value={value.description}
                  onChange={(e) => updateValue(index, 'description', e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeValue(index)}>
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
            <Input id="processTitle" {...register('processTitle')} placeholder="How We Work" />
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

      {/* Team Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Section</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teamTitle">Title</Label>
            <Input id="teamTitle" {...register('teamTitle')} placeholder="Meet Our Team" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamSubtitle">Subtitle</Label>
            <Input id="teamSubtitle" {...register('teamSubtitle')} />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Team members are managed in the <Link href="/admin/team" className="text-primary hover:underline">Team section</Link>
        </p>
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
              Save About Page
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
