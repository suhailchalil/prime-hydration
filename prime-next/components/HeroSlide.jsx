import AnimatedFlavorText from "./AnimatedFlavorText";
import HeroBottleScene from "./HeroBottleScene";
import HeroContent from "./HeroContent";

/**
 * One flavour slide.
 *
 * Every colour and every art-direction value comes from the custom properties
 * set on this element, so the same markup serves all three slides — including
 * the per-slide bottle position, scale and rotation (--bx --by --bh --brot).
 *
 * Hierarchy is fixed: the small label (BLUE / TROPICAL / LEMON) sits above the
 * giant word (RASPBERRY / PUNCH / LIME). Never the whole flavour name at size.
 */
export default function HeroSlide({ flavor, active }) {
  const vars = {
    ...flavor.tokens,
    "--bx": flavor.bx,
    "--by": flavor.by,
    "--bh": flavor.bh,
    "--brot": flavor.brot,
  };

  return (
    <section
      className={`slide${active ? " is-active" : ""}`}
      style={vars}
      aria-hidden={!active}
      aria-label={flavor.full}
    >
      {/* small label + its thin rule, above the giant word */}
      <p className="f-label enter-up" style={{ "--delay": "0.14s" }}>
        {flavor.label}
        <span className="sr-only"> {flavor.word}</span>
        <i aria-hidden="true" />
      </p>

      {/* giant word on its own plane (z 5) — behind the bottle */}
      <div className="layer z-[5]" style={{ "--depth": 3 }}>
        <AnimatedFlavorText
          word={flavor.word}
          em={flavor.em}
          track={flavor.track}
          delay="0.26s"
        />
      </div>

      <HeroBottleScene flavor={flavor} />

      <HeroContent flavor={flavor} />

      <p className="f-script" style={{ "--delay": "0.95s" }} aria-hidden="true">
        {flavor.script}
        {/* hand-drawn underline flourish, stroked on after the text lands */}
        <svg viewBox="0 0 260 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 9C46 3 108 1 168 4c34 2 62 5 90 6" />
        </svg>
      </p>

      <ul className="f-stack" aria-hidden="true">
        {flavor.stack.map((w, i) => (
          <li key={w} className="enter-up" style={{ "--delay": `${0.98 + i * 0.06}s` }}>
            {w}
          </li>
        ))}
      </ul>
    </section>
  );
}
