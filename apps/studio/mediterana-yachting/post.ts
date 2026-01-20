import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "cover", type: "externalImage", validation: (r) => r.required() }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] })
  ]
});
