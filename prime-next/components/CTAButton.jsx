/** White pill CTA — fixed premium pill, restrained hover: slight scale, arrow
  * shifts, shadow deepens. Nothing showier than that. */

export default function CTAButton({ href = "#", children = "Buy Now", delay = "0.88s" }) {
  return (
    <a
      href={href}
      style={{ "--delay": delay }}
      className="enter-up group relative inline-flex h-[54px] w-[176px] items-center
                 justify-center gap-3 overflow-hidden rounded-full bg-white
                 text-[12.5px] font-bold uppercase tracking-[0.16em] text-[#07101f]
                 shadow-[0_16px_34px_rgba(0,0,0,0.32)]
                 transition-[transform,box-shadow] duration-500 ease-[var(--ease-lux)]
                 hover:scale-[1.02] hover:shadow-[0_20px_42px_rgba(0,0,0,0.4)]"
    >
      {children}

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-[18px] w-[18px] fill-none stroke-current stroke-2
                   [stroke-linecap:round] [stroke-linejoin:round]
                   transition-transform duration-400 ease-[var(--ease-lux)]
                   group-hover:translate-x-1"
      >
        <path d="M5 12h13" />
        <path d="m12.5 6 6 6-6 6" />
      </svg>

    </a>
  );
}
