'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, GripVertical, X, Ship, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils/cn';

interface Yacht {
  id: string;
  name: string;
  slug: string;
  type: string;
  heroImage: string | null;
  guests: number | null;
  length: string | null;
}

interface YachtsPickerProps {
  label?: string;
  value: string[];
  onChange: (yachtIds: string[]) => void;
}

const typeLabels: Record<string, string> = {
  motor: 'Motor Yacht',
  sailing: 'Sailing Yacht',
  'power-catamaran': 'Power Catamaran',
  'sailing-catamaran': 'Sailing Catamaran',
};

export function YachtsPicker({ label = 'Recommended Yachts', value, onChange }: YachtsPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [selectedYachts, setSelectedYachts] = useState<Yacht[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Fetch all yachts
  useEffect(() => {
    const fetchYachts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/yachts');
        if (response.ok) {
          const data = await response.json();
          setYachts(data);
        }
      } catch (error) {
        console.error('Error fetching yachts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchYachts();
  }, []);

  // Sync selected yachts when value or yachts change
  useEffect(() => {
    if (yachts.length > 0 && value.length > 0) {
      const selected = value
        .map(id => yachts.find(y => y.id === id))
        .filter((y): y is Yacht => y !== undefined);
      setSelectedYachts(selected);
    } else {
      setSelectedYachts([]);
    }
  }, [value, yachts]);

  const filteredYachts = yachts.filter(yacht =>
    yacht.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    yacht.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleYacht = (yacht: Yacht) => {
    const isSelected = value.includes(yacht.id);
    if (isSelected) {
      onChange(value.filter(id => id !== yacht.id));
    } else {
      onChange([...value, yacht.id]);
    }
  };

  const removeYacht = (yachtId: string) => {
    onChange(value.filter(id => id !== yachtId));
  };

  const parseHeroImage = (heroImage: string | null): { url: string; alt?: string } | null => {
    if (!heroImage) return null;
    try {
      return JSON.parse(heroImage);
    } catch {
      return null;
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...value];
    const draggedId = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedId);
    onChange(newOrder);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Selected Yachts List */}
      {selectedYachts.length > 0 && (
        <div className="space-y-2">
          {selectedYachts.map((yacht, index) => {
            const heroImage = parseHeroImage(yacht.heroImage);
            return (
              <div
                key={yacht.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200',
                  draggedIndex === index && 'opacity-50'
                )}
              >
                <GripVertical className="h-4 w-4 text-slate-400 cursor-grab flex-shrink-0" />

                <div className="relative w-16 h-12 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                  {heroImage?.url ? (
                    <Image
                      src={heroImage.url}
                      alt={yacht.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ship className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{yacht.name}</p>
                  <p className="text-xs text-slate-500">
                    {typeLabels[yacht.type] || yacht.type}
                    {yacht.length && ` • ${yacht.length}m`}
                    {yacht.guests && ` • ${yacht.guests} guests`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeYacht(yacht.id)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Yachts Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {selectedYachts.length === 0 ? 'Add Recommended Yachts' : 'Add More Yachts'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Yachts</DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search yachts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Yachts Grid */}
          <div className="flex-1 overflow-y-auto mt-4">
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">Loading yachts...</div>
            ) : filteredYachts.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                {searchTerm ? 'No yachts match your search' : 'No yachts available'}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredYachts.map((yacht) => {
                  const isSelected = value.includes(yacht.id);
                  const heroImage = parseHeroImage(yacht.heroImage);
                  return (
                    <button
                      key={yacht.id}
                      type="button"
                      onClick={() => toggleYacht(yacht)}
                      className={cn(
                        'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-colors',
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      {/* Checkbox */}
                      <div
                        className={cn(
                          'absolute top-2 right-2 w-5 h-5 rounded border flex items-center justify-center',
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-slate-300 bg-white'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>

                      <div className="relative w-16 h-12 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                        {heroImage?.url ? (
                          <Image
                            src={heroImage.url}
                            alt={yacht.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Ship className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <p className="font-medium text-slate-900 truncate">{yacht.name}</p>
                        <p className="text-xs text-slate-500">
                          {typeLabels[yacht.type] || yacht.type}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-slate-500">
              {value.length} yacht{value.length !== 1 ? 's' : ''} selected
            </p>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedYachts.length === 0 && (
        <p className="text-sm text-slate-500">
          No yachts selected. Add yachts that are recommended for this destination.
        </p>
      )}
    </div>
  );
}
