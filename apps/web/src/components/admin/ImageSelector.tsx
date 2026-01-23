'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: string;
  placeholder?: string;
  className?: string;
}

interface MediaImage {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function ImageSelector({
  value,
  onChange,
  aspectRatio,
  placeholder = 'Select an image',
  className = '',
}: ImageSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const openModal = () => {
    setShowModal(true);
    fetchImages();
  };

  const handleSelect = (image: MediaImage) => {
    onChange(image.url);
    setShowModal(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        setShowModal(false);
      } else {
        const error = await res.json();
        alert(error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      onChange(url);
    }
  };

  const filteredImages = searchQuery
    ? images.filter(
        (img) =>
          img.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.alt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : images;

  // Get aspect ratio styles
  const getAspectRatioStyle = () => {
    if (!aspectRatio) return { paddingBottom: '56.25%' }; // Default 16:9
    const [w, h] = aspectRatio.split(':').map(Number);
    return { paddingBottom: `${(h / w) * 100}%` };
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {value ? (
          <div className="relative group">
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-200" style={getAspectRatioStyle()}>
              <Image
                src={value}
                alt="Selected image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
              <button
                type="button"
                onClick={openModal}
                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
          >
            <svg
              className="w-8 h-8 mx-auto text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-500">{placeholder}</span>
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Select Image</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
              <label className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 cursor-pointer transition-colors">
                {uploading ? 'Uploading...' : 'Upload New'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleUrlInput}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Enter URL
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search images..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>{searchQuery ? 'No images found' : 'No images in library'}</p>
                  <p className="text-sm">Upload an image to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => handleSelect(image)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-amber-500 ${
                        value === image.url ? 'border-amber-500 ring-2 ring-amber-200' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || image.originalName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {value === image.url && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
