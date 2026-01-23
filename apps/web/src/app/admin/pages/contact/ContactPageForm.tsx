'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, X, ExternalLink } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import type { ContactPage } from '@/lib/db/schema';
import Link from 'next/link';

interface ContactPageFormProps {
  page?: ContactPage | null;
}

interface OfficeHours {
  days: string;
  hours: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export function ContactPageForm({ page }: ContactPageFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const initialHeroImage = page?.heroImage ? JSON.parse(page.heroImage) : null;
  const [heroImage, setHeroImage] = useState<{ url: string; alt?: string } | null>(initialHeroImage);

  const [officeHours, setOfficeHours] = useState<OfficeHours[]>(
    page?.officeHours ? JSON.parse(page.officeHours) : []
  );
  const [faqItems, setFaqItems] = useState<FaqItem[]>(
    page?.faqItems ? JSON.parse(page.faqItems) : []
  );

  const { register, handleSubmit } = useForm({
    defaultValues: {
      heroTitle: page?.heroTitle || '',
      heroSubtitle: page?.heroSubtitle || '',
      contactEmail: page?.contactEmail || '',
      contactPhone: page?.contactPhone || '',
      contactWhatsapp: page?.contactWhatsapp || '',
      contactAddress: page?.contactAddress || '',
      timezoneNote: page?.timezoneNote || '',
      formTitle: page?.formTitle || '',
      formDescription: page?.formDescription || '',
      faqTitle: page?.faqTitle || '',
      seoTitle: page?.seoTitle || '',
      seoDescription: page?.seoDescription || '',
    },
  });

  // Office hours handlers
  const addOfficeHours = () => {
    setOfficeHours([...officeHours, { days: '', hours: '' }]);
  };

  const updateOfficeHours = (index: number, field: keyof OfficeHours, value: string) => {
    const updated = [...officeHours];
    updated[index][field] = value;
    setOfficeHours(updated);
  };

  const removeOfficeHours = (index: number) => {
    setOfficeHours(officeHours.filter((_, i) => i !== index));
  };

  // FAQ handlers
  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: '', answer: '' }]);
  };

  const updateFaqItem = (index: number, field: keyof FaqItem, value: string) => {
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
        heroImage: heroImage ? JSON.stringify(heroImage) : null,
        officeHours: officeHours.length > 0 ? JSON.stringify(officeHours) : null,
        faqItems: faqItems.length > 0 ? JSON.stringify(faqItems) : null,
      };

      const response = await fetch('/api/admin/pages/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      router.refresh();
      alert('Contact page saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save contact page');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Preview Link */}
      <div className="flex justify-end">
        <Link
          href="/contact"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Preview Contact Page
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input id="heroTitle" {...register('heroTitle')} placeholder="Contact Us" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <textarea
              id="heroSubtitle"
              {...register('heroSubtitle')}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Get in touch with our charter experts..."
            />
          </div>

          <ImagePicker
            label="Background Image"
            value={heroImage}
            onChange={setHeroImage}
            placeholder="Select a background image from media library"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input id="contactEmail" type="email" {...register('contactEmail')} placeholder="info@mediterana-yachting.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input id="contactPhone" {...register('contactPhone')} placeholder="+385 1 234 5678" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactWhatsapp">WhatsApp</Label>
              <Input id="contactWhatsapp" {...register('contactWhatsapp')} placeholder="+385 1 234 5678" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactAddress">Address</Label>
              <Input id="contactAddress" {...register('contactAddress')} placeholder="123 Marina Drive, Split, Croatia" />
            </div>
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Office Hours</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Add your business hours</p>
            <Button type="button" variant="outline" size="sm" onClick={addOfficeHours}>
              <Plus className="h-4 w-4 mr-1" /> Add Hours
            </Button>
          </div>

          {officeHours.map((hours, index) => (
            <div key={index} className="flex gap-2 items-start p-4 border border-slate-200 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  placeholder="Days (e.g., Monday - Friday)"
                  value={hours.days}
                  onChange={(e) => updateOfficeHours(index, 'days', e.target.value)}
                />
                <Input
                  placeholder="Hours (e.g., 9:00 AM - 6:00 PM)"
                  value={hours.hours}
                  onChange={(e) => updateOfficeHours(index, 'hours', e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeOfficeHours(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="timezoneNote">Timezone Note</Label>
            <Input id="timezoneNote" {...register('timezoneNote')} placeholder="All times are in Central European Time (CET)" />
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Form Section</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formTitle">Title</Label>
            <Input id="formTitle" {...register('formTitle')} placeholder="Send Us a Message" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formDescription">Description</Label>
            <textarea
              id="formDescription"
              {...register('formDescription')}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Have questions? We'd love to hear from you..."
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">FAQ Section</h3>

        <div className="space-y-4">
          <div className="space-y-2 mb-4">
            <Label htmlFor="faqTitle">Section Title</Label>
            <Input id="faqTitle" {...register('faqTitle')} placeholder="Frequently Asked Questions" />
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Add common questions and answers</p>
            <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>
              <Plus className="h-4 w-4 mr-1" /> Add FAQ
            </Button>
          </div>

          {faqItems.map((faq, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">FAQ #{index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFaqItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  placeholder="What is your question?"
                  value={faq.question}
                  onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <textarea
                  placeholder="Provide the answer..."
                  value={faq.answer}
                  onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          ))}
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
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Contact Page
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
