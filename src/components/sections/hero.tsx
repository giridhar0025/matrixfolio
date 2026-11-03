import { MagneticLink } from "@/components/magnetic-link";
import { heroCopy, identity } from "@/lib/content";

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-inner page-pad">
        <div className="hero-topline">
          <span className="hero-eyebrow">{heroCopy.eyebrow}</span>
          <span className="hero-live">
            <span className="status-dot" aria-hidden="true" />
            {heroCopy.status}
          </span>
        </div>

        <div className="hero-title-block">
          <p className="hero-kicker">
            Operator ID / 047 <span>—</span> Hyderabad, IN
          </p>

          <h1 id="hero-title" className="hero-name">
            <span
              className="glitch-line hero-name-line"
              data-text={identity.firstName.toUpperCase()}
            >
              {identity.firstName.toUpperCase()}
            </span>
            <span
              className="glitch-line hero-name-line hero-name-outline"
              data-text={identity.lastName.toUpperCase()}
            >
              {identity.lastName.toUpperCase()}
            </span>
          </h1>

          <div className="hero-role">
            <span>{identity.role}</span>
            <span className="hero-role-separator">//</span>
            <span>{identity.positioning}</span>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-summary">
            <p>{heroCopy.summary}</p>
            <div className="hero-actions">
              <MagneticLink href="#work" className="button button-primary">
                <span>Enter the work</span>
                <span className="button-arrow" aria-hidden="true">
                  ↓
                </span>
              </MagneticLink>
              <a
                href={identity.resume}
                className="text-link"
                download="Pulichara-Giridhar-Resume.pdf"
              >
                Download resume <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="hero-side-meta" aria-label="Portfolio details">
            <div className="meta-line">
              <span>BASE</span>
              <span>17.3850° N / 78.4867° E</span>
            </div>
            <div className="meta-line">
              <span>BUILD</span>
              <span>NEXT / THREE / GSAP</span>
            </div>
            <div className="meta-line">
              <span>MODE</span>
              <span className="meta-accent">HUMAN-IN-THE-LOOP</span>
            </div>
          </div>

          <a href="#choice" className="scroll-cue">
            <span className="scroll-cue-line" aria-hidden="true" />
            <span>{heroCopy.scrollHint}</span>
            <span className="scroll-cue-index" aria-hidden="true">
              02
            </span>
          </a>
        </div>
      </div>

      <div className="hero-side-label" aria-hidden="true">
        SIMULATION / INSPECTABLE
      </div>
    </section>
  );
}
