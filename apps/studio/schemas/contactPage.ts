import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "contact", title: "Contact Info" },
    { name: "hours", title: "Office Hours" },
    { name: "form", title: "Form Section" },
    { name: "faq", title: "FAQ Section" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero Section
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      group: "hero",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "externalImage",
      group: "hero",
    }),

    // Contact Info
    defineField({
      name: "contactTitle",
      title: "Contact Section Title",
      type: "string",
      group: "contact",
      initialValue: "Contact Information",
    }),
    defineField({
      name: "contactDescription",
      title: "Contact Description",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      description: "Include country code, e.g., +30123456789",
      group: "contact",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "address",
      title: "Full Address",
      type: "text",
      rows: 3,
      group: "contact",
    }),

    // Office Hours
    defineField({
      name: "officeHours",
      title: "Office Hours",
      type: "array",
      group: "hours",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "days",
              title: "Days",
              type: "string",
              description: "e.g., 'Monday - Friday'",
            }),
            defineField({
              name: "hours",
              title: "Hours",
              type: "string",
              description: "e.g., '9:00 AM - 7:00 PM' or 'Closed'",
            }),
          ],
          preview: {
            select: {
              title: "days",
              subtitle: "hours",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "timezone",
      title: "Timezone Note",
      type: "string",
      group: "hours",
      initialValue: "All times are in Eastern European Time (EET/EEST)",
    }),

    // Form Section
    defineField({
      name: "formTitle",
      title: "Form Section Title",
      type: "string",
      group: "form",
      initialValue: "Send us a message",
    }),
    defineField({
      name: "formDescription",
      title: "Form Description",
      type: "text",
      rows: 2,
      group: "form",
    }),

    // FAQ Section
    defineField({
      name: "faqTitle",
      title: "FAQ Section Title",
      type: "string",
      group: "faq",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "faqDescription",
      title: "FAQ Section Description",
      type: "text",
      rows: 2,
      group: "faq",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
          },
        }),
      ],
    }),

    // SEO
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
        subtitle: "Edit contact page content",
      };
    },
  },
});
