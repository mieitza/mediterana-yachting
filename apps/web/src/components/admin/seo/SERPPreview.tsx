'use client';

interface SERPPreviewProps {
  title: string;
  description: string;
  url: string;
  favicon?: string;
}

export function SERPPreview({
  title,
  description,
  url,
  favicon,
}: SERPPreviewProps) {
  // Truncate title and description to match Google's limits
  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const truncatedDescription = description.length > 160 ? description.slice(0, 157) + '...' : description;

  // Parse URL for display
  let displayUrl = url;
  try {
    const parsed = new URL(url);
    displayUrl = parsed.hostname + parsed.pathname;
    if (displayUrl.endsWith('/')) {
      displayUrl = displayUrl.slice(0, -1);
    }
  } catch {
    // Keep original if parsing fails
  }

  // Generate breadcrumb-style URL
  const urlParts = displayUrl.split('/').filter(Boolean);
  const breadcrumbUrl = urlParts.length > 0
    ? urlParts[0] + (urlParts.length > 1 ? ' › ' + urlParts.slice(1).join(' › ') : '')
    : displayUrl;

  return (
    <div className="bg-white">
      <p className="text-xs text-gray-500 mb-3">Google Search Preview</p>

      {/* Google-style search result */}
      <div className="max-w-[600px] font-sans">
        {/* URL and favicon row */}
        <div className="flex items-center gap-2 mb-1">
          {favicon ? (
            <img src={favicon} alt="" className="w-7 h-7 rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 9.172a4 4 0 115.656 5.656L10 14l-.828.828a4 4 0 11-5.656-5.656l.828-.828-.828-.828a4 4 0 010-5.656l.828-.828.828.828a4 4 0 015.656 0l.828.828-.828.828a4 4 0 010 5.656L10 10l.828-.828a4 4 0 000-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">{urlParts[0] || 'mediterana-yachting.com'}</span>
            <span className="text-xs text-gray-500">{breadcrumbUrl}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
          {truncatedTitle || 'Page Title'}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {truncatedDescription || 'Add a meta description to see how it will appear in search results.'}
        </p>
      </div>

      {/* Character warnings */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-6 text-xs">
          <div className={`flex items-center gap-1 ${title.length > 60 ? 'text-red-500' : title.length > 50 ? 'text-amber-500' : 'text-green-500'}`}>
            <span className={`w-2 h-2 rounded-full ${title.length > 60 ? 'bg-red-500' : title.length > 50 ? 'bg-amber-500' : 'bg-green-500'}`} />
            Title: {title.length}/60 chars
          </div>
          <div className={`flex items-center gap-1 ${description.length > 160 ? 'text-red-500' : description.length > 140 ? 'text-amber-500' : 'text-green-500'}`}>
            <span className={`w-2 h-2 rounded-full ${description.length > 160 ? 'bg-red-500' : description.length > 140 ? 'bg-amber-500' : 'bg-green-500'}`} />
            Description: {description.length}/160 chars
          </div>
        </div>
      </div>
    </div>
  );
}
