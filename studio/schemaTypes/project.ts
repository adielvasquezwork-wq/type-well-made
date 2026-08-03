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
        'Shown instead of a photo gallery when there are no photos yet — e.g. "Shipping 2026". Leave blank once photos are added below.',
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Photos",
      description:
        "The first 3 (in this order) show in the scrolling row on the homepage. All of them show once someone clicks in. Drag thumbnails to reorder.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0" },
  },
});
