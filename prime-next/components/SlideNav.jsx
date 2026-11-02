"use client";

/**
 * Centre-bottom slide bar: prev arrow, three dots, next arrow.
 * The active dot doubles as the autoplay progress bar — its fill is a CSS
 * animation timed by --autoplay, which HeroSection keeps in sync with its
 * own timer.
 */
export default function SlideNav({ flavors, index, onGo, onPrev, onNext, autoplayMs }) {
  return (
    <>
      <div className="nav-bar" style={{ "--autoplay": `${autoplayMs}ms` }}>
        <button type="button" className="nav-arrow" onClick={onPrev} aria-label="Previous flavour">
          <svg viewBox="0 0 24 24" aria-hidden="true"
               className="h-5 w-5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="nav-dots" role="tablist" aria-label="Choose flavour">
          {flavors.map((f, i) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={f.full}
              className={`nav-dot${i === index ? " is-on" : ""}`}
              onClick={() => onGo(i)}
            >
              {/* remounted per slide change so the fill animation restarts */}
              <i key={`${f.id}-${index}`} />
            </button>
          ))}
        </div>

        <button type="button" className="nav-arrow" onClick={onNext} aria-label="Next flavour">
          <svg viewBox="0 0 24 24" aria-hidden="true"
               className="h-5 w-5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <p className="nav-count" aria-hidden="true">
        <b>{String(index + 1).padStart(2, "0")}</b>
        <i />
        {String(flavors.length).padStart(2, "0")}
      </p>
    </>
  );
}
