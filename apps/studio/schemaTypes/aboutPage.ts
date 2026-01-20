import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "story", title: "Our Story" },
    { name: "stats", title: "Statistics" },
    { name: "values", title: "Values" },
    { name: "process", title: "Process Steps" },
    { name: "team", title: "Team Section" },
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
      initialValue: "About Mediterana",
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

    // Story Section
    defineField({
      name: "storyTitle",
      title: "Story Section Title",
      type: "string",
      group: "story",
      initialValue: "Our Story",
    }),
    defineField({
      name: "storyContent",
      title: "Story Content",
      type: "blockContent",
      group: "story",
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "externalImage",
      group: "story",
    }),
    defineField({
      name: "storyCtaText",
      title: "Story CTA Button Text",
      type: "string",
      group: "story",
      initialValue: "Start Your Journey",
    }),
    defineField({
      name: "storyCtaLink",
      title: "Story CTA Button Link",
      type: "string",
      group: "story",
      initialValue: "/contact",
    }),

    // Stats Section
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: "e.g., '15+', '500+', '1,200+'",
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g., 'Years Experience'",
            }),
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "label",
            },
          },
        }),
      ],
    }),

    // Values Section
    defineField({
      name: "valuesTitle",
      title: "Values Section Title",
      type: "string",
      group: "values",
      initialValue: "What We Stand For",
    }),
    defineField({
      name: "valuesSubtitle",
      title: "Values Section Subtitle",
      type: "text",
      rows: 2,
      group: "values",
    }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "values",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Icon name: anchor, users, award, globe, shield, ship, compass, heart",
              options: {
                list: [
                  { title: "Anchor", value: "anchor" },
                  { title: "Users", value: "users" },
                  { title: "Award", value: "award" },
                  { title: "Globe", value: "globe" },
                  { title: "Shield", value: "shield" },
                  { title: "Ship", value: "ship" },
                  { title: "Compass", value: "compass" },
                  { title: "Heart", value: "heart" },
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

    // Process Section
    defineField({
      name: "processTitle",
      title: "Process Section Title",
      type: "string",
      group: "process",
      initialValue: "How We Work",
    }),
    defineField({
      name: "processSubtitle",
      title: "Process Section Subtitle",
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
              name: "title",
              title: "Step Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Step Description",
              type: "text",
              rows: 3,
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

    // Team Section
    defineField({
      name: "teamTitle",
      title: "Team Section Title",
      type: "string",
      group: "team",
      initialValue: "Meet the Team",
    }),
    defineField({
      name: "teamSubtitle",
      title: "Team Section Subtitle",
      type: "text",
      rows: 2,
      group: "team",
    }),
    defineField({
      name: "teamMembers",
      title: "Featured Team Members",
      type: "array",
      group: "team",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "teamMember" }],
        }),
      ],
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
        title: "About Page",
        subtitle: "Edit about page content",
      };
    },
  },
});
