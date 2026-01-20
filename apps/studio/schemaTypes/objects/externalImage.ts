import { defineType, defineField } from "sanity";

export default defineType({
  name: "externalImage",
  title: "External Image",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Image URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Describe the image for accessibility",
    }),
  ],
  preview: {
    select: {
      url: "url",
      alt: "alt",
    },
    prepare({ url, alt }) {
      return {
        title: alt || "Image",
        subtitle: url,
      };
    },
  },
});
