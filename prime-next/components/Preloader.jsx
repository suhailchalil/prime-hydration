"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FLAVORS } from "@/lib/flavors";
import { PL_CLASSES } from "@/lib/preloader";

/* Timing. The minimum stops the intro flashing past on a fast connection; the
   maximum stops a slow one holding the visitor hostage. */
const MIN_MS = 1500;
const MAX_MS = 5000;
const HOLD_MS = 280; // beat at 100% before the logo flies
const FLY_MS = 1150;
const SWAP_MS = 380; // overlap while the real logo fades in underneath

/* ease-in-out quart — a deliberate, weighted move rather than a snap */
const FLY_EASE = "cubic-bezier(0.77, 0, 0.18, 1)";

/**
 * Intro loader.
 *
 * A full-screen PRIME that fills in as the hero's critical art loads, then
 * flies into the header and becomes the logo. The move is a FLIP: measure the
 * big word and the real logo, then animate a single translate + scale between
 * the two rects. Both share the same font, tracking and line-height, so the
 * scaled word lands on the logo glyph-for-glyph.
 *
 * Choreography
 *   0 → load    outline PRIME, a solid fill wiping across as assets arrive
 *   100%        meta fades, a short hold
 *   fly         word shrinks into the header while the curtain fades; the
 *               hero's own entrance starts partway through, so the scene
 *               builds up behind the moving logo
 *   land        the real logo fades in underneath, then the stand-in goes
 *
 * `onReady` fires when the hero should start (entrance, autoplay).
 */
export default function Preloader({ onReady }) {
  const [gone, setGone] = useState(false);

  const rootRef = useRef(null);
  const curtainRef = useRef(null);
  const wordRef = useRef(null);
  const fillRef = useRef(null);
  const outlineRef = useRef(null);
  const metaRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);

  /* In development, React Strict Mode's remount resets <html> to only the
     attributes it manages, wiping the classes the boot script set. Re-apply
     them before paint. A no-op in production. */
  useLayoutEffect(() => {
    PL_CLASSES.forEach((c) => document.documentElement.classList.add(c));
  }, []);

  useEffect(() => {
    window.__primeLoader = true; // tells the boot script's safety net we're alive

    const html = document.documentElement;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let raf = 0;
    const timers = [];
    const anims = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    const release = () => {
      if (cancelled) return;
      html.classList.remove("pl-hold");
      onReady?.();
    };

    /* ---- what "loaded" means: every bottle and background, plus fonts ---- */
    const urls = [...new Set(FLAVORS.flatMap((f) => [f.bottle, f.bg]))];
    const total = urls.length + 1;
    let loaded = 0;
    const tick = () => {
      loaded += 1;
    };

    urls.forEach((src) => {
      const img = new Image();
      img.onload = tick;
      img.onerror = tick; // a missing file must not stall the intro
      img.src = src;
    });
    (document.fonts?.ready ?? Promise.resolve()).then(tick, tick);

    /* ---- progress: real loading, paced so it never finishes too fast ---- */
    const render = (p) => {
      fillRef.current.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`;
      barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      countRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };

    const t0 = performance.now();
    let shown = 0;

    const frame = (now) => {
      if (cancelled) return;
      const elapsed = now - t0;
      let target = Math.min(loaded / total, elapsed / MIN_MS);
      if (elapsed > MAX_MS) target = 1;

      shown += (Math.min(target, 1) - shown) * 0.1;
      if (target >= 1 && shown > 0.996) shown = 1;

      render(shown);
      if (shown < 1) raf = requestAnimationFrame(frame);
      else finish();
    };
    raf = requestAnimationFrame(frame);

    /* ---- the handover ---- */
    function finish() {
      const root = rootRef.current;
      const word = wordRef.current;
      const logo = document.querySelector(".brand");

      // no motion: a quiet fade, no flight
      if (still || !logo) {
        release();
        const fade = root.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 420,
          easing: "ease-out",
          fill: "forwards",
        });
        anims.push(fade);
        fade.finished
          .then(() => {
            html.classList.remove("pl-logo");
            if (!cancelled) setGone(true);
          })
          .catch(() => {});
        return;
      }

      anims.push(
        metaRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 240,
          fill: "forwards",
        }),
        outlineRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 240,
          fill: "forwards",
        })
      );

      later(() => {
        // FLIP: both rects measured now, one transform between them
        const from = word.getBoundingClientRect();
        const to = logo.getBoundingClientRect();
        const s = to.width / from.width;
        const tx = to.left - from.left;
        const ty = to.top + to.height / 2 - (from.top + (from.height * s) / 2);

        root.style.pointerEvents = "none"; // hero is interactive as it reveals

        const fly = word.animate(
          [
            { transform: "translate(0px, 0px) scale(1)" },
            { transform: `translate(${tx}px, ${ty}px) scale(${s})` },
          ],
          { duration: FLY_MS, easing: FLY_EASE, fill: "forwards" }
        );

        anims.push(
          fly,
          curtainRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 900,
            delay: 160,
            easing: "cubic-bezier(0.33, 0, 0.2, 1)",
            fill: "forwards",
          })
        );

        // start building the scene while the logo is still in flight
        later(release, 220);

        fly.finished
          .then(() => {
            html.classList.remove("pl-logo"); // real logo fades in underneath
            later(() => {
              if (!cancelled) setGone(true);
            }, SWAP_MS);
          })
          .catch(() => {});
      }, HOLD_MS);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
    };
    // mount-once by design: onReady is a stable state setter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div ref={curtainRef} className="pl-curtain" />

      <div className="pl-stage">
        <span ref={wordRef} className="pl-word">
          <span ref={outlineRef} className="pl-glyphs pl-outline">
            Prime
          </span>
          <span ref={fillRef} className="pl-glyphs pl-fill">
            Prime
          </span>
        </span>

        <div ref={metaRef} className="pl-meta">
          <span className="pl-track">
            <i ref={barRef} />
          </span>
          <span className="pl-row">
            <span>Hydrate your next move</span>
            <b ref={countRef}>000</b>
          </span>
        </div>
      </div>
    </div>
  );
}
