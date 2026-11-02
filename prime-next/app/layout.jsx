import localFont from "next/font/local";
import { PRELOADER_BOOT } from "@/lib/preloader";
import InlineScript from "@/components/InlineScript";
import "./globals.css";

/* Fonts are SELF-HOSTED from ./fonts rather than fetched from Google.
   next/font/google downloads at build time, so a flaky connection silently
   drops the typefaces and the hero falls back to Impact/system sans — which
   is exactly what happened here. Local files make the build deterministic and
   work offline. To update one, drop in a new .woff2 and adjust the path. */

/* Display face: the giant flavour word and the PRIME wordmark.  */
const anton = localFont({
  src: "./fonts/anton-400.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-anton",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

/* UI + body copy. Variable weight axis 100–900. */
const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

/* Used for one line only: the handwritten script phrase. */
const caveat = localFont({
  src: "./fonts/caveat-600.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-caveat",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Segoe Script", "cursive"],
});

export const metadata = {
  title: "PRIME — Blue Raspberry",
  description:
    "Ice-cold blue raspberry with a clean electric finish — built to put back everything a hard session takes out of you.",
};

export const viewport = {
  themeColor: "#04070f",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${caveat.variable}`}
      /* the boot script adds classes to <html> before hydration; this tells
         React to keep the DOM's version rather than treat it as a mismatch */
      suppressHydrationWarning
    >
      <head>
        {/* Runs synchronously while the HTML is parsed — before first paint —
            so the loader is up before React exists and the hero never flashes.
            Classes only, never server HTML: with JS off there is no loader. */}
        <InlineScript html={PRELOADER_BOOT} />
      </head>
      <body>{children}</body>
    </html>
  );
}
