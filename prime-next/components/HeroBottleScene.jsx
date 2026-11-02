/**
 * The layered product scene for one flavour.
 *
 * Planes, following the project z-index ladder. `--depth` drives the mouse
 * parallax and is kept deliberately small — the effect should be almost
 * subconscious, never more than ~14px of travel.
 *
 *   z 0  / depth 2   background world, tonal grade, key light
 *   z 10 / depth 4   rear splash + halo — BEHIND the giant word (z 5)
 *   z 20 / depth 8   the bottle
 *   z 15 / depth 6   mid fruit, between word and bottle
 *   z 25 / depth 13  front splash, ice, droplets — near camera
 *
 * Splash on two planes is what lets the product penetrate the liquid rather
 * than sit in front of a flat PNG.
 */

/** One piece of scene art, positioned entirely from the flavour data. */
function SceneEl({ e, delay }) {
  return (
    <img
      src={e.src}
      alt=""
      className={[
        "el enter-el",
        e.splash && "el--splash",
        e.water && "el--water",
        e.fg && "el--fg",
      ].filter(Boolean).join(" ")}
      style={{
        "--x": e.x,
        "--y": e.y,
        "--w": `${e.w}vmin`,
        "--r": e.r,
        "--dx": e.dx,
        "--dy": e.dy,
        "--dr": e.dr,
        "--dur": e.dur,
        "--dly": e.dly,
        "--op": e.op ?? 1,
        "--blur": e.blur ?? "0px",
        "--delay": delay,
      }}
    />
  );
}

export default function HeroBottleScene({ flavor }) {
  const on = (plane) => flavor.elements.filter((e) => e.plane === plane);

  return (
    <>
      {/* ---------- background ---------- */}
      <div className="layer z-0" style={{ "--depth": 2 }}>
        <div className="world" style={{ backgroundImage: `url(${flavor.bg})` }} />
        <div className="grade" />
        <div className="keylight" />
      </div>

      {/* ---------- behind the word: halo + rear splash ---------- */}
      <div className="layer z-10" style={{ "--depth": 5 }}>
        <div className="halo" />
        {on("back").map((e, i) => (
          <SceneEl key={i} e={e} delay={`${0.52 + i * 0.06}s`} />
        ))}
      </div>

      {/* ---------- mid: fruit sitting between word and product ---------- */}
      <div className="layer z-[15]" style={{ "--depth": 6 }}>
        {on("mid").map((e, i) => (
          <SceneEl key={i} e={e} delay={`${0.46 + i * 0.07}s`} />
        ))}
      </div>

      {/* ---------- the product ---------- */}
      <div className="layer z-20" style={{ "--depth": 8 }}>
        <div className="bottle-wrap enter-bottle" style={{ "--delay": "0.3s" }}>
          <div className="bottle-float">
            <img
              src={flavor.bottle}
              alt={flavor.bottleAlt}
              width={698}
              height={1250}
              fetchPriority="high"
              className="bottle"
            />
          </div>
        </div>
      </div>

      {/* ---------- near camera ---------- */}
      <div className="layer z-[25]" style={{ "--depth": 10 }}>
        {on("front").map((e, i) => (
          <SceneEl key={i} e={e} delay={`${0.62 + i * 0.07}s`} />
        ))}
      </div>
    </>
  );
}
