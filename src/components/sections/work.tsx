import { MagneticLink } from "@/components/magnetic-link";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/content";

export function Work() {
  return (
    <section
      id="work"
      className="work-section"
      aria-labelledby="work-title"
      data-sim-intensity="0.32"
      data-sim-core="0.08"
    >
      <div className="work-sticky">
        <div className="work-heading page-pad">
          <Reveal className="work-heading-main">
            <p className="section-label">
              <span>05 / Transmissions</span>
              <span className="section-label-rule" aria-hidden="true" />
            </p>
            <h2 id="work-title" className="section-title work-title">
              Selected work. <span className="title-dim">Real constraints.</span>
            </h2>
          </Reveal>
          <Reveal className="work-heading-meta" delay={0.1}>
            <p>
              Four systems. No concept redesigns. Every detail below shipped
              under a real deadline.
            </p>
            <a href="#channel" className="text-link">
              Request full dossiers <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>

        <div className="work-viewport">
          <div className="work-track" id="work-track">
            {projects.map((project) => (
              <article
                className={`project-card project-card-${project.visual}`}
                key={project.slug}
                aria-labelledby={`project-${project.slug}-title`}
              >
                <header className="project-card-top">
                  <span className="project-index">{project.index}</span>
                  <span className="project-domain">{project.domain}</span>
                  <span className="project-status">
                    <span className="status-dot" aria-hidden="true" />
                    {project.status}
                  </span>
                </header>

                <div className="project-card-main">
                  <ProjectVisual project={project} />
                  <div className="project-copy">
                    <div className="project-title-row">
                      <h3
                        id={`project-${project.slug}-title`}
                        className="project-title"
                      >
                        {project.name}
                      </h3>
                      <span className="project-product">{project.product}</span>
                    </div>
                    <p className="project-role">
                      {project.role}
                      <span aria-hidden="true"> / </span>
                      {project.period}
                    </p>
                    <p className="project-summary">{project.summary}</p>
                    <ul className="project-notes">
                      {project.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                    <dl className="project-metrics">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dt>{metric.value}</dt>
                          <dd>{metric.label}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="tag-list" aria-label="Technology stack">
                      {project.stack.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}

            <article className="work-outro-card">
              <span className="work-outro-index">T-05 / OPEN FILE</span>
              <div className="work-outro-center">
                <p className="work-outro-eyebrow">THE ARCHIVE CONTINUES</p>
                <h3>
                  Your system
                  <br />
                  could be next.
                </h3>
                <p>
                  The case studies here are compressed. The thinking, tradeoffs,
                  and failures are available in conversation.
                </p>
                <MagneticLink href="#channel" className="button button-primary">
                  Open a channel <span aria-hidden="true">→</span>
                </MagneticLink>
              </div>
              <span className="work-outro-meta">END OF TRANSMISSION SET</span>
            </article>
          </div>
        </div>

        <div className="work-foot page-pad">
          <span className="work-instruction">
            <span className="work-instruction-arrow" aria-hidden="true">
              ⟶
            </span>
            SCROLL TO ADVANCE
          </span>
          <div className="work-progress" aria-hidden="true">
            <span className="work-progress-fill" />
          </div>
          <span className="work-count">04 TRANSMISSIONS</span>
        </div>
      </div>
    </section>
  );
}
