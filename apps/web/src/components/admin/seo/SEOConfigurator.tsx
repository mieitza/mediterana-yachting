'use client';

import { useState, useEffect } from 'react';
import { SERPPreview } from './SERPPreview';
import { SocialPreview } from './SocialPreview';
import { StructuredDataEditor } from './StructuredDataEditor';
import { ImageSelector } from '../ImageSelector';

export interface SEOData {
  // Basic SEO
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  seoCanonical?: string;
  seoNoIndex?: boolean;
  seoNoFollow?: boolean;
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  // Twitter Card
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  // Structured Data
  structuredData?: string;
}

interface SEOConfiguratorProps {
  data: SEOData;
  onChange: (data: SEOData) => void;
  pageUrl?: string;
  siteName?: string;
  showAdvanced?: boolean;
}

type PreviewTab = 'serp' | 'facebook' | 'twitter' | 'linkedin';

export function SEOConfigurator({
  data,
  onChange,
  pageUrl = 'https://mediterana-yachting.com',
  siteName = 'Mediterana Yachting',
  showAdvanced = true,
}: SEOConfiguratorProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('serp');
  const [showStructuredData, setShowStructuredData] = useState(false);

  const updateField = <K extends keyof SEOData>(field: K, value: SEOData[K]) => {
    onChange({ ...data, [field]: value });
  };

  // Character limits
  const titleLimit = 60;
  const descriptionLimit = 160;

  const titleLength = data.seoTitle?.length || 0;
  const descriptionLength = data.seoDescription?.length || 0;

  // Effective values for previews (with fallbacks)
  const effectiveTitle = data.seoTitle || 'Page Title';
  const effectiveDescription = data.seoDescription || 'Add a meta description to improve your search visibility...';
  const effectiveImage = data.seoImage || data.ogImage || '';

  // OG values with fallbacks
  const effectiveOgTitle = data.ogTitle || data.seoTitle || effectiveTitle;
  const effectiveOgDescription = data.ogDescription || data.seoDescription || effectiveDescription;
  const effectiveOgImage = data.ogImage || data.seoImage || '';

  // Twitter values with fallbacks
  const effectiveTwitterTitle = data.twitterTitle || data.ogTitle || data.seoTitle || effectiveTitle;
  const effectiveTwitterDescription = data.twitterDescription || data.ogDescription || data.seoDescription || effectiveDescription;
  const effectiveTwitterImage = data.twitterImage || data.ogImage || data.seoImage || '';

  return (
    <div className="space-y-6">
      {/* Basic SEO Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Engine Optimization</h3>

        {/* Meta Title */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Meta Title
            </label>
            <span className={`text-sm ${titleLength > titleLimit ? 'text-red-500' : titleLength > titleLimit * 0.9 ? 'text-amber-500' : 'text-gray-500'}`}>
              {titleLength}/{titleLimit}
            </span>
          </div>
          <input
            type="text"
            value={data.seoTitle || ''}
            onChange={(e) => updateField('seoTitle', e.target.value)}
            placeholder="Enter page title for search engines"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            maxLength={titleLimit + 10}
          />
          {titleLength > titleLimit && (
            <p className="mt-1 text-sm text-red-500">Title may be truncated in search results</p>
          )}
        </div>

        {/* Meta Description */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Meta Description
            </label>
            <span className={`text-sm ${descriptionLength > descriptionLimit ? 'text-red-500' : descriptionLength > descriptionLimit * 0.9 ? 'text-amber-500' : 'text-gray-500'}`}>
              {descriptionLength}/{descriptionLimit}
            </span>
          </div>
          <textarea
            value={data.seoDescription || ''}
            onChange={(e) => updateField('seoDescription', e.target.value)}
            placeholder="Enter a compelling description for search results"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
            maxLength={descriptionLimit + 20}
          />
          {descriptionLength > descriptionLimit && (
            <p className="mt-1 text-sm text-red-500">Description may be truncated in search results</p>
          )}
        </div>

        {/* SEO Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Share Image
          </label>
          <ImageSelector
            value={data.seoImage || ''}
            onChange={(url) => updateField('seoImage', url)}
            aspectRatio="1.91:1"
            placeholder="Select or upload an image (1200x630 recommended)"
          />
          <p className="mt-1 text-sm text-gray-500">
            Used for social sharing if no specific OG/Twitter image is set
          </p>
        </div>

        {/* Canonical URL */}
        {showAdvanced && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canonical URL
            </label>
            <input
              type="url"
              value={data.seoCanonical || ''}
              onChange={(e) => updateField('seoCanonical', e.target.value)}
              placeholder="https://mediterana-yachting.com/page"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to use the page&apos;s own URL
            </p>
          </div>
        )}

        {/* Indexing Options */}
        {showAdvanced && (
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.seoNoIndex || false}
                onChange={(e) => updateField('seoNoIndex', e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">No Index</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.seoNoFollow || false}
                onChange={(e) => updateField('seoNoFollow', e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">No Follow</span>
            </label>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Previews</h3>

        {/* Preview Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          {(['serp', 'facebook', 'twitter', 'linkedin'] as PreviewTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'serp' ? 'Google' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Preview Content */}
        <div className="min-h-[200px]">
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
              title={effectiveOgTitle}
              description={effectiveOgDescription}
              image={effectiveOgImage}
              url={pageUrl}
              siteName={siteName}
            />
          )}
          {activeTab === 'twitter' && (
            <SocialPreview
              platform="twitter"
              title={effectiveTwitterTitle}
              description={effectiveTwitterDescription}
              image={effectiveTwitterImage}
              url={pageUrl}
            />
          )}
          {activeTab === 'linkedin' && (
            <SocialPreview
              platform="linkedin"
              title={effectiveOgTitle}
              description={effectiveOgDescription}
              image={effectiveOgImage}
              url={pageUrl}
            />
          )}
        </div>
      </div>

      {/* Social Media Overrides */}
      {showAdvanced && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Overrides</h3>
          <p className="text-sm text-gray-500 mb-4">
            Customize how this page appears when shared on social media. Leave empty to use the default meta title and description.
          </p>

          {/* Open Graph */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Open Graph (Facebook, LinkedIn)</h4>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  value={data.ogTitle || ''}
                  onChange={(e) => updateField('ogTitle', e.target.value)}
                  placeholder={data.seoTitle || 'Use meta title'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                <textarea
                  value={data.ogDescription || ''}
                  onChange={(e) => updateField('ogDescription', e.target.value)}
                  placeholder={data.seoDescription || 'Use meta description'}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
                <ImageSelector
                  value={data.ogImage || ''}
                  onChange={(url) => updateField('ogImage', url)}
                  aspectRatio="1.91:1"
                  placeholder={data.seoImage ? 'Using default share image' : 'Select image (1200x630)'}
                />
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Twitter Card</h4>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Title</label>
                <input
                  type="text"
                  value={data.twitterTitle || ''}
                  onChange={(e) => updateField('twitterTitle', e.target.value)}
                  placeholder={data.ogTitle || data.seoTitle || 'Use OG/meta title'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Description</label>
                <textarea
                  value={data.twitterDescription || ''}
                  onChange={(e) => updateField('twitterDescription', e.target.value)}
                  placeholder={data.ogDescription || data.seoDescription || 'Use OG/meta description'}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Image</label>
                <ImageSelector
                  value={data.twitterImage || ''}
                  onChange={(url) => updateField('twitterImage', url)}
                  aspectRatio="2:1"
                  placeholder={data.ogImage || data.seoImage ? 'Using OG/default image' : 'Select image (1200x600)'}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Structured Data */}
      {showAdvanced && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Structured Data (JSON-LD)</h3>
            <button
              onClick={() => setShowStructuredData(!showStructuredData)}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              {showStructuredData ? 'Hide Editor' : 'Show Editor'}
            </button>
          </div>

          {showStructuredData && (
            <StructuredDataEditor
              value={data.structuredData || ''}
              onChange={(value) => updateField('structuredData', value)}
            />
          )}

          {!showStructuredData && (
            <p className="text-sm text-gray-500">
              Add custom JSON-LD structured data for rich search results.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
