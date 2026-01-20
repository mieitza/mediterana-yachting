import { defineType, defineField } from "sanity";

export default defineType({
  name: "yacht",
  title: "Yacht",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "type", type: "string", options: { list: ["Motor Yacht", "Sailing Yacht", "Catamaran"] } }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "lengthM", type: "number" }),
    defineField({ name: "guests", type: "number" }),
    defineField({ name: "cabins", type: "number" }),
    defineField({ name: "crew", type: "number" }),
    defineField({ name: "fromPriceEurPerWeek", type: "number" }),
    defineField({ name: "hero", type: "externalImage", validation: (r) => r.required() }),
    defineField({ name: "gallery", type: "array", of: [{ type: "externalImage" }] }),
    defineField({ name: "summary", type: "string" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "highlights", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "destinations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "destination" }] }]
    }),
    defineField({ name: "videoUrl", type: "url" }),
    defineField({
      name: "specs",
      type: "object",
      fields: [
        defineField({ name: "beamM", type: "number" }),
        defineField({ name: "draftM", type: "number" }),
        defineField({ name: "cruisingSpeedKn", type: "number" })
      ]
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false })
  ]
});
