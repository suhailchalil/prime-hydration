/**
 * Floating top bar: wordmark left, circular icon buttons right.
 * Deliberately no nav links — the hero carries the page on its own.
 */

function IconButton({ label, delay, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{ "--delay": delay }}
      className="enter-down group grid h-[46px] w-[46px] place-items-center rounded-full
                 border border-white/30 bg-transparent backdrop-blur-md
                 transition-[transform,background-color,border-color,box-shadow] duration-300
                 hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/10"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.6]
                   [stroke-linecap:round] [stroke-linejoin:round]
                   transition-colors duration-300 group-hover:stroke-[var(--color-ice)]"
      >
        {children}
      </svg>
    </button>
  );
}

export default function HeroHeader() {
  return (
    <header
      className="absolute inset-x-0 top-0 z-50 flex items-center justify-between
                 px-[clamp(20px,5.2vw,84px)] py-[clamp(18px,2.4vw,30px)]"
    >
      <a
        href="#"
        aria-label="PRIME home"
        style={{ "--delay": "0.1s" }}
        className="brand enter-down font-[family-name:var(--font-display)]
                   text-[clamp(22px,2vw,30px)] uppercase leading-none tracking-[0.06em]
                   drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]
                   transition-opacity duration-300 hover:opacity-80"
      >
        Prime
      </a>

      <div className="flex gap-2.5">
        <IconButton label="Search" delay="0.24s">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </IconButton>
        <IconButton label="Bag, 0 items" delay="0.34s">
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
        </IconButton>
      </div>
    </header>
  );
}
