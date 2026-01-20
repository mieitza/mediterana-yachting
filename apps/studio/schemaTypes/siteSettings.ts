import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "footer", title: "Footer" },
    { name: "social", title: "Social & Contact" },
  ],
  fields: [
    // General
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "general",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 3,
      group: "general",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "externalImage",
      group: "general",
    }),
    defineField({
      name: "featuredYachts",
      title: "Featured Yachts",
      description: "Select yachts to feature on the homepage",
      type: "array",
      of: [{ type: "reference", to: [{ type: "yacht" }] }],
      validation: (Rule) => Rule.max(6),
      group: "general",
    }),

    // Footer
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      description: "Short description shown in footer",
      type: "text",
      rows: 3,
      group: "footer",
    }),
    defineField({
      name: "footerCharterLinks",
      title: "Charter Links",
      description: "Navigation links under 'Charter' section",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
            { name: "href", title: "URL", type: "string", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      group: "footer",
    }),
    defineField({
      name: "footerCompanyLinks",
      title: "Company Links",
      description: "Navigation links under 'Company' section",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
            { name: "href", title: "URL", type: "string", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      group: "footer",
    }),
    defineField({
      name: "footerLegalLinks",
      title: "Legal Links",
      description: "Links shown at the bottom (Privacy, Terms, etc.)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
            { name: "href", title: "URL", type: "string", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      group: "footer",
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      description: "e.g., 'Mediterana Yachting' (year is added automatically)",
      type: "string",
      group: "footer",
    }),

    // Social & Contact
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.email(),
      group: "social",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      group: "social",
    }),
    defineField({
      name: "contactAddress",
      title: "Address",
      type: "string",
      group: "social",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
        { name: "twitter", title: "Twitter/X URL", type: "url" },
        { name: "youtube", title: "YouTube URL", type: "url" },
        { name: "whatsapp", title: "WhatsApp Number", type: "string" },
      ],
      group: "social",
    }),
  ],
  preview: {
    select: {
      title: "siteName",
    },
  },
});
