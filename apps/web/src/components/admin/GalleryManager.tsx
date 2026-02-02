'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Image as ImageIcon,
  Upload,
  Loader2,
  Search,
  Plus,
  Check,
} from 'lucide-react';
import { SortableGalleryItem } from './SortableGalleryItem';
import type { Image } from '@/lib/db/schema';

interface GalleryImage {
  url: string;
  alt?: string;
}

interface GalleryManagerProps {
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  label?: string;
  maxImages?: number;
}

export function GalleryManager({
  value = [],
  onChange,
  label = 'Gallery Images',
  maxImages,
}: GalleryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create unique IDs for sortable items
  const itemIds = value.map((img, idx) => `gallery-${idx}-${img.url}`);

  useEffect(() => {
    if (isOpen) {
      loadImages();
      // Pre-select images that are already in the gallery
      setSelectedImages(new Set(value.map((img) => img.url)));
    }
  }, [isOpen, value]);

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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append('files', file);
      }

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newImages = result.images || [result];
        setImages((prev) => [...newImages, ...prev]);
        // Auto-select newly uploaded images
        setSelectedImages((prev) => {
          const next = new Set(prev);
          newImages.forEach((img: Image) => next.add(img.url));
          return next;
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const toggleImageSelection = (url: string) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        if (maxImages && next.size >= maxImages) {
          alert(`Maximum ${maxImages} images allowed`);
          return prev;
        }
        next.add(url);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    // Build new gallery maintaining order of existing images + new ones
    const existingUrls = new Set(value.map((img) => img.url));
    const newGallery: GalleryImage[] = [...value];

    // Add newly selected images
    selectedImages.forEach((url) => {
      if (!existingUrls.has(url)) {
        const image = images.find((img) => img.url === url);
        newGallery.push({ url, alt: image?.alt || '' });
      }
    });

    // Remove deselected images
    const finalGallery = newGallery.filter((img) => selectedImages.has(img.url));

    onChange(finalGallery);
    setIsOpen(false);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = itemIds.indexOf(active.id as string);
        const newIndex = itemIds.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
          onChange(arrayMove(value, oldIndex, newIndex));
        }
      }
    },
    [itemIds, onChange, value]
  );

  const handleRemove = (index: number) => {
    const newGallery = [...value];
    newGallery.splice(index, 1);
    onChange(newGallery);
  };

  const handleAltChange = (index: number, alt: string) => {
    const newGallery = [...value];
    newGallery[index] = { ...newGallery[index], alt };
    onChange(newGallery);
  };

  const filteredImages = images.filter(
    (img) =>
      img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.alt && img.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-slate-500">
          {value.length} image{value.length !== 1 ? 's' : ''}
          {maxImages && ` / ${maxImages} max`}
        </span>
      </div>

      {value.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {value.map((image, index) => (
                <SortableGalleryItem
                  key={itemIds[index]}
                  id={itemIds[index]}
                  image={image}
                  index={index}
                  onRemove={() => handleRemove(index)}
                  onAltChange={(alt) => handleAltChange(index, alt)}
                />
              ))}

              {/* Add More Button */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">Add More</span>
              </button>
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full h-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary transition-colors"
        >
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm font-medium">Add Gallery Images</span>
          <span className="text-xs">Click to select or upload images</span>
        </button>
      )}

      {/* Image Selection Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl flex flex-col">
          <DialogTitle>
            Select Gallery Images
            {selectedImages.size > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({selectedImages.size} selected)
              </span>
            )}
          </DialogTitle>

          <div className="flex items-center gap-4">
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
                multiple
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

          <div className="flex-1 overflow-y-auto min-h-0 max-h-[50vh]">
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
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3 pb-4">
                {filteredImages.map((image) => {
                  const isSelected = selectedImages.has(image.url);
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => toggleImageSelection(image.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || image.originalName}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSelected}>
              {selectedImages.size > 0
                ? `Update Gallery (${selectedImages.size} images)`
                : 'Update Gallery'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
