import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string", validation: (r) => r.required() }),
    defineField({ name: "domain", type: "url" }),
    defineField({
      name: "featuredYachts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "yacht" }] }]
    }),
    defineField({ name: "contactEmail", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "whatsapp", type: "string" })
  ]
});
