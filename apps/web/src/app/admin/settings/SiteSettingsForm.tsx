'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { ImageSelector } from '@/components/admin/ImageSelector';
import { SERPPreview } from '@/components/admin/seo/SERPPreview';
import type { SiteSettings } from '@/lib/db/schema';

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email('Must be a valid email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  instagram: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  facebook: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitter: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  footerTagline: z.string().optional(),
  copyrightText: z.string().optional(),
  defaultSeoImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitterHandle: z.string().optional(),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

interface SiteSettingsFormProps {
  settings?: SiteSettings | null;
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const initialLogo = settings?.logo ? JSON.parse(settings.logo) : null;
  const [logo, setLogo] = useState<{ url: string; alt?: string } | null>(initialLogo);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: settings?.siteName || 'Mediterana Yachting',
      siteDescription: settings?.siteDescription || '',
      contactEmail: settings?.contactEmail || '',
      contactPhone: settings?.contactPhone || '',
      contactAddress: settings?.contactAddress || '',
      instagram: settings?.instagram || '',
      facebook: settings?.facebook || '',
      linkedin: settings?.linkedin || '',
      twitter: settings?.twitter || '',
      youtube: settings?.youtube || '',
      whatsapp: settings?.whatsapp || '',
      footerTagline: settings?.footerTagline || '',
      copyrightText: settings?.copyrightText || '',
      defaultSeoImage: settings?.defaultSeoImage || '',
      twitterHandle: settings?.twitterHandle || '',
    },
  });

  // Watch values for live preview
  const siteNameValue = watch('siteName');
  const siteDescriptionValue = watch('siteDescription');
  const defaultSeoImageValue = watch('defaultSeoImage');

  const onSubmit = async (data: SiteSettingsFormData) => {
    setIsSaving(true);

    try {
      const payload = {
        ...data,
        logo: logo ? JSON.stringify(logo) : null,
      };

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save settings');
      }

      router.refresh();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* General */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">General</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name *</Label>
            <Input id="siteName" {...register('siteName')} />
            {errors.siteName && (
              <p className="text-sm text-red-600">{errors.siteName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <textarea
              id="siteDescription"
              {...register('siteDescription')}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Brief description of the site"
            />
          </div>

          <ImagePicker
            label="Logo"
            value={logo}
            onChange={setLogo}
            placeholder="Select a logo from media library"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email</Label>
            <Input id="contactEmail" type="email" {...register('contactEmail')} placeholder="info@mediterana.com" />
            {errors.contactEmail && (
              <p className="text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone</Label>
            <Input id="contactPhone" {...register('contactPhone')} placeholder="+385 91 123 4567" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactAddress">Address</Label>
            <Input id="contactAddress" {...register('contactAddress')} placeholder="Riva 16, Split, Croatia" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Media</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...register('instagram')} placeholder="https://instagram.com/..." />
            {errors.instagram && (
              <p className="text-sm text-red-600">{errors.instagram.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" {...register('facebook')} placeholder="https://facebook.com/..." />
            {errors.facebook && (
              <p className="text-sm text-red-600">{errors.facebook.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" {...register('linkedin')} placeholder="https://linkedin.com/company/..." />
            {errors.linkedin && (
              <p className="text-sm text-red-600">{errors.linkedin.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input id="twitter" {...register('twitter')} placeholder="https://twitter.com/..." />
            {errors.twitter && (
              <p className="text-sm text-red-600">{errors.twitter.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input id="youtube" {...register('youtube')} placeholder="https://youtube.com/..." />
            {errors.youtube && (
              <p className="text-sm text-red-600">{errors.youtube.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input id="whatsapp" {...register('whatsapp')} placeholder="+385911234567" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Footer</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="footerTagline">Tagline</Label>
            <Input id="footerTagline" {...register('footerTagline')} placeholder="Your luxury yacht charter specialists" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyrightText">Copyright Text</Label>
            <Input id="copyrightText" {...register('copyrightText')} placeholder="© 2024 Mediterana Yachting. All rights reserved." />
          </div>
        </div>
      </div>

      {/* Default SEO */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Default SEO</h3>
        <p className="text-sm text-slate-500 mb-6">
          These settings are used as defaults when pages don&apos;t have specific SEO settings configured.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultSeoImage">Default Share Image</Label>
            <ImageSelector
              value={defaultSeoImageValue || ''}
              onChange={(url) => setValue('defaultSeoImage', url)}
              aspectRatio="1.91:1"
              placeholder="Select default image for social sharing (1200x630)"
            />
            {errors.defaultSeoImage && (
              <p className="text-sm text-red-600">{errors.defaultSeoImage.message}</p>
            )}
            <p className="text-xs text-slate-500">
              Used when pages don&apos;t have their own share image. Recommended: 1200x630 pixels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="twitterHandle">Twitter Handle</Label>
              <Input id="twitterHandle" {...register('twitterHandle')} placeholder="@mediterana" />
              <p className="text-xs text-slate-500">Your Twitter/X handle (without @)</p>
            </div>
          </div>

          {/* SERP Preview */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-3">Default Google Preview</p>
            <SERPPreview
              title={siteNameValue || 'Mediterana Yachting'}
              description={siteDescriptionValue || 'Add a site description...'}
              url="https://mediterana-yachting.com"
            />
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
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
