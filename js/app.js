/* =====================================================================
   PRIME reel hero — slide engine, depth parallax, autoplay
   ===================================================================== */
(() => {
  'use strict';

  const reel    = document.getElementById('reel');
  const hero    = document.querySelector('.hero');
  if (!reel || !hero) return;

  const slides  = [...reel.querySelectorAll('.slide')];
  const dots    = [...document.querySelectorAll('.dot')];
  const counter = document.getElementById('counter-now');
  const prevBtn = document.querySelector('.arrow--prev');
  const nextBtn = document.querySelector('.arrow--next');
  const hint    = document.querySelector('.hint');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const count   = slides.length;

  /* autoplay length comes from CSS so the dot progress bar always agrees */
  const autoMs = (() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--autoplay').trim();
    if (v.endsWith('ms')) return parseFloat(v);
    if (v.endsWith('s'))  return parseFloat(v) * 1000;
    return 7500;
  })();

  let index    = slides.findIndex(s => s.classList.contains('is-active'));
  if (index < 0) index = 0;
  let animating = false;
  let timer     = null;
  let paused    = false;

  /* ------------------------------------------------------------------
     slide engine
     ------------------------------------------------------------------ */
  function goTo(next, dir) {
    next = (next + count) % count;
    if (next === index || animating) return;

    dir = dir || (next > index ? 1 : -1);
    // wrap-around should still travel the way the user asked
    if (next === 0 && index === count - 1) dir = 1;
    if (next === count - 1 && index === 0) dir = -1;

    const outgoing = slides[index];
    const incoming = slides[next];

    // incoming enters from `dir`, outgoing leaves the opposite way
    incoming.style.setProperty('--dir', dir);
    outgoing.style.setProperty('--dir', -dir);

    animating = true;
    outgoing.classList.remove('is-active');
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');

    index = next;
    syncHud();
    restartAuto();

    setTimeout(() => { animating = false; }, 700);
  }

  const next = () => goTo(index + 1,  1);
  const prev = () => goTo(index - 1, -1);

  function syncHud() {
    dots.forEach((d, i) => {
      d.classList.toggle('is-on', i === index);
      d.setAttribute('aria-selected', String(i === index));
    });
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
  }

  /* ------------------------------------------------------------------
     autoplay
     ------------------------------------------------------------------ */
  function restartAuto() {
    clearTimeout(timer);
    if (reduced.matches || paused) return;
    timer = setTimeout(next, autoMs);
  }

  function setPaused(state) {
    paused = state;
    reel.classList.toggle('is-paused', state);
    if (state) clearTimeout(timer);
    else restartAuto();
  }

  /* The hero fills the viewport, so pausing on hover would stall the reel for
     anyone whose cursor is simply on the page. Pause only over the controls,
     while a control has focus, and when the tab is hidden. */
  const hud = document.querySelector('.hud');
  if (hud) {
    hud.addEventListener('pointerenter', () => setPaused(true));
    hud.addEventListener('pointerleave', () => setPaused(false));
  }
  hero.addEventListener('focusin',  () => setPaused(true));
  hero.addEventListener('focusout', () => setPaused(false));
  document.addEventListener('visibilitychange', () => setPaused(document.hidden));

  /* ------------------------------------------------------------------
     controls
     ------------------------------------------------------------------ */
  nextBtn && nextBtn.addEventListener('click', next);
  prevBtn && prevBtn.addEventListener('click', prev);
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.go)));

  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); }
    else if (e.key === 'ArrowLeft') { prev(); }
    else if (e.key === 'Home') { goTo(0, -1); }
    else if (e.key === 'End')  { goTo(count - 1, 1); }
    else return;
    e.preventDefault();
  });

  /* wheel / trackpad — one slide per gesture */
  let wheelLock = false;
  hero.addEventListener('wheel', e => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 18 || wheelLock) return;
    wheelLock = true;
    delta > 0 ? next() : prev();
    setTimeout(() => { wheelLock = false; }, 820);
  }, { passive: true });

  /* ------------------------------------------------------------------
     drag / swipe
     ------------------------------------------------------------------ */
  let dragging = false, startX = 0, startY = 0, moved = 0, pid = null;

  reel.addEventListener('pointerdown', e => {
    if (e.target.closest('a, button')) return;
    dragging = true; moved = 0;
    startX = e.clientX; startY = e.clientY; pid = e.pointerId;
    reel.classList.add('is-dragging');
  });

  reel.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > Math.abs(dx) * 1.5) return;   // vertical intent, ignore
    moved = dx;
    if (Math.abs(dx) > 70) endDrag();
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    reel.classList.remove('is-dragging');
    if (Math.abs(moved) > 55) {
      moved < 0 ? next() : prev();
      if (hint) hint.style.opacity = '0';
    }
    moved = 0; pid = null;
  }

  reel.addEventListener('pointerup', endDrag);
  reel.addEventListener('pointercancel', endDrag);
  reel.addEventListener('pointerleave', endDrag);

  /* ------------------------------------------------------------------
     depth parallax — damped in CSS via a transition on .layer
     ------------------------------------------------------------------ */
  if (!reduced.matches && matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const x = (e.clientX / innerWidth  - .5) * 2;   // -1 … 1
      const y = (e.clientY / innerHeight - .5) * 2;
      reel.style.setProperty('--mx', (-x).toFixed(3));
      reel.style.setProperty('--my', (-y).toFixed(3));
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      reel.style.setProperty('--mx', '0');
      reel.style.setProperty('--my', '0');
    });
  }

  /* ------------------------------------------------------------------
     scene decoration
     ------------------------------------------------------------------ */
  const rand = (min, max) => min + Math.random() * (max - min);

  /* split each flavour word into characters so they can cascade in.
     The index runs across both lines, so the wave reads as one motion. */
  function splitWords() {
    reel.querySelectorAll('.bgword').forEach(word => {
      let n = 0;
      word.querySelectorAll('span').forEach(line => {
        const text = line.textContent;
        line.textContent = '';
        for (const ch of text) {
          const c = document.createElement('i');
          c.textContent = ch;
          c.style.setProperty('--i', n++);
          line.appendChild(c);
        }
      });
      word.classList.add('is-split');
    });
  }

  function buildBokeh() {
    reel.querySelectorAll('[data-bokeh]').forEach(field => {
      const n = +field.dataset.bokeh || 10;
      const near = field.classList.contains('bokeh--near');
      const frag = document.createDocumentFragment();

      for (let i = 0; i < n; i++) {
        const b = document.createElement('b');
        b.style.cssText =
          `--bx:${rand(-6, 102).toFixed(1)}%;--by:${rand(-6, 104).toFixed(1)}%;` +
          `--bs:${(near ? rand(90, 210) : rand(14, 70)).toFixed(0)}px;` +
          `--bo:${(near ? rand(.10, .26) : rand(.16, .5)).toFixed(2)};` +
          `--bb:${(near ? rand(14, 30) : rand(1, 9)).toFixed(0)}px;` +
          `--bdx:${rand(-60, 60).toFixed(0)}px;--bdy:${rand(-70, 40).toFixed(0)}px;` +
          `--bsc:${rand(.82, 1.28).toFixed(2)};` +
          `--bd:${rand(9, 22).toFixed(1)}s;--bdl:${(-rand(0, 18)).toFixed(1)}s;`;
        frag.appendChild(b);
      }

      field.appendChild(frag);
      field.setAttribute('aria-hidden', 'true');
    });
  }

  splitWords();
  buildBokeh();

  /* ------------------------------------------------------------------
     housekeeping
     ------------------------------------------------------------------ */
  slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== index)));
  syncHud();

  if (reduced.matches) reel.classList.add('no-auto');
  else restartAuto();

  /* warm the off-screen flavour art so the first transition never pops */
  addEventListener('load', () => {
    reel.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.loading = 'eager';
      if (img.decode) img.decode().catch(() => {});
    });
  });

  /* fade the drag hint once the user has explored */
  let interactions = 0;
  ['click', 'keydown', 'wheel'].forEach(evt =>
    hero.addEventListener(evt, () => {
      if (hint && ++interactions >= 2) hint.style.opacity = '0';
    }, { passive: true })
  );
})();
