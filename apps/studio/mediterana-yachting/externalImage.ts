import { defineType, defineField } from "sanity";

export default defineType({
  name: "externalImage",
  title: "External Image",
  type: "object",
  fields: [
    defineField({ name: "url", type: "url", title: "URL", validation: (r) => r.required() }),
    defineField({ name: "alt", type: "string", title: "Alt text" })
  ]
});
