"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FLAVORS, AUTOPLAY_MS } from "@/lib/flavors";
import useMouseParallax from "./useMouseParallax";
import HeroHeader from "./HeroHeader";
import HeroSlide from "./HeroSlide";
import SlideNav from "./SlideNav";
import Preloader from "./Preloader";

/**
 * Carousel shell. Owns the active index, autoplay, keyboard and swipe, and
 * the parallax ref that feeds --mx / --my to every .layer below.
 *
 * Nothing starts until the preloader hands over (`ready`) — otherwise the
 * autoplay clock would be burning through slide one behind the curtain.
 */
export default function HeroSection() {
  const parallaxRef = useMouseParallax();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const count = FLAVORS.length;

  const go = useCallback((n) => setIndex(((n % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  /* autoplay — the dot progress bar is timed from the same constant */
  useEffect(() => {
    if (!ready || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, count, ready]);

  useEffect(() => {
    const onVisible = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!ready) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(count - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, count, ready]);

  /* drag / swipe */
  const drag = useRef({ on: false, x: 0, y: 0 });

  const onPointerDown = (e) => {
    if (e.target.closest("button, a")) return;
    drag.current = { on: true, x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    if (Math.abs(e.clientY - d.y) > Math.abs(dx) * 1.5) return;
    if (Math.abs(dx) > 70) {
      d.on = false;
      dx < 0 ? next() : prev();
    }
  };

  const endDrag = () => {
    drag.current.on = false;
  };

  /* wheel / trackpad, one slide per gesture */
  const wheelLock = useRef(false);
  const onWheel = (e) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 18 || wheelLock.current) return;
    wheelLock.current = true;
    d > 0 ? next() : prev();
    setTimeout(() => {
      wheelLock.current = false;
    }, 850);
  };

  return (
    <>
      {/* outside .hero on purpose: the hero's animations are held while the
          loader runs, and the loader must not be caught by that hold */}
      <Preloader onReady={() => setReady(true)} />

      <main
        ref={parallaxRef}
        className={`hero${paused ? " is-paused" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        role="region"
        aria-roledescription="carousel"
        aria-label="PRIME flavours"
      >
        <HeroHeader />

        {FLAVORS.map((f, i) => (
          <HeroSlide key={f.id} flavor={f} active={i === index} />
        ))}

        <SlideNav
          flavors={FLAVORS}
          index={index}
          onGo={go}
          onPrev={prev}
          onNext={next}
          autoplayMs={AUTOPLAY_MS}
        />
      </main>
    </>
  );
}
