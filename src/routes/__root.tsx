import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type CSSProperties, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

/** Sets the entrance delay slot for a line, same as the index route. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** Shared shell for the two dead ends, so they read like the rest of the site. */
function Message({ label, children }: { label: string; children: ReactNode }) {
  return (
    <main className="page flex min-h-screen flex-col justify-center pb-24">
      <p className="label rise-in text-muted-foreground" style={at(0)}>
        {label}
      </p>
      {children}
    </main>
  );
}

function NotFoundComponent() {
  return (
    <Message label="404">
      <h1
        className="rise-in mt-6 max-w-[18ch] text-[clamp(1.75rem,5vw,3rem)] leading-[1.12] font-medium tracking-[-0.02em]"
        style={at(1)}
      >
        This page doesn’t exist.
      </h1>
      <p className="rise-in mt-5 max-w-[46ch] text-[0.9375rem] text-prose" style={at(2)}>
        It may have moved, or the link that brought you here was already wrong.
      </p>
      <p className="rise-in mt-8 text-[0.9375rem]" style={at(3)}>
        <Link className="link" to="/">
          Back to the index
        </Link>
      </p>
    </Message>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <Message label="Error">
      <h1
        className="rise-in mt-6 max-w-[18ch] text-[clamp(1.75rem,5vw,3rem)] leading-[1.12] font-medium tracking-[-0.02em]"
        style={at(1)}
      >
        This page didn’t load.
      </h1>
      <p className="rise-in mt-5 max-w-[46ch] text-[0.9375rem] text-prose" style={at(2)}>
        Something broke on the way here. Trying again usually settles it.
      </p>
      <p className="rise-in mt-8 text-[0.9375rem]" style={at(3)}>
        <button
          type="button"
          className="link"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
        {", or "}
        <a className="link" href="/">
          back to the index
        </a>
        .
      </p>
    </Message>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adiel Vásquez — Independent Brand & Web Designer" },
      {
        name: "description",
        content:
          "Adiel Vásquez is an independent designer working with startups and studios on brands and websites with a clear point of view.",
      },
      { name: "author", content: "Adiel Vásquez" },
      // The site is light-only, so the browser chrome matches the paper
      // regardless of what the reader's system prefers.
      { name: "color-scheme", content: "light" },
      { name: "theme-color", content: "#fafafa" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Adiel Vásquez — Independent Brand & Web Designer" },
      { name: "twitter:title", content: "Adiel Vásquez — Independent Brand & Web Designer" },
      {
        property: "og:description",
        content:
          "Adiel Vásquez is an independent designer working with startups and studios on brands and websites with a clear point of view.",
      },
      {
        name: "twitter:description",
        content:
          "Adiel Vásquez is an independent designer working with startups and studios on brands and websites with a clear point of view.",
      },
      // No og:image yet. The one that used to live here was a screenshot of
      // the previous site, and a share card showing the wrong design is worse
      // than none — a link with no image degrades to a plain card, a link with
      // a stale one advertises work that isn't on the page any more.
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // SVG mark first (it carries its own dark-mode rule); .ico is the fallback.
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "alternate icon", href: "/favicon.ico", sizes: "any" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        // Geist and Geist Mono are requested as variable ranges so any weight
        // the design asks for actually renders. Instrument Serif ships a
        // single weight by design; the italic is what the prose leans on, so
        // both styles are requested.
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Instrument+Serif:ital@0;1&display=swap",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
