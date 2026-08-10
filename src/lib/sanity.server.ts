import type { Work } from "@/components/ProjectCard";

const PROJECT_ID = "lixkbml4";
const DATASET = "production";
const API_VERSION = "2025-01-01";

/** What the query actually returns: photos can be null, and carry no ratio. */
type RawProject = Omit<Work, "images"> & { images?: (string | null)[] };

/**
 * A Sanity asset URL ends in its own pixel size — `…-3040x2066.png`. Reading
 * each shot's ratio off that is what lets a grid reserve the right box before
 * the image arrives, so nothing reflows as it loads — and it's also what tells
 * the gallery which shots are wide enough to run the full width of the sheet.
 */
function ratioOf(url: string | undefined): number | undefined {
  const size = url?.match(/-(\d+)x(\d+)\.\w+$/);
  if (!size) return undefined;
  const ratio = Number(size[1]) / Number(size[2]);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : undefined;
}

/**
 * The homepage's project list, straight from Sanity — no SDK, just its plain
 * HTTP query API, so the main app takes on zero new dependencies for this.
 * Runs server-side only (see the `createServerFn` wrapper in index.tsx),
 * which sidesteps needing any CORS origin configured in the Sanity project.
 */
export async function fetchWork(): Promise<Work[]> {
  const query = `*[_type == "project"] | order(order asc){
    title,
    blurb,
    tags,
    pending,
    "images": images[].asset->url
  }`;
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Sanity query failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const { result } = (await res.json()) as { result: RawProject[] };
    return result.map((project) => {
      // An image slot left empty in the Studio comes back as null, and a null
      // dropped into a `src` is a broken image on the page.
      const images = (project.images ?? [])
        .filter((src): src is string => Boolean(src))
        .map((src) => ({ src: `${src}?w=1600&fit=max&auto=format`, ratio: ratioOf(src) }));
      return { ...project, images };
    });
  } catch (error) {
    console.error("Sanity query failed:", error);
    return [];
  }
}
