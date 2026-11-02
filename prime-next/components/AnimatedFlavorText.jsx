/**
 * The giant flavour word.
 *
 * Clean, oversized editorial typography — solid flavour-tinted colour with a
 * hairline edge and a soft glow. There is deliberately **no image inside the
 * letters**: no background-clip, no texture, no photo masked into the type.
 * The word is a canvas the product sits in front of, not competition for it.
 *
 * Two copies share one grid cell:
 *   .fw--behind  a heavily blurred dark copy, purely for separation
 *   .fw--main    the type itself
 *
 * Sizing comes from the flavour data: `em` is the word's measured width in em,
 * so CSS sizes it as `92vw / em`. A long word therefore renders smaller than a
 * short one, which is what keeps their horizontal mass comparable.
 */
export default function AnimatedFlavorText({ word, em, track, delay = "0.26s" }) {
  return (
    <div
      className="fw-wrap enter-word"
      style={{ "--em": em, "--track": track, "--delay": delay }}
    >
      <span className="fw fw--behind" aria-hidden="true">
        {word}
      </span>

      {/* aria-hidden: the flavour name is already announced by the label and
          the bottle's alt text — this copy is a visual treatment */}
      <span className="fw fw--main" aria-hidden="true">
        {word}
      </span>
    </div>
  );
}
