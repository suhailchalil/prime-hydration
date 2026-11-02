import FeaturePills from "./FeaturePills";
import CTAButton from "./CTAButton";

/**
 * The copy block — lower-left, beneath the giant word so the two never
 * compete for the same space.
 */
export default function HeroContent({ flavor }) {
  return (
    <div className="f-copy">
      <h2 className="f-headline enter-up" style={{ "--delay": "0.56s" }}>
        {flavor.headline}
      </h2>

      <p className="f-desc enter-up" style={{ "--delay": "0.64s" }}>
        {flavor.desc}
      </p>

      <div className="enter-up mt-[clamp(18px,2vw,26px)]" style={{ "--delay": "0.72s" }}>
        <FeaturePills baseDelay={0.76} />
      </div>

      <div className="mt-[clamp(20px,2.2vw,30px)]">
        <CTAButton delay="0.94s">Buy Now</CTAButton>
      </div>
    </div>
  );
}
