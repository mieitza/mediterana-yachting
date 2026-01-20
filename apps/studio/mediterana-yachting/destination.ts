import { defineType, defineField } from "sanity";

export default defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "hero", type: "externalImage", validation: (r) => r.required() }),
    defineField({ name: "bestSeason", type: "string" }),
    defineField({ name: "highlights", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "itinerary", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "gallery", type: "array", of: [{ type: "externalImage" }] })
  ]
});
