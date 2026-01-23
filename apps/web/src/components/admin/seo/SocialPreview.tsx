'use client';

import Image from 'next/image';

interface SocialPreviewProps {
  platform: 'facebook' | 'twitter' | 'linkedin';
  title: string;
  description: string;
  image?: string;
  url: string;
  siteName?: string;
}

export function SocialPreview({
  platform,
  title,
  description,
  image,
  url,
  siteName,
}: SocialPreviewProps) {
  // Parse domain from URL
  let domain = url;
  try {
    domain = new URL(url).hostname;
  } catch {
    // Keep original
  }

  // Truncate based on platform limits
  const truncateTitle = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit - 3) + '...' : text;

  const truncateDescription = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit - 3) + '...' : text;

  if (platform === 'facebook') {
    return (
      <div className="bg-white">
        <p className="text-xs text-gray-500 mb-3">Facebook Preview</p>

        <div className="max-w-[500px] border border-gray-200 rounded-lg overflow-hidden bg-[#f0f2f5]">
          {/* Image */}
          <div className="relative w-full aspect-[1.91/1] bg-gray-100">
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 bg-[#f0f2f5]">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{domain}</p>
            <h4 className="font-semibold text-base text-gray-900 leading-tight mb-1">
              {truncateTitle(title, 60) || 'Page Title'}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-2">
              {truncateDescription(description, 150) || 'Add a description...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'twitter') {
    return (
      <div className="bg-white">
        <p className="text-xs text-gray-500 mb-3">Twitter/X Preview</p>

        <div className="max-w-[500px] border border-gray-200 rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="relative w-full aspect-[2/1] bg-gray-100">
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 border-t border-gray-200">
            <h4 className="font-normal text-[15px] text-gray-900 leading-tight mb-0.5">
              {truncateTitle(title, 70) || 'Page Title'}
            </h4>
            <p className="text-sm text-gray-500 line-clamp-2">
              {truncateDescription(description, 125) || 'Add a description...'}
            </p>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {domain}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="bg-white">
        <p className="text-xs text-gray-500 mb-3">LinkedIn Preview</p>

        <div className="max-w-[500px] border border-gray-300 rounded-lg overflow-hidden bg-white">
          {/* Image */}
          <div className="relative w-full aspect-[1.91/1] bg-gray-100">
            {image ? (
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <h4 className="font-semibold text-sm text-gray-900 leading-tight mb-1">
              {truncateTitle(title, 100) || 'Page Title'}
            </h4>
            <p className="text-xs text-gray-500">
              {domain}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
