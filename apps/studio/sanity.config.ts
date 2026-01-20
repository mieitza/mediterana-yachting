import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "mediterana-yachting",
  title: "Mediterana Yachting",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "jrklhir1",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton pages
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Home Page")
              .child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
              ),
            S.listItem()
              .title("About Page")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
              ),
            S.listItem()
              .title("Contact Page")
              .child(
                S.document()
                  .schemaType("contactPage")
                  .documentId("contactPage")
              ),
            S.divider(),
            // Collections
            S.documentTypeListItem("yacht").title("Yachts"),
            S.documentTypeListItem("destination").title("Destinations"),
            S.documentTypeListItem("post").title("Blog Posts"),
            S.documentTypeListItem("teamMember").title("Team Members"),
            S.divider(),
            S.documentTypeListItem("page").title("Custom Pages"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
