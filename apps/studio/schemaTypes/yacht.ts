import { defineType, defineField } from "sanity";

export default defineType({
  name: "yacht",
  title: "Yacht",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Motor Yacht", value: "motor" },
          { title: "Sailing Yacht", value: "sailing" },
          { title: "Catamaran", value: "catamaran" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "externalImage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "externalImage" }],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "YouTube or Vimeo embed URL",
      type: "url",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "Short description for cards (max 200 characters)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "object",
      fields: [
        { name: "length", title: "Length (m)", type: "number", validation: (Rule) => Rule.required().positive() },
        { name: "beam", title: "Beam (m)", type: "number", validation: (Rule) => Rule.positive() },
        { name: "draft", title: "Draft (m)", type: "number", validation: (Rule) => Rule.positive() },
        { name: "year", title: "Year Built", type: "number", validation: (Rule) => Rule.required().min(1900).max(2030) },
        { name: "guests", title: "Max Guests", type: "number", validation: (Rule) => Rule.required().positive() },
        { name: "cabins", title: "Cabins", type: "number", validation: (Rule) => Rule.required().positive() },
        { name: "crew", title: "Crew", type: "number", validation: (Rule) => Rule.positive() },
        { name: "cruisingSpeed", title: "Cruising Speed (knots)", type: "number", validation: (Rule) => Rule.positive() },
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        { name: "fromPrice", title: "From Price (weekly)", type: "number" },
        {
          name: "currency",
          title: "Currency",
          type: "string",
          options: {
            list: [
              { title: "EUR", value: "EUR" },
              { title: "USD", value: "USD" },
            ],
          },
          initialValue: "EUR",
        },
        { name: "priceNote", title: "Price Note", type: "string" },
      ],
    }),
    defineField({
      name: "destinations",
      title: "Recommended Destinations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "destination" }] }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      type: "type",
      featured: "featured",
    },
    prepare({ title, type, featured }) {
      const typeLabel = type === "motor" ? "Motor" : type === "sailing" ? "Sailing" : "Catamaran";
      return {
        title: `${featured ? "⭐ " : ""}${title}`,
        subtitle: typeLabel,
      };
    },
  },
  orderings: [
    {
      title: "Featured, Name",
      name: "featuredName",
      by: [
        { field: "featured", direction: "desc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
});
