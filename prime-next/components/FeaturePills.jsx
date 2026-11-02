/** Three outline chips under the description. */

const FEATURES = [
  {
    label: "Hydration",
    // droplet
    icon: <path d="M12 3s6 6.4 6 10.4A6 6 0 0 1 6 13.4C6 9.4 12 3 12 3Z" />,
  },
  {
    label: "Electrolytes",
    // bolt
    icon: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />,
  },
  {
    label: "B Vitamins",
    // plus in a ring
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8.5v7M8.5 12h7" />
      </>
    ),
  },
];

export default function FeaturePills({ baseDelay = 0.62 }) {
  return (
    <ul className="flex flex-wrap gap-2.5 max-md:justify-center">
      {FEATURES.map((f, i) => (
        <li
          key={f.label}
          style={{ "--delay": `${baseDelay + i * 0.08}s` }}
          className="enter-up group flex h-[34px] items-center gap-2 rounded-full
                     border border-white/18 bg-white/[0.04] pl-3.5 pr-4
                     backdrop-blur-md
                     transition-[transform,background-color,border-color] duration-300
                     hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.1]"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[13px] w-[13px] shrink-0 fill-none stroke-[var(--accent)]
                       stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]
                       transition-transform duration-300 group-hover:scale-110"
          >
            {f.icon}
          </svg>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] whitespace-nowrap text-white/90">
            {f.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
