import { defineType, defineField } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "heroSection",
          title: "Hero Section",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "subtitle", title: "Subtitle", type: "text", rows: 2 },
            { name: "backgroundImage", title: "Background Image", type: "externalImage" },
            {
              name: "cta",
              title: "CTA",
              type: "object",
              fields: [
                { name: "label", title: "Label", type: "string" },
                { name: "href", title: "Link", type: "string" },
              ],
            },
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Hero Section", subtitle: "Hero" };
            },
          },
        },
        {
          type: "object",
          name: "textSection",
          title: "Text Section",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "content", title: "Content", type: "blockContent" },
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Text Section", subtitle: "Text" };
            },
          },
        },
        {
          type: "object",
          name: "imageTextSection",
          title: "Image + Text Section",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "content", title: "Content", type: "blockContent" },
            { name: "image", title: "Image", type: "externalImage" },
            {
              name: "imagePosition",
              title: "Image Position",
              type: "string",
              options: {
                list: [
                  { title: "Left", value: "left" },
                  { title: "Right", value: "right" },
                ],
              },
              initialValue: "right",
            },
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Image + Text", subtitle: "Image/Text" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}`,
      };
    },
  },
});
