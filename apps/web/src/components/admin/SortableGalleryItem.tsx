'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Pencil } from 'lucide-react';
import { useState } from 'react';
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
      <div className="aspect-square">
        <img
          src={image.url}
          alt={image.alt || `Gallery image ${index + 1}`}
          className="w-full h-full object-cover"
        />
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
