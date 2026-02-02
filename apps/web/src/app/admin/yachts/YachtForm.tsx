'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { GalleryManager } from '@/components/admin/GalleryManager';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Loader2, Save, MapPin, X } from 'lucide-react';
import type { Yacht } from '@/lib/db/schema';

interface DestinationOption {
  id: string;
  name: string;
  slug: string;
}

const yachtSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  type: z.enum(['motor', 'sailing', 'power-catamaran', 'sailing-catamaran']),
  featured: z.boolean().default(false),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  summary: z.string().optional(),
  // Specs
  length: z.string().optional(),
  beam: z.string().optional(),
  draft: z.string().optional(),
  year: z.coerce.number().optional().or(z.literal('')),
  yearRefitted: z.coerce.number().optional().or(z.literal('')),
  guests: z.coerce.number().optional().or(z.literal('')),
  cabins: z.coerce.number().optional().or(z.literal('')),
  crew: z.coerce.number().optional().or(z.literal('')),
  cruisingSpeed: z.string().optional(),
  // Pricing
  fromPrice: z.coerce.number().optional().or(z.literal('')),
  currency: z.string().default('EUR'),
  priceNote: z.string().optional(),
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

type YachtFormData = z.infer<typeof yachtSchema>;

interface YachtFormProps {
  yacht?: Yacht;
}

export function YachtForm({ yacht }: YachtFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const initialHeroImage = yacht?.heroImage ? JSON.parse(yacht.heroImage) : null;
  const [heroImage, setHeroImage] = useState<{ url: string; alt?: string } | null>(initialHeroImage);

  const initialGallery = yacht?.gallery ? JSON.parse(yacht.gallery) : [];
  const [gallery, setGallery] = useState<{ url: string; alt?: string }[]>(initialGallery);

  const [summary, setSummary] = useState(yacht?.summary || '');
  const [description, setDescription] = useState(yacht?.description || '');

  // Destinations
  const [allDestinations, setAllDestinations] = useState<DestinationOption[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<string[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  // Fetch destinations and yacht's current destination links
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch all destinations
        const destRes = await fetch('/api/admin/destinations');
        if (destRes.ok) {
          const dests = await destRes.json();
          setAllDestinations(dests);
        }

        // Fetch yacht's current destinations if editing
        if (yacht?.id) {
          const yachtRes = await fetch(`/api/admin/yachts/${yacht.id}`);
          if (yachtRes.ok) {
            const yachtData = await yachtRes.json();
            setSelectedDestinationIds(yachtData.destinationIds || []);
          }
        }
      } catch (error) {
        console.error('Error loading destinations:', error);
      } finally {
        setLoadingDestinations(false);
      }
    }
    loadData();
  }, [yacht?.id]);

  const toggleDestination = (destId: string) => {
    setSelectedDestinationIds(prev =>
      prev.includes(destId)
        ? prev.filter(id => id !== destId)
        : [...prev, destId]
    );
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<YachtFormData>({
    resolver: zodResolver(yachtSchema),
    defaultValues: {
      name: yacht?.name || '',
      slug: yacht?.slug || '',
      type: yacht?.type || 'motor',
      featured: yacht?.featured || false,
      videoUrl: yacht?.videoUrl || '',
      summary: yacht?.summary || '',
      length: yacht?.length || '',
      beam: yacht?.beam || '',
      draft: yacht?.draft || '',
      year: yacht?.year || '',
      yearRefitted: yacht?.yearRefitted || '',
      guests: yacht?.guests || '',
      cabins: yacht?.cabins || '',
      crew: yacht?.crew || '',
      cruisingSpeed: yacht?.cruisingSpeed || '',
      fromPrice: yacht?.fromPrice || '',
      currency: yacht?.currency || 'EUR',
      priceNote: yacht?.priceNote || '',
      seoTitle: yacht?.seoTitle || '',
      seoDescription: yacht?.seoDescription || '',
    },
  });

  const selectedType = watch('type');
  const isFeatured = watch('featured');

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const onSubmit = async (data: YachtFormData) => {
    setIsSaving(true);

    try {
      const payload = {
        ...data,
        heroImage: heroImage ? JSON.stringify(heroImage) : null,
        gallery: gallery.length > 0 ? JSON.stringify(gallery) : null,
        summary: summary || null,
        description: description || null,
        year: data.year || null,
        yearRefitted: data.yearRefitted || null,
        guests: data.guests || null,
        cabins: data.cabins || null,
        crew: data.crew || null,
        fromPrice: data.fromPrice || null,
        destinationIds: selectedDestinationIds,
      };

      const url = yacht ? `/api/admin/yachts/${yacht.id}` : '/api/admin/yachts';
      const method = yacht ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save yacht');
      }

      router.push('/admin/yachts');
      router.refresh();
    } catch (error) {
      console.error('Error saving yacht:', error);
      alert(error instanceof Error ? error.message : 'Failed to save yacht');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              onChange={(e) => {
                register('name').onChange(e);
                if (!yacht) {
                  setValue('slug', generateSlug(e.target.value));
                }
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register('slug')} />
            {errors.slug && (
              <p className="text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as 'motor' | 'sailing' | 'power-catamaran' | 'sailing-catamaran')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motor">Motor Yacht</SelectItem>
                <SelectItem value="sailing">Sailing Yacht</SelectItem>
                <SelectItem value="power-catamaran">Power Catamaran</SelectItem>
                <SelectItem value="sailing-catamaran">Sailing Catamaran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured">Featured</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setValue('featured', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm text-slate-600">Show on homepage</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <RichTextEditor
            label="Summary"
            value={summary}
            onChange={setSummary}
            placeholder="Brief description of the yacht (shown in cards and previews)..."
            minHeight="100px"
          />
        </div>

        <div className="mt-6">
          <RichTextEditor
            label="Full Description"
            value={description}
            onChange={setDescription}
            placeholder="Write a detailed description of the yacht..."
            minHeight="200px"
          />
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Media</h3>

        <div className="space-y-6">
          <ImagePicker
            label="Hero Image"
            value={heroImage}
            onChange={setHeroImage}
            placeholder="Select a hero image from media library"
          />

          <GalleryManager
            label="Gallery Images"
            value={gallery}
            onChange={setGallery}
          />

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input id="videoUrl" {...register('videoUrl')} placeholder="https://youtube.com/... or https://vimeo.com/..." />
            {errors.videoUrl && (
              <p className="text-sm text-red-600">{errors.videoUrl.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Specifications</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Input id="length" {...register('length')} placeholder="32m" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beam">Beam</Label>
            <Input id="beam" {...register('beam')} placeholder="7.5m" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="draft">Draft</Label>
            <Input id="draft" {...register('draft')} placeholder="2.2m" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year Built</Label>
            <Input id="year" type="number" {...register('year')} placeholder="2022" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearRefitted">Year Refitted</Label>
            <Input id="yearRefitted" type="number" {...register('yearRefitted')} placeholder="2024" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Guests</Label>
            <Input id="guests" type="number" {...register('guests')} placeholder="12" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cabins">Cabins</Label>
            <Input id="cabins" type="number" {...register('cabins')} placeholder="6" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crew">Crew</Label>
            <Input id="crew" type="number" {...register('crew')} placeholder="8" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cruisingSpeed">Cruising Speed</Label>
            <Input id="cruisingSpeed" {...register('cruisingSpeed')} placeholder="12 knots" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fromPrice">Starting Price (per week)</Label>
            <Input id="fromPrice" type="number" {...register('fromPrice')} placeholder="50000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={watch('currency')}
              onValueChange={(value) => setValue('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceNote">Price Note</Label>
            <Input id="priceNote" {...register('priceNote')} placeholder="Plus expenses" />
          </div>
        </div>
      </div>

      {/* Destinations */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Linked Destinations
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Select destinations where this yacht operates. These will be shown in the &quot;Explore with&quot; section on the yacht page.
        </p>

        {loadingDestinations ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading destinations...
          </div>
        ) : allDestinations.length === 0 ? (
          <p className="text-slate-500">No destinations available. Create some destinations first.</p>
        ) : (
          <>
            {/* Selected destinations */}
            {selectedDestinationIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedDestinationIds.map(id => {
                  const dest = allDestinations.find(d => d.id === id);
                  if (!dest) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {dest.name}
                      <button
                        type="button"
                        onClick={() => toggleDestination(id)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Available destinations */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allDestinations.map(dest => {
                const isSelected = selectedDestinationIds.includes(dest.id);
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => toggleDestination(dest.id)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium">{dest.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">SEO</h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <Input id="seoTitle" {...register('seoTitle')} placeholder="Leave empty to use yacht name" />
            <p className="text-xs text-slate-500">Recommended: 50-60 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <textarea
              id="seoDescription"
              {...register('seoDescription')}
              rows={2}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Brief description for search engines..."
            />
            <p className="text-xs text-slate-500">Recommended: 150-160 characters</p>
          </div>
        </div>
      </div>

      {/* Actions - Sticky at bottom */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 -mx-6 px-6 py-4 mt-8 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/yachts')}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {yacht ? 'Update Yacht' : 'Create Yacht'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
