"use client";

import { useEffect, useRef } from "react";

/**
 * Writes pointer position onto a container as `--mx` / `--my`, each in the
 * range -1 … 1. Every `.layer` inside reads those together with its own
 * `--depth` to offset itself, which is what gives the scene its 3D feel.
 *
 * Damping is handled by a CSS transition on `.layer` rather than a rAF loop,
 * so the work stays on the compositor and costs nothing on the main thread.
 *
 * Progressive enhancement: with no pointer, or with reduced motion, the vars
 * are simply never written and the scene renders at rest.
 */
export default function useMouseParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--mx", (-x).toFixed(3));
      el.style.setProperty("--my", (-y).toFixed(3));
    };

    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return ref;
}
