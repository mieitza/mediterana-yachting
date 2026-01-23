'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  Search,
  X,
  Check,
} from 'lucide-react';
import type { Image } from '@/lib/db/schema';

interface ImagePickerProps {
  value?: { url: string; alt?: string } | null;
  onChange: (value: { url: string; alt?: string } | null) => void;
  label?: string;
  placeholder?: string;
}

export function ImagePicker({
  value,
  onChange,
  label = 'Image',
  placeholder = 'Select an image',
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [altText, setAltText] = useState(value?.alt || '');

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  useEffect(() => {
    setAltText(value?.alt || '');
  }, [value?.alt]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newImage = await response.json();
        setImages((prev) => [newImage, ...prev]);
        // Auto-select the uploaded image
        onChange({ url: newImage.url, alt: newImage.alt || '' });
        setIsOpen(false);
      } else {
        const error = await response.json();
        alert(error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSelect = (image: Image) => {
    onChange({ url: image.url, alt: image.alt || '' });
    setAltText(image.alt || '');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setAltText('');
  };

  const handleAltChange = (newAlt: string) => {
    setAltText(newAlt);
    if (value?.url) {
      onChange({ url: value.url, alt: newAlt });
    }
  };

  const filteredImages = images.filter(
    (img) =>
      img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.alt && img.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value?.url ? (
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src={value.url}
              alt={value.alt || ''}
              className="max-w-xs max-h-40 rounded-lg border border-slate-200 object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <Input
              value={altText}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="Alt text (optional)"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
              Change
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full h-32 border-dashed flex flex-col items-center justify-center gap-2"
        >
          <ImageIcon className="h-8 w-8 text-slate-400" />
          <span className="text-slate-600">{placeholder}</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button asChild disabled={uploading}>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">
                  {searchQuery ? 'No images found' : 'No images uploaded yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {filteredImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => handleSelect(image)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      value?.url === image.url
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || image.originalName}
                      className="w-full h-full object-cover"
                    />
                    {value?.url === image.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
