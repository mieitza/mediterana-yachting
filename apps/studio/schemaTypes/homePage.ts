import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "yachts", title: "Featured Yachts" },
    { name: "destinations", title: "Destinations" },
    { name: "why", title: "Why Mediterana" },
    { name: "process", title: "Charter Process" },
    { name: "blog", title: "Blog Section" },
    { name: "cta", title: "Call to Action" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      group: "hero",
      description: "Main headline",
    }),
    defineField({
      name: "heroTitleHighlight",
      title: "Hero Title Highlight",
      type: "string",
      group: "hero",
      description: "Highlighted part (shown in gold/sand color)",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "externalImage",
      group: "hero",
    }),
    defineField({
      name: "heroPrimaryCtaText",
      title: "Primary CTA Button Text",
      type: "string",
      group: "hero",
      initialValue: "Enquire Now",
    }),
    defineField({
      name: "heroPrimaryCtaLink",
      title: "Primary CTA Link",
      type: "string",
      group: "hero",
      initialValue: "/contact",
    }),
    defineField({
      name: "heroSecondaryCtaText",
      title: "Secondary CTA Button Text",
      type: "string",
      group: "hero",
      initialValue: "View Yachts",
    }),
    defineField({
      name: "heroSecondaryCtaLink",
      title: "Secondary CTA Link",
      type: "string",
      group: "hero",
      initialValue: "/yachts",
    }),

    // Featured Yachts Section
    defineField({
      name: "yachtsTitle",
      title: "Section Title",
      type: "string",
      group: "yachts",
      initialValue: "Featured Yachts",
    }),
    defineField({
      name: "yachtsSubtitle",
      title: "Section Subtitle",
      type: "text",
      rows: 2,
      group: "yachts",
    }),
    defineField({
      name: "yachtsCtaText",
      title: "CTA Button Text",
      type: "string",
      group: "yachts",
      initialValue: "View All Yachts",
    }),

    // Destinations Section
    defineField({
      name: "destinationsTitle",
      title: "Section Title",
      type: "string",
      group: "destinations",
      initialValue: "Destinations",
    }),
    defineField({
      name: "destinationsSubtitle",
      title: "Section Subtitle",
      type: "text",
      rows: 2,
      group: "destinations",
    }),
    defineField({
      name: "destinationsCtaText",
      title: "CTA Button Text",
      type: "string",
      group: "destinations",
      initialValue: "Explore All Destinations",
    }),

    // Why Mediterana Section
    defineField({
      name: "whyTitle",
      title: "Section Title",
      type: "string",
      group: "why",
      initialValue: "Why Mediterana",
    }),
    defineField({
      name: "whySubtitle",
      title: "Section Subtitle",
      type: "text",
      rows: 2,
      group: "why",
    }),
    defineField({
      name: "whyFeatures",
      title: "Features",
      type: "array",
      group: "why",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Shield", value: "shield" },
                  { title: "Users", value: "users" },
                  { title: "Ship", value: "ship" },
                  { title: "Phone", value: "phone" },
                  { title: "Compass", value: "compass" },
                  { title: "Award", value: "award" },
                  { title: "Heart", value: "heart" },
                  { title: "Star", value: "star" },
                ],
              },
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
    }),

    // Charter Process Section
    defineField({
      name: "processTitle",
      title: "Section Title",
      type: "string",
      group: "process",
      initialValue: "The Charter Process",
    }),
    defineField({
      name: "processSubtitle",
      title: "Section Subtitle",
      type: "text",
      rows: 2,
      group: "process",
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      group: "process",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Compass", value: "compass" },
                  { title: "Ship", value: "ship" },
                  { title: "Calendar", value: "calendar" },
                  { title: "Check", value: "check" },
                  { title: "Anchor", value: "anchor" },
                ],
              },
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
    }),

    // Blog Section
    defineField({
      name: "blogTitle",
      title: "Section Title",
      type: "string",
      group: "blog",
      initialValue: "From the Journal",
    }),
    defineField({
      name: "blogSubtitle",
      title: "Section Subtitle",
      type: "text",
      rows: 2,
      group: "blog",
    }),
    defineField({
      name: "blogCtaText",
      title: "CTA Button Text",
      type: "string",
      group: "blog",
      initialValue: "Read More Articles",
    }),

    // CTA Section
    defineField({
      name: "ctaTitle",
      title: "CTA Title",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaSubtitle",
      title: "CTA Subtitle",
      type: "text",
      rows: 2,
      group: "cta",
    }),
    defineField({
      name: "ctaImage",
      title: "CTA Background Image",
      type: "externalImage",
      group: "cta",
    }),
    defineField({
      name: "ctaPrimaryText",
      title: "Primary Button Text",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaPrimaryLink",
      title: "Primary Button Link",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaSecondaryText",
      title: "Secondary Button Text",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "ctaSecondaryLink",
      title: "Secondary Button Link",
      type: "string",
      group: "cta",
    }),

    // SEO
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
        subtitle: "Edit home page content",
      };
    },
  },
});
