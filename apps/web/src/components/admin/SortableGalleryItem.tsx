'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Pencil, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  url: string;
  alt?: string;
}

interface SortableGalleryItemProps {
  id: string;
  image: GalleryImage;
  index: number;
  onRemove: () => void;
  onAltChange: (alt: string) => void;
}

export function SortableGalleryItem({
  id,
  image,
  index,
  onRemove,
  onAltChange,
}: SortableGalleryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [altText, setAltText] = useState(image.alt || '');
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const maxRetries = 3;

  const handleImageError = useCallback(() => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setHasError(false);
      }, 1000 * (retryCount + 1));
    } else {
      setHasError(true);
    }
  }, [retryCount]);

  // Add cache-busting query param on retry
  const imageUrl = retryCount > 0 ? `${image.url}?retry=${retryCount}` : image.url;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveAlt = () => {
    onAltChange(altText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveAlt();
    } else if (e.key === 'Escape') {
      setAltText(image.alt || '');
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-lg border border-slate-200 overflow-hidden ${
        isDragging ? 'shadow-lg z-50' : ''
      }`}
    >
      {/* Image */}
      <div className="aspect-square bg-slate-100">
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <AlertCircle className="h-6 w-6 mb-1" />
            <span className="text-xs">Failed</span>
          </div>
        ) : (
          <img
            key={retryCount}
            src={imageUrl}
            alt={image.alt || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
      </div>

      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1.5 rounded bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        type="button"
      >
        <GripVertical className="h-4 w-4 text-slate-600" />
      </button>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded bg-red-500 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Edit Alt Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute bottom-2 right-2 p-1.5 rounded bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        type="button"
      >
        <Pencil className="h-4 w-4 text-slate-600" />
      </button>

      {/* Index Badge */}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-xs font-medium">
        {index + 1}
      </div>

      {/* Alt Text Editor Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-3 gap-2">
          <Input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Alt text..."
            className="text-sm bg-white"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setAltText(image.alt || '');
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSaveAlt}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
