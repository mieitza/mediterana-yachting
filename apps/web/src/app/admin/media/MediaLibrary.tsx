'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Loader2,
  Search,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Image } from '@/lib/db/schema';

interface MediaLibraryProps {
  images: Image[];
}

export function MediaLibrary({ images }: MediaLibraryProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredImages = images.filter(
    (img) =>
      img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (img.alt && img.alt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }
      }

      router.refresh();
    } catch (error) {
      console.error('Error uploading:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload images');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }, []);

  const handleDelete = async () => {
    if (!selectedImage) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/media/${selectedImage.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setSelectedImage(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
          </span>

          <label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button asChild disabled={isUploading}>
              <span>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Image Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {searchQuery ? 'No images found' : 'No images yet'}
          </h3>
          <p className="text-slate-600 mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Upload your first image to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt || image.originalName}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-600 truncate">
                  {image.originalName}
                </p>
                <p className="text-xs text-slate-400">
                  {image.width}x{image.height} • {formatFileSize(image.size || 0)}
                </p>
              </div>

              {/* Quick actions on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(image.url);
                  }}
                >
                  {copiedUrl === image.url ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.originalName}</DialogTitle>
                <DialogDescription>
                  {selectedImage.width}x{selectedImage.height} •{' '}
                  {formatFileSize(selectedImage.size || 0)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt || selectedImage.originalName}
                    className="w-full max-h-96 object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <div className="flex gap-2">
                    <Input value={selectedImage.url} readOnly />
                    <Button
                      variant="outline"
                      onClick={() => copyUrl(selectedImage.url)}
                    >
                      {copiedUrl === selectedImage.url ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {selectedImage.alt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Alt Text</label>
                    <p className="text-sm text-slate-600">{selectedImage.alt}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Image
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
