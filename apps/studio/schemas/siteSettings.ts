import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "externalImage",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
        { name: "whatsapp", title: "WhatsApp Number", type: "string" },
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "featuredYachts",
      title: "Featured Yachts",
      description: "Select yachts to feature on the homepage",
      type: "array",
      of: [{ type: "reference", to: [{ type: "yacht" }] }],
      validation: (Rule) => Rule.max(6),
    }),
  ],
  preview: {
    select: {
      title: "siteName",
    },
  },
});
