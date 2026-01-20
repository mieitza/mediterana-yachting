"use client";

import { PortableText as SanityPortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import type { ExternalImage } from "@/lib/sanity/types";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-serif font-medium mt-12 mb-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-serif font-medium mt-10 mb-5 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-serif font-medium mt-8 mb-4 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-serif font-medium mt-6 mb-3 first:mt-0">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-text-secondary leading-relaxed last:mb-0">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pl-6 border-l-2 border-navy italic my-6 text-text-secondary">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-2 text-text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-2 text-text-secondary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy hover:text-navy/80 underline underline-offset-4"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-navy hover:text-navy/80 underline underline-offset-4"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }: { value: ExternalImage & { _type: string } }) => {
      if (!value?.url) return null;

      return (
        <figure className="my-8">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={value.url}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-text-muted">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextProps {
  value: any[];
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className={className}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}
