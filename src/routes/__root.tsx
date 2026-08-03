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

/** Sets the entrance delay slot for a masthead line, same as the index route. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

/** Shared shell for the two dead ends, so they read like the rest of the site. */
function Message({ label, children }: { label: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[76rem] flex-col justify-center px-6 pb-24 sm:px-10 lg:px-14">
      <p className="line-mask label text-muted-foreground">
        <span className="line-in inline-block" style={at(0)}>
          {label}
        </span>
      </p>
      {children}
    </main>
  );
}

function NotFoundComponent() {
  return (
    <Message label="404">
      <h1 className="display mt-7 text-[clamp(2.5rem,8vw,5.5rem)]">
        <span className="line-mask">
          <span className="line-in" style={at(1)}>
            This page doesn’t exist.
          </span>
        </span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-prose">
        It may have moved, or the link that brought you here was already wrong.
      </p>
      <p className="mt-10">
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
      <h1 className="display mt-7 text-[clamp(2.5rem,8vw,5.5rem)]">
        <span className="line-mask">
          <span className="line-in" style={at(1)}>
            This page didn’t load.
          </span>
        </span>
      </h1>
      <p className="mt-6 max-w-[46ch] text-prose">
        Something broke on the way here. Trying again usually settles it.
      </p>
      <p className="mt-10">
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
      { name: "theme-color", content: "#f5f4f2" },
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
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/41cfb7ed-2263-49fc-b997-574a6ae9879d/id-preview-dea99bfb--2fe74f76-b49a-4076-80b3-6e925fcac0dc.lovable.app-1785170384097.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/41cfb7ed-2263-49fc-b997-574a6ae9879d/id-preview-dea99bfb--2fe74f76-b49a-4076-80b3-6e925fcac0dc.lovable.app-1785170384097.png",
      },
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
