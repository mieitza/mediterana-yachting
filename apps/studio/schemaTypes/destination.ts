import { defineType, defineField } from "sanity";

export default defineType({
  name: "destination",
  title: "Destination",
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
      name: "bestSeason",
      title: "Best Season",
      description: "e.g., May - October",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(3).max(6),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "itinerary",
      title: "Suggested Itinerary",
      type: "blockContent",
    }),
    defineField({
      name: "recommendedYachts",
      title: "Recommended Yachts",
      description: "Yachts recommended for this destination",
      type: "array",
      of: [{ type: "reference", to: [{ type: "yacht" }] }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      season: "bestSeason",
    },
    prepare({ title, season }) {
      return {
        title,
        subtitle: season,
      };
    },
  },
});
