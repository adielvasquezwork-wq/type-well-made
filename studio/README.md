# Portfolio content Studio

This is the editing tool for the homepage's "Selected work" projects — title,
blurb, and photos for Grain, Serveo, and Opus. It's a separate mini-app from
the main site, so it needs its own deployment.

## One-time setup (do this once)

1. Go to [vercel.com](https://vercel.com) and click **"Add New" → "Project"**.
2. Pick this same GitHub repo (`type-well-made`).
3. Before deploying, open **"Root Directory"** and set it to `studio`.
4. Vercel should auto-detect the framework; if it asks, the build command is
   `npm run build` and the output directory is `dist`.
5. Click **Deploy**. You'll get a URL like
   `portfolio-studio.vercel.app` — bookmark it, that's your editing link.
6. The first time you open it, it'll ask you to log into Sanity (same
   account you used to create the project) — that's expected and only
   happens once per browser.

## Using it

Open your bookmarked Studio link → click **Project** in the sidebar → click
**"Create new"** or open an existing one → fill in Title, Blurb, Order
(lower number shows first), photos, and — only if there are no photos yet —
an "in-progress" label like "Shipping 2026". Click **Publish**.

Changes show up on the live site the next time it rebuilds. Ask whoever set
this up whether that's automatic (a webhook) or if you need to trigger a
redeploy on Vercel yourself.
