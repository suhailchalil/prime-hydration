# PRIME — 3-flavour campaign hero

A swipeable three-slide hero built in **Next.js 16 (App Router) + React 19 +
Tailwind v4**. Blue Raspberry, Tropical Punch and Lemon Lime, each a layered
product composition with mouse parallax and a giant flavour word filled with a
live liquid texture.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

---

## Folder structure

```
prime-next/
├─ app/
│  ├─ layout.jsx        fonts (next/font) + metadata
│  ├─ page.jsx          renders <HeroSection />
│  └─ globals.css       tokens, layers, the word effect, keyframes, responsive
├─ lib/
│  └─ flavors.js        ← ALL THREE SLIDES ARE DEFINED HERE
├─ components/
│  ├─ HeroSection.jsx       carousel shell: index, autoplay, keys, swipe, parallax
│  ├─ HeroSlide.jsx         one flavour — label, word, scene, copy, script, stack
│  ├─ HeroHeader.jsx        wordmark + circular icon buttons
│  ├─ HeroContent.jsx       headline, description, pills, CTA
│  ├─ AnimatedFlavorText.jsx  the giant textured word
│  ├─ HeroBottleScene.jsx   bottle, splash, fruit, ice, leaf, bokeh, droplets
│  ├─ SlideNav.jsx          centre-bottom arrows + dots + counter
│  ├─ FeaturePills.jsx      the three chips
│  ├─ CTAButton.jsx         white pill button
│  └─ useMouseParallax.js   writes --mx / --my for the layers
└─ public/assets/          22 WebP files, 3.6 MB total
   ├─ texture-blue.webp      ← the liquid inside each giant word
   ├─ texture-tropical.webp
   └─ texture-lemon.webp
```

## Adding or editing a flavour

Everything lives in `lib/flavors.js` — colours, copy, artwork, and the full
scene layout. A fourth flavour is one more object in that array; nothing else
changes.

```js
{
  id: "blue",
  label: "Blue",        // small label, top left
  word: "Raspberry",    // the giant word
  em: 4.024,            // measured width in em — see below
  track: "-0.02em",
  tokens: { "--glow": "#2ea8ff", "--texture": "url(/assets/texture-blue.webp)", ... },
  elements: [ /* every splash, fruit, ice cube and leaf */ ],
}
```

## Layer order

| z | plane | `--depth` | notes |
|---:|---|---:|---|
| 0 | background world, grade, bokeh | 4 | |
| 5 | halo + rear splash | 16 | **behind** the giant word |
| 10 | giant word | 10 | |
| 30 | bottle, main splash, fruit, ice, leaf | 28 | **in front of** the word |
| 35 | near-camera blur | 52 | |
| 30 | label, copy, script, stacked words | — | static, no parallax |
| 40 | slide nav | — | |

Two splashes on different planes is what makes the word sit *inside* the
scene rather than behind it — one passes behind, one in front, and the bottle
overlaps it.

## The giant word

Clean, oversized editorial typography — **no image inside the letters**. No
`background-clip: text`, no texture, no photo masked into the type. The word is
a canvas the product sits in front of, not competition for it.

It is solid flavour-tinted colour (`--word`), never pure white:

| flavour | colour |
|---|---|
| blue | pale icy blue `rgba(198,230,255,.82)` |
| tropical | warm cream `rgba(255,224,194,.84)` |
| lemon | citrus cream `rgba(242,255,214,.92)` |

The only depth is a 1px flavour-tinted edge, a soft glow, and one heavily
blurred dark copy behind for separation.

### Sizing

```css
font-size: min(calc(92vw / var(--em)), 46vh);
```

`--em` is the word's measured width in em including its tracking. Solving
`92vw / em` gives the size that makes that word span the screen, so **a long
word renders at a smaller font size than a short one** — which is what keeps
their horizontal mass comparable. Short words get modest tracking to close the
remaining gap.

At 1440x900 the three land at:

| word | `em` | tracking | width | height |
|---|---:|---|---:|---:|
| `RASPBERRY` | 3.78 | `-0.045em` | 92vw | 30vh |
| `PUNCH` | 2.817 | `0.1em` | 84vw | 36vh |
| `LIME` | 3.022 | `0.3em` | 86vw | 36vh |

**Tracking trades height for width.** Letter-spacing fills the line with gaps
instead of glyphs, forcing a smaller font. Only add it to bring a short word's
natural width up toward the others.

**If you change a word, its tracking, or the font, re-measure `em`:**

```js
const f = document.querySelector('.slide.is-active .fw--main');
f.getBoundingClientRect().width / parseFloat(getComputedStyle(f).fontSize);
```

## Hierarchy

Fixed, and not to be reversed — the small label sits above the giant word:

| slide | label | giant word |
|---|---|---|
| Blue Raspberry | `BLUE` | `RASPBERRY` |
| Tropical Punch | `TROPICAL` | `PUNCH` |
| Lemon Lime | `LEMON` | `LIME` |

The full flavour name is never set at size.

## Background

Tonal, never flat. The photo supplies texture and bokeh; gradients supply the
ramp — dark edge → rich mid → luminous core behind the product — built from
three per-flavour tokens (`--bg-edge`, `--bg-mid`, `--bg-glow`) plus a soft top
key light. A flat black wash was tried and removed: it drained the colour and
made every slide grey-brown.

## Composition bands

Vertical rhythm is pinned to the reference art and verified by measurement at
1600x900:

| band | target | actual |
|---|---|---|
| giant title top | 15–18vh | 17–18vh |
| giant title bottom | ~56vh | 52–53vh |
| copy block top | 56–59vh | 56–59vh |

Gaps: 22–32px label→title, 35–51px title→copy. The title band is set by
`.fw-wrap { top: 35% }` and the copy is bottom-anchored so the CTA always
clears the nav.

### Lighting

`.halo` is the key light the product is lit *by* — a tight bright core placed
high and right of the bottle (`--key`, `--key-x`, `--key-y` per flavour),
matching where the reference art puts its source. The bottle's own shadow is
deliberately soft (`drop-shadow(0 30px 45px rgba(0,0,0,.24))`); a heavy black
shadow makes a cut-out read as pasted on.

### Element flags

Beyond position and motion, a scene element can carry:

| flag | effect |
|---|---|
| `splash` | screen-blended liquid |
| `water` | clear water, lifted in brightness/saturation so it reads refreshing rather than grey |
| `fg` | heavily blurred frame-edge shape — camera depth only |

Parallax depth per plane: background 2, giant type 3, rear splash 5, mid fruit
6, bottle 8, foreground 10. Nothing travels more than ~10px.

## Art direction per slide

The three slides share one system but are composed individually rather than
forced onto identical coordinates. Each sets its own `bx` / `by` (bottle
centre), `bh` (bottle height as a % of the hero, 62–66) and `brot` (extra
rotation on top of the asset's own ~20° tilt, so these stay small).

## Motion

Entrance runs on page load in pure CSS (`.enter-up`, `.enter-down`,
`.enter-word`, `.enter-bottle`, `.enter-el`, `.enter-fade`), staggered with a
`--delay` per element: header → word → bottle → copy → pills → CTA → script →
stacked words. Ambient motion (float, drift, shimmer, gloss, texture) is all
CSS keyframes on the compositor.

**No animation library.** Entrances are CSS so they run before hydration —
no flash of hidden content — and ambient loops stay off the main thread.
`useMouseParallax` is the only JS, and it just writes two CSS variables;
damping is a CSS transition rather than a rAF loop.

### Entrance animations rest visible

Every entrance keeps its hidden state **inside the keyframes** with
`animation-fill-mode: backwards`, never as `opacity: 0` on the element. If an
animation never runs — background tab, frozen compositor, reduced motion — the
element still rests fully visible instead of disappearing. Worth preserving if
you add more.

### Hover

Hovering the bottle scales it and makes the scene react around it — the halo
brightens and the splash saturates — driven by CSS `:has()`, so there is no
hover state in React.

## Notes

- `.hero` uses `overflow: clip`, not `hidden`. `hidden` would make the hero a
  scroll container and focusing a control inside it would scroll the whole
  composition out of frame.
- The bottle gloss is `mask-image`d to the bottle silhouette, so the highlight
  travels over the plastic rather than across a rectangle.
- Bokeh and droplet values are hand-authored, not random — `Math.random()` in a
  server component would cause a hydration mismatch.
- Scene art uses plain `<img>` with explicit `width`/`height` rather than
  `next/image`: these are decorative, pre-optimised WebP, and sized by CSS
  (`vmin` widths with `height: auto`), which `next/image` can't express without
  a fixed aspect box.
- Below 768px the layout stacks — bottle up top, copy centred below with its own
  bottom-anchored scrim. Short landscape windows return to side-by-side.
- `prefers-reduced-motion` disables drift, float, shimmer, gloss and parallax,
  leaving the hero fully legible.
