import { MagneticLink } from "@/components/magnetic-link";
import { Reveal } from "@/components/reveal";
import { choiceCopy } from "@/lib/content";

export function Choice() {
  return (
    <section
      id="choice"
      className="choice"
      aria-labelledby="choice-title"
      data-sim-intensity="0.74"
      data-sim-core="0.06"
    >
      <div className="choice-inner page-pad">
        <Reveal className="section-heading">
          <p className="section-label">
            <span>{choiceCopy.label}</span>
            <span className="section-label-rule" aria-hidden="true" />
          </p>
          <h2 id="choice-title" className="section-title choice-title">
            {choiceCopy.title}
          </h2>
          <p className="section-deck">{choiceCopy.description}</p>
        </Reveal>

        <div className="choice-grid">
          {choiceCopy.options.map((option, index) => (
            <Reveal key={option.id} delay={0.08 * index} className="choice-reveal">
              <MagneticLink
                href={option.action}
                className={`choice-option choice-option-${option.pill}`}
                strength={0.1}
              >
                <span className="choice-option-top">
                  <span className="choice-letter">{option.index}</span>
                  <span className="choice-pill" aria-hidden="true">
                    <span />
                  </span>
                  <span className="choice-arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
                <span className="choice-option-content">
                  <span className="choice-option-title">{option.title}</span>
                  <span className="choice-option-detail">{option.detail}</span>
                </span>
                <span className="choice-option-cta">
                  {option.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </MagneticLink>
            </Reveal>
          ))}
        </div>

        <Reveal className="choice-foot" delay={0.2}>
          <span>NO WRONG TURN</span>
          <span>BOTH PATHS ARE REVERSIBLE</span>
          <span>CHOOSE YOUR TIMELINE</span>
        </Reveal>
      </div>
    </section>
  );
}
