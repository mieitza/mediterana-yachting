import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "mediterana-yachting",
  title: "Mediterana Yachting",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            S.documentTypeListItem("yacht").title("Yachts"),
            S.documentTypeListItem("destination").title("Destinations"),
            S.documentTypeListItem("post").title("Blog Posts"),
            S.divider(),
            S.documentTypeListItem("page").title("Pages"),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
