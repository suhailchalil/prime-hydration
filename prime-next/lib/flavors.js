/**
 * Every slide is driven from this file — colours, copy, artwork, art direction.
 * Adding a flavour means adding an object here; nothing else changes.
 *
 * Word sizing
 *   em    the word's rendered width in em including tracking, measured in the
 *         browser. The word is sized `92vw / em`, so each one spans a similar
 *         horizontal mass. Long words therefore render at a smaller font size
 *         than short ones — RASPBERRY is smaller than PUNCH, which is smaller
 *         than LIME. That is intended.
 *   track letter-spacing.
 *
 * Bottle framing — all three slides share identical values so the product
 * holds the same size, position and pose as you step through the reel.
 *   bh    bottle height as a % of the hero
 *   bx by bottle centre (the key light and halo follow these too)
 *   brot  extra rotation on top of the asset's own tilt (assets are already
 *         tilted ~20°, so this stays small)
 *
 * Scene elements
 *   plane "back"  behind the giant word
 *         "mid"   between word and bottle
 *         "front" in front of the bottle, near camera
 *   fg    heavily blurred frame-edge shape — camera depth only
 *   water clear water, lifted so it reads refreshing rather than grey
 */

export const FLAVORS = [
  {
    id: "blue",
    label: "Blue",
    word: "Raspberry",
    full: "Blue Raspberry",
    headline: "Hydrate Your Next Move",
    desc: "Ice-cold blue raspberry with a clean electric finish — built to put back everything a hard session takes out of you.",
    script: "More Than A Drink",
    stack: ["Fuel", "Focus", "Refresh", "Repeat"],

    em: 3.78,
    track: "-0.045em",

    bh: 64,
    bx: "62%",
    by: "52%",
    brot: "2deg",

    tokens: {
      "--accent": "#8fd8ff",
      "--glow": "#2ea8ff",
      /* clean typography colour — pale icy blue, never pure white */
      "--word": "rgba(198, 230, 255, 0.82)",
      "--word-edge": "rgba(226, 244, 255, 0.5)",
      /* background tonal ramp: dark navy → rich cobalt → luminous core */
      "--bg-edge": "#040a1e",
      "--bg-mid": "rgba(10, 46, 107, 0.72)",
      "--bg-glow": "rgba(58, 170, 255, 0.5)",
      /* the light the product is lit by */
      "--key": "rgba(150, 215, 255, 0.4)",
      "--key-x": "66%",
      "--key-y": "32%",
    },

    bg: "/assets/bg-blue.webp",
    bottle: "/assets/bottle-blue.webp",
    bottleAlt: "A chilled bottle of PRIME Blue Raspberry hydration drink",

    elements: [
      { plane: "back",  src: "/assets/splash-blue.webp", splash: true, x: "40%", y: "46%", w: 54, r: "-152deg", dx: "10px", dy: "-12px", dr: "3deg", dur: "19s", dly: "-5s", op: 0.42, blur: "5px" },
      { plane: "mid",   src: "/assets/splash-blue.webp", splash: true, x: "60%", y: "50%", w: 76, r: "8deg",   dx: "-10px", dy: "12px", dr: "-3deg", dur: "17s", dly: "-3s", op: 0.8,  blur: "0px" },
      { plane: "mid",   src: "/assets/ice-blue.webp",  x: "40%", y: "62%", w: 12, r: "14deg",  dx: "-7px", dy: "-12px", dr: "-9deg", dur: "13s", dly: "-1s", op: 0.95 },
      { plane: "mid",   src: "/assets/leaf-a.webp",    x: "44%", y: "83%", w: 15, r: "-150deg", dx: "10px", dy: "-10px", dr: "7deg", dur: "14s", dly: "-6s", op: 0.9 },
      { plane: "front", src: "/assets/ice-blue.webp",  x: "78%", y: "70%", w: 14, r: "-22deg", dx: "-6px", dy: "10px", dr: "12deg", dur: "11s", dly: "-4s", op: 0.9 },
      { plane: "front", src: "/assets/leaf-a.webp", fg: true, x: "6%", y: "95%", w: 30, r: "24deg", dx: "10px", dy: "-8px", dr: "-4deg", dur: "20s", dly: "-4s", op: 0.26, blur: "24px" },
    ],
  },

  {
    id: "tropical",
    label: "Tropical",
    word: "Punch",
    full: "Tropical Punch",
    headline: "Fuel The Whole Day",
    desc: "Sun-ripe mango, orange and guava poured into one bold hit of tropical energy — tuned for long, loud days.",
    script: "Tropical Energy Everywhere",
    stack: ["Bold", "Flavor", "Real", "Energy"],

    em: 2.817,
    track: "0.1em",

    bh: 64,
    bx: "62%",
    by: "52%",
    brot: "2deg",

    tokens: {
      "--accent": "#ffc46b",
      "--glow": "#ff7a2b",
      /* warm cream / pale peach */
      "--word": "rgba(255, 224, 194, 0.84)",
      "--word-edge": "rgba(255, 238, 220, 0.5)",
      /* deep wine → burnt red → golden core */
      "--bg-edge": "#1a0405",
      "--bg-mid": "rgba(110, 20, 8, 0.74)",
      "--bg-glow": "rgba(255, 146, 52, 0.46)",
      "--key": "rgba(255, 190, 80, 0.42)",
      "--key-x": "67%",
      "--key-y": "35%",
    },

    bg: "/assets/bg-tropical.webp",
    bottle: "/assets/bottle-tropical.webp",
    bottleAlt: "A chilled bottle of PRIME Tropical Punch hydration drink",

    elements: [
      { plane: "back",  src: "/assets/splash-tropical.webp", splash: true, x: "40%", y: "46%", w: 56, r: "166deg", dx: "12px", dy: "-10px", dr: "-3deg", dur: "20s", dly: "-6s", op: 0.42, blur: "5px" },
      { plane: "mid",   src: "/assets/splash-tropical.webp", splash: true, x: "59%", y: "51%", w: 78, r: "-6deg", dx: "12px", dy: "10px", dr: "3deg", dur: "18s", dly: "-4s", op: 0.8, blur: "0px" },
      { plane: "mid",   src: "/assets/orange-wedge.webp", x: "39%", y: "64%", w: 13, r: "-22deg", dx: "-8px", dy: "-12px", dr: "9deg", dur: "13s", dly: "-2s" },
      { plane: "mid",   src: "/assets/leaf-b.webp",      x: "45%", y: "84%", w: 16, r: "158deg", dx: "-8px", dy: "-9px", dr: "6deg", dur: "15s", dly: "-1s", op: 0.9 },
      { plane: "front", src: "/assets/mango-cubes.webp", x: "78%", y: "72%", w: 13, r: "-10deg", dx: "10px", dy: "-9px", dr: "-6deg", dur: "14s", dly: "-6s" },
      { plane: "front", src: "/assets/leaf-b.webp", fg: true, x: "5%", y: "94%", w: 32, r: "-28deg", dx: "12px", dy: "-8px", dr: "5deg", dur: "21s", dly: "-5s", op: 0.26, blur: "26px" },
    ],
  },

  {
    id: "lemon",
    label: "Lemon",
    word: "Lime",
    full: "Lemon Lime",
    headline: "Crisp From First Sip",
    desc: "Sharp lemon over cold-pressed lime. Clean, zesty and impossibly easy to keep drinking from first sip to last.",
    script: "Citrus Vibes All Day",
    stack: ["Pure", "Flavor", "Real", "Hydration"],

    em: 3.022,
    track: "0.3em",

    bh: 64,
    bx: "62%",
    by: "52%",
    brot: "2deg",

    tokens: {
      "--accent": "#eaff8a",
      "--glow": "#b6ff2e",
      /* pale citrus cream */
      "--word": "rgba(242, 255, 214, 0.92)",
      "--word-edge": "rgba(248, 255, 232, 0.5)",
      /* forest → olive → vivid lime core */
      "--bg-edge": "#051102",
      "--bg-mid": "rgba(30, 66, 8, 0.8)",
      "--bg-glow": "rgba(186, 255, 74, 0.42)",
      "--key": "rgba(200, 255, 90, 0.4)",
      "--key-x": "64%",
      "--key-y": "32%",
    },

    bg: "/assets/bg-lemon.webp",
    bottle: "/assets/bottle-lemon.webp",
    bottleAlt: "A chilled bottle of PRIME Lemon Lime hydration drink",

    elements: [
      { plane: "back",  src: "/assets/splash-water.webp", water: true, x: "40%", y: "46%", w: 54, r: "168deg", dx: "-10px", dy: "-12px", dr: "4deg", dur: "19s", dly: "-3s", op: 0.34, blur: "5px" },
      { plane: "mid",   src: "/assets/splash-water.webp", water: true, x: "59%", y: "50%", w: 80, r: "-12deg", dx: "-10px", dy: "12px", dr: "4deg", dur: "17s", dly: "-2s", op: 0.85, blur: "0px" },
      { plane: "mid",   src: "/assets/lime-half.webp",   x: "39%", y: "63%", w: 13, r: "12deg", dx: "-8px", dy: "-12px", dr: "-8deg", dur: "13s", dly: "-3s" },
      { plane: "mid",   src: "/assets/leaf-c.webp",      x: "45%", y: "84%", w: 15, r: "-168deg", dx: "8px", dy: "-10px", dr: "5deg", dur: "15s", dly: "-5s", op: 0.9 },
      { plane: "front", src: "/assets/lemon-wedge.webp", x: "79%", y: "71%", w: 13, r: "-14deg", dx: "10px", dy: "-10px", dr: "7deg", dur: "14s", dly: "-7s" },
      { plane: "front", src: "/assets/ice-crystal.webp", x: "84%", y: "38%", w: 10, r: "10deg", dx: "-6px", dy: "9px", dr: "-6deg", dur: "12s", dly: "-1s", op: 0.8, blur: "2px" },
      { plane: "front", src: "/assets/leaf-c.webp", fg: true, x: "95%", y: "92%", w: 30, r: "26deg", dx: "-12px", dy: "-8px", dr: "-5deg", dur: "20s", dly: "-6s", op: 0.24, blur: "26px" },
    ],
  },
];

export const AUTOPLAY_MS = 8000;
