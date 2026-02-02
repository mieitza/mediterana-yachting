'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { FAQSchema } from './StructuredData';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle,
  items,
  className
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cn('section-padding bg-bg-surface', className)}>
      <FAQSchema items={items} />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2>{title}</h2>
          {subtitle && (
            <p className="mt-4 text-lg max-w-2xl mx-auto text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-text-primary">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 text-slate-400 transition-transform flex-shrink-0',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <div className="px-6 pb-4 text-text-secondary">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pre-defined FAQ sets for different pages
export const homepageFAQs: FAQItem[] = [
  {
    question: 'What is included in a Mediterranean yacht charter?',
    answer: 'Our yacht charters typically include the yacht, professional crew (captain, chef, stewardess), fuel for cruising, water toys, and standard insurance. Food, beverages, marina fees, and special requests are usually additional. We provide fully customized packages based on your preferences.',
  },
  {
    question: 'How much does it cost to charter a yacht in the Mediterranean?',
    answer: 'Yacht charter prices vary based on yacht size, type, season, and duration. Weekly rates for luxury yachts in the Mediterranean typically range from €30,000 to €500,000+. We offer options for various budgets and can help you find the perfect yacht within your price range.',
  },
  {
    question: 'When is the best time to charter a yacht in the Mediterranean?',
    answer: 'The peak season runs from June to September with warm weather and calm seas. May and October offer pleasant conditions with fewer crowds and lower prices. Each destination has its ideal timing - Greece is best June-September, Croatia May-October, and the French Riviera peaks in July-August.',
  },
  {
    question: 'Do I need sailing experience to charter a yacht?',
    answer: 'No sailing experience is required for crewed charters. Our professional captains and crew handle all navigation and yacht operations. You simply relax and enjoy the journey. For bareboat charters, sailing certifications are required.',
  },
  {
    question: 'How far in advance should I book a yacht charter?',
    answer: 'For peak season (July-August), we recommend booking 6-12 months in advance to secure your preferred yacht. Shoulder seasons offer more flexibility with 2-3 months notice often sufficient. Last-minute bookings are sometimes available at special rates.',
  },
  {
    question: 'Can you customize the itinerary for our charter?',
    answer: 'Absolutely! Every charter is tailored to your preferences. Whether you want to explore hidden coves, visit famous ports, enjoy water sports, or focus on gastronomy and wine regions, we design bespoke itineraries that match your vision of the perfect Mediterranean vacation.',
  },
];

export const destinationFAQs: FAQItem[] = [
  {
    question: 'What destinations can I visit on a Mediterranean yacht charter?',
    answer: 'The Mediterranean offers incredible diversity. Popular destinations include the Greek Islands (Cyclades, Ionian, Dodecanese), Croatian Coast (Dalmatian Islands), French Riviera (Côte d\'Azur), Italian Coast (Amalfi, Sardinia, Sicily), Spanish Balearics, and Turkish Riviera.',
  },
  {
    question: 'Can I visit multiple countries on one charter?',
    answer: 'Yes! Many itineraries combine destinations across countries. Popular multi-country routes include Greece to Turkey, France to Italy (Riviera to Sardinia), and Croatia to Montenegro. We handle all necessary permits and logistics for cross-border cruising.',
  },
  {
    question: 'What is the most popular yacht charter destination?',
    answer: 'Greece and Croatia are the most popular Mediterranean yacht charter destinations, offering thousands of islands, clear waters, and rich culture. The French Riviera attracts those seeking glamour and nightlife, while the Amalfi Coast appeals to food and culture enthusiasts.',
  },
];

export const yachtsFAQs: FAQItem[] = [
  {
    question: 'What types of yachts are available for charter?',
    answer: 'We offer motor yachts (luxury, speed, and comfort), sailing yachts (classic sailing experience), power catamarans (stability and space), and sailing catamarans (ideal for families). Each type offers unique advantages depending on your preferences and group size.',
  },
  {
    question: 'How do I choose the right yacht for my charter?',
    answer: 'Consider your group size, desired comfort level, activities you want to enjoy, and budget. Motor yachts offer speed and luxury amenities. Sailing yachts provide an authentic maritime experience. Catamarans offer stability and space. Our charter specialists help match you with the perfect vessel.',
  },
  {
    question: 'What amenities are available on charter yachts?',
    answer: 'Modern charter yachts feature air-conditioned cabins, en-suite bathrooms, gourmet galleys, entertainment systems, WiFi, and water toys (jet skis, paddleboards, snorkeling gear). Larger yachts may include jacuzzis, gyms, cinemas, and beach clubs.',
  },
];
