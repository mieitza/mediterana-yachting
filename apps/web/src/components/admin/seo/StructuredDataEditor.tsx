'use client';

import { useState, useEffect } from 'react';

interface StructuredDataEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TEMPLATES = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '',
    description: '',
    image: '',
    author: {
      '@type': 'Person',
      name: '',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mediterana Yachting',
      logo: {
        '@type': 'ImageObject',
        url: '',
      },
    },
    datePublished: '',
    dateModified: '',
  },
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mediterana Yachting',
    url: 'https://mediterana-yachting.com',
    logo: '',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '',
      contactType: 'customer service',
    },
  },
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Mediterana Yachting',
    url: 'https://mediterana-yachting.com',
    logo: '',
    image: '',
    description: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: '',
      addressCountry: '',
    },
    telephone: '',
    email: '',
    priceRange: '$$$',
  },
  product: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '',
    description: '',
    image: '',
    offers: {
      '@type': 'Offer',
      price: '',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  },
  faqPage: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '',
        },
      },
    ],
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://mediterana-yachting.com',
      },
    ],
  },
};

export function StructuredDataEditor({
  value,
  onChange,
}: StructuredDataEditorProps) {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    if (!newValue.trim()) {
      setJsonError(null);
      onChange('');
      return;
    }

    try {
      JSON.parse(newValue);
      setJsonError(null);
      onChange(newValue);
    } catch (err) {
      setJsonError((err as Error).message);
    }
  };

  const insertTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey];
    const formatted = JSON.stringify(template, null, 2);
    handleChange(formatted);
  };

  const formatJson = () => {
    if (!localValue.trim()) return;

    try {
      const parsed = JSON.parse(localValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalValue(formatted);
      onChange(formatted);
      setJsonError(null);
    } catch (err) {
      setJsonError((err as Error).message);
    }
  };

  const validateWithGoogle = () => {
    const encoded = encodeURIComponent(localValue);
    window.open(`https://search.google.com/test/rich-results?code=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-3">
      {/* Templates */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 mr-2">Templates:</span>
        {Object.keys(TEMPLATES).map((key) => (
          <button
            key={key}
            onClick={() => insertTemplate(key as keyof typeof TEMPLATES)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  ...\n}'
          rows={12}
          className={`w-full px-3 py-2 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y ${
            jsonError ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          spellCheck={false}
        />

        {/* Error message */}
        {jsonError && (
          <div className="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-200 rounded px-2 py-1">
            <p className="text-xs text-red-600 truncate">
              JSON Error: {jsonError}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={formatJson}
          disabled={!localValue.trim()}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Format JSON
        </button>
        <button
          onClick={validateWithGoogle}
          disabled={!localValue.trim() || !!jsonError}
          className="px-3 py-1.5 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Test with Google
        </button>
        <button
          onClick={() => handleChange('')}
          disabled={!localValue.trim()}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500">
        Add JSON-LD structured data for rich search results. Use templates above or write custom schema.
        <a
          href="https://schema.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-700 ml-1"
        >
          Learn more at Schema.org →
        </a>
      </p>
    </div>
  );
}
