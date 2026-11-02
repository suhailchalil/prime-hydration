"use client";

/**
 * An inline <script> that runs during HTML parsing without React warning
 * about it (the pattern from Next 16's "preventing flash before hydration"
 * guide).
 *
 * On the server it renders as `text/javascript`, so the browser executes it
 * synchronously while parsing — before first paint. On the client it renders as
 * `text/plain`, which React doesn't treat as an executable script, so there is
 * no "Encountered a script tag" warning on hydration or Fast Refresh.
 * `suppressHydrationWarning` absorbs the resulting type mismatch; the DOM keeps
 * the server's version, which has already run.
 *
 * It must be a Client Component: a Server Component only ever renders on the
 * server, so the `text/plain` branch would never exist.
 */
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
