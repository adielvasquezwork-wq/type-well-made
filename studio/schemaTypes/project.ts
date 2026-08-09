import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blurb",
      title: "Blurb",
      description: "The one line that says why the project exists.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Disciplines",
      description:
        'What the project was — e.g. "Brand", "Web", "Naming". Shown next to the title on the homepage, separated by commas. Two or three is plenty.',
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Lower numbers show first on the homepage.",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pending",
      title: "In-progress label",
      description:
        'Added after the title on the homepage — e.g. "Coming Soon", "Shipping 2026". It also fills the empty frame when there are no photos yet. Leave blank once the project is out.',
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Photos",
      description:
        "The first one is the cover shown on the homepage — its own shape sets the height of its card, so crop it before uploading. All of them show once someone clicks in. Drag thumbnails to reorder.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0" },
  },
});
