'use client';

import { useState } from 'react';
import { SERPPreview } from './SERPPreview';
import { SocialPreview } from './SocialPreview';
import { ImageSelector } from '../ImageSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SEOSectionProps {
  title: string;
  description: string;
  image?: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onImageChange?: (value: string) => void;
  pageUrl?: string;
  siteName?: string;
  showImage?: boolean;
  showPreviews?: boolean;
}

type PreviewTab = 'serp' | 'facebook' | 'twitter';

export function SEOSection({
  title,
  description,
  image = '',
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  pageUrl = 'https://mediterana-yachting.com',
  siteName = 'Mediterana Yachting',
  showImage = true,
  showPreviews = true,
}: SEOSectionProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('serp');
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);

  const titleLimit = 60;
  const descriptionLimit = 160;
  const titleLength = title?.length || 0;
  const descriptionLength = description?.length || 0;

  const effectiveTitle = title || 'Page Title';
  const effectiveDescription = description || 'Add a meta description to improve your search visibility...';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">SEO Settings</h3>
        {showPreviews && (
          <button
            type="button"
            onClick={() => setShowPreviewPanel(!showPreviewPanel)}
            className="text-sm text-amber-600 hover:text-amber-700"
          >
            {showPreviewPanel ? 'Hide Previews' : 'Show Previews'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Meta Title */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <span
              className={`text-xs ${
                titleLength > titleLimit
                  ? 'text-red-500'
                  : titleLength > titleLimit * 0.9
                  ? 'text-amber-500'
                  : 'text-gray-500'
              }`}
            >
              {titleLength}/{titleLimit}
            </span>
          </div>
          <Input
            id="seoTitle"
            value={title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter page title for search engines"
            maxLength={titleLimit + 10}
          />
          {titleLength > titleLimit && (
            <p className="text-xs text-red-500">Title may be truncated in search results</p>
          )}
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="seoDescription">Meta Description</Label>
            <span
              className={`text-xs ${
                descriptionLength > descriptionLimit
                  ? 'text-red-500'
                  : descriptionLength > descriptionLimit * 0.9
                  ? 'text-amber-500'
                  : 'text-gray-500'
              }`}
            >
              {descriptionLength}/{descriptionLimit}
            </span>
          </div>
          <textarea
            id="seoDescription"
            value={description || ''}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter a compelling description for search results"
            rows={3}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            maxLength={descriptionLimit + 20}
          />
          {descriptionLength > descriptionLimit && (
            <p className="text-xs text-red-500">Description may be truncated in search results</p>
          )}
        </div>

        {/* SEO Image */}
        {showImage && onImageChange && (
          <div className="space-y-2">
            <Label>Share Image</Label>
            <ImageSelector
              value={image}
              onChange={onImageChange}
              aspectRatio="1.91:1"
              placeholder="Select image for social sharing (1200x630)"
            />
            <p className="text-xs text-gray-500">
              Used when this page is shared on social media
            </p>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {showPreviews && showPreviewPanel && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {/* Preview Tabs */}
          <div className="flex gap-2 mb-4">
            {(['serp', 'facebook', 'twitter'] as PreviewTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'serp' ? 'Google' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Preview Content */}
          <div className="min-h-[180px]">
            {activeTab === 'serp' && (
              <SERPPreview
                title={effectiveTitle}
                description={effectiveDescription}
                url={pageUrl}
              />
            )}
            {activeTab === 'facebook' && (
              <SocialPreview
                platform="facebook"
                title={effectiveTitle}
                description={effectiveDescription}
                image={image}
                url={pageUrl}
                siteName={siteName}
              />
            )}
            {activeTab === 'twitter' && (
              <SocialPreview
                platform="twitter"
                title={effectiveTitle}
                description={effectiveDescription}
                image={image}
                url={pageUrl}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
