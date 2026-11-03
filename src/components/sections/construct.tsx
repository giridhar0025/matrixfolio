import { ConstructScene } from "@/components/construct-scene";
import { construct } from "@/lib/content";

export function Construct() {
  return (
    <section
      id="construct"
      className="construct"
      aria-label="The Construct"
      data-phase="construct"
      data-sim-intensity="0.4"
      data-sim-core="0.08"
    >
      <div className="construct-sticky">
        <div className="construct-visual" aria-hidden="true">
          <div className="construct-frame">
            <div className="construct-fallback" />
            <ConstructScene />
          </div>
          <div className="construct-tint" />
          <div className="construct-grade" />
          <div className="construct-glitch" />
          <div className="construct-scanlines" />
        </div>

        <div className="construct-inner page-pad">
          <header className="construct-top">
            <p className="section-label">
              <span>{construct.label}</span>
              <span className="section-label-rule" aria-hidden="true" />
            </p>
            <span className="construct-mode">
              {construct.mode}
              <span className="construct-status" data-construct-status>
                Environment load
              </span>
            </span>
            <span className="construct-hint">
              {construct.hint}
              <span aria-hidden="true">↓</span>
            </span>
          </header>

          <div className="construct-stage">
            <span className="construct-ghost-index" aria-hidden="true">
              04
            </span>

            <div className="construct-panels">
              {construct.panels.map((panel) => (
                <article
                  className={`construct-panel construct-panel-${panel.id}`}
                  data-construct-panel={panel.id}
                  data-panel-status={panel.status}
                  key={panel.id}
                >
                  <p className="construct-index">
                    <span>{panel.index}</span>
                    {panel.key}
                  </p>
                  <p className="construct-kicker">{panel.kicker}</p>
                  <h2 className="construct-title">{panel.title}</h2>
                  <p className="construct-body">{panel.body}</p>
                  <p className="construct-detail">{panel.detail}</p>
                </article>
              ))}
            </div>

            <aside className="construct-readout" aria-hidden="true">
              <span className="construct-readout-label">SIM RATE</span>
              <span className="construct-rate" data-construct-rate>
                1.000×
              </span>
              <span className="construct-readout-rule" />
              <span className="construct-readout-label">OBSERVER</span>
              <span className="construct-observer" data-construct-observer>
                ACTIVE
              </span>
            </aside>
          </div>

          <footer className="construct-bottom">
            <div className="construct-timeline" aria-hidden="true">
              <span className="construct-track">
                <span className="construct-track-fill" />
              </span>
              <span className="construct-timeline-ticks">
                {construct.panels.map((panel) => (
                  <span data-construct-node={panel.id} key={panel.id} />
                ))}
              </span>
            </div>

            <div className="construct-phases" aria-hidden="true">
              {construct.panels.map((panel) => (
                <span data-construct-phase={panel.id} key={panel.id}>
                  <span>{panel.index}</span>
                  {panel.key}
                </span>
              ))}
            </div>

            <p className="construct-closing">{construct.closing}</p>
          </footer>
        </div>
      </div>
    </section>
  );
}
