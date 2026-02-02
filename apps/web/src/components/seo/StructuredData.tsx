import Script from 'next/script';

const SITE_URL = 'https://mediteranayachting.com';
const SITE_NAME = 'Mediterana Yachting';

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Luxury yacht charter company specializing in Mediterranean sailing and motor yacht charters across Greece, Croatia, French Riviera, and Amalfi Coast.',
    sameAs: [
      'https://www.instagram.com/mediteranayachting',
      'https://www.facebook.com/mediteranayachting',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33-6-XX-XX-XX-XX',
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Italian'],
    },
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// LocalBusiness Schema
export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    image: `${SITE_URL}/og-image.jpg`,
    url: SITE_URL,
    description: 'Premium yacht charter services in the Mediterranean. Luxury sailing and motor yacht rentals with professional crew.',
    priceRange: '€€€€',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'France',
      addressRegion: 'Provence-Alpes-Côte d\'Azur',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.7102,
      longitude: 7.2620,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: [
      { '@type': 'Place', name: 'Mediterranean Sea' },
      { '@type': 'Country', name: 'Greece' },
      { '@type': 'Country', name: 'Croatia' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Italy' },
    ],
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service Schema for Yacht Charter
export function YachtCharterServiceSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Yacht Charter',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    name: 'Mediterranean Yacht Charter Services',
    description: 'Luxury yacht charter services including motor yachts, sailing yachts, and catamarans for private Mediterranean cruises.',
    areaServed: {
      '@type': 'Place',
      name: 'Mediterranean Sea',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Yacht Charter Options',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Motor Yacht Charter',
            description: 'Luxury motor yacht rentals with professional crew',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sailing Yacht Charter',
            description: 'Premium sailing yacht charters for Mediterranean adventures',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Catamaran Charter',
            description: 'Spacious catamaran rentals for family and group cruises',
          },
        },
      ],
    },
  };

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product Schema for individual yachts
interface YachtSchemaProps {
  name: string;
  description: string;
  image: string;
  url: string;
  priceFrom?: number;
  currency?: string;
}

export function YachtSchema({ name, description, image, url, priceFrom, currency = 'EUR' }: YachtSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: image,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    brand: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    offers: priceFrom ? {
      '@type': 'Offer',
      priceCurrency: currency,
      price: priceFrom,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    } : undefined,
  };

  return (
    <Script
      id={`yacht-schema-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Destination/Place Schema
interface DestinationSchemaProps {
  name: string;
  description: string;
  image: string;
  url: string;
}

export function DestinationSchema({ name, description, image, url }: DestinationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: name,
    description: description,
    image: image,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    touristType: ['Luxury traveler', 'Yacht enthusiast', 'Sailing enthusiast'],
  };

  return (
    <Script
      id={`destination-schema-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebPage Schema
interface WebPageSchemaProps {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
}

export function WebPageSchema({ title, description, url, dateModified }: WebPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(dateModified && { dateModified }),
  };

  return (
    <Script
      id="webpage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website Schema with SearchAction
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Luxury Mediterranean yacht charter company offering sailing and motor yacht rentals in Greece, Croatia, French Riviera, and Italy.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/yachts?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
