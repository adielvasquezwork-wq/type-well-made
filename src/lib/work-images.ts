/**
 * SUPERSEDED: project content now comes from Sanity (see
 * `src/lib/sanity.server.ts` and the `/studio` folder) — nothing in the app
 * calls `imagesForProject` anymore. Left in place, along with the photos
 * under `src/work-images/`, only so nothing gets deleted before those
 * photos are re-uploaded into the new Studio. Safe to delete both once
 * that's done.
 *
 * Turns a folder of photos into a project's image list — no code edit needed
 * to add, remove, or reorder pictures.
 *
 * HOW TO CHANGE A PROJECT'S PHOTOS (no engineer required):
 * 1. Open the `src/work-images/<project>/` folder on GitHub (e.g.
 *    `src/work-images/grain/`). Each project gets its own folder, named to
 *    match its title in lowercase (grain, serveo, opus).
 * 2. To add a photo: click "Add file" → "Upload files" and drag it in.
 * 3. To remove a photo: open it in that folder and click the trash icon.
 * 4. To control the order, name files with a number first — "1-cover.jpg",
 *    "2-detail.jpg", "3-close-up.jpg". The number decides where it falls;
 *    the rest of the name is just for you.
 * 5. Commit the change (GitHub will ask for a commit message — anything
 *    works, e.g. "update Grain photos"). The site rebuilds and picks up the
 *    new photos automatically within a couple of minutes.
 * 6. Delete every photo in a project's folder to show its "in progress"
 *    placeholder instead of a gallery.
 *
 * Accepted formats: jpg, jpeg, png, webp, avif.
 */
const files = import.meta.glob<string>("../work-images/*/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

/** Every photo filed under `src/work-images/<slug>/`, in filename order. */
export function imagesForProject(slug: string): string[] {
  const prefix = `../work-images/${slug}/`;
  return Object.keys(files)
    .filter((path) => path.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => files[path]);
}
