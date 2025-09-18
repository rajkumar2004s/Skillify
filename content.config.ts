import { defineContentConfig } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    courses: {
      type: "content",

      fields: {
        title: "string",
        description: "string",
        price: "number",
        published: "boolean",
        tags: "json",
        createdAt: "date",
      },
    },
  },
});
