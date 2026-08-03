import type { Work } from "@/components/ProjectRow";

const PROJECT_ID = "lixkbml4";
const DATASET = "production";
const API_VERSION = "2025-01-01";

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
    const { result } = (await res.json()) as { result: Work[] };
    return result.map((project) => ({
      ...project,
      images: (project.images ?? []).map((src) => `${src}?w=1600&fit=max&auto=format`),
    }));
  } catch (error) {
    console.error("Sanity query failed:", error);
    return [];
  }
}
