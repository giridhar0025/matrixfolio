import { identity, navItems, exitCopy } from "@/lib/content";

export function Exit() {
  return (
    <footer
      id="exit"
      className="site-footer"
      aria-labelledby="exit-title"
      data-sim-intensity="0.8"
      data-sim-core="0.12"
    >
      <div className="exit-inner page-pad">
        <div className="exit-top">
          <p className="section-label">
            <span>{exitCopy.label}</span>
            <span className="section-label-rule" aria-hidden="true" />
          </p>
          <a href="#hero" className="back-to-top">
            Return to source <span aria-hidden="true">↑</span>
          </a>
        </div>

        <div className="exit-main">
          <p className="exit-status">
            <span className="status-dot" aria-hidden="true" />
            SIMULATION STATUS: ONLINE
          </p>
          <h2 id="exit-title" className="exit-title">
            {exitCopy.title}
          </h2>
          <p className="exit-note">{exitCopy.note}</p>
        </div>

        <div className="exit-bottom">
          <div className="exit-signature">
            <span className="exit-mark" aria-hidden="true">
              PG
            </span>
            <div>
              <p>{identity.name}</p>
              <p>{identity.role} / {identity.positioning}</p>
            </div>
          </div>

          <nav className="exit-nav" aria-label="Footer navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href={`mailto:${identity.email}`}>Email</a>
          </nav>

          <div className="exit-legal">
            <p>© 2026 — NO SPOON LICENSE</p>
            <p>{exitCopy.built}</p>
            <p className="exit-build-meta">
              NEXT / THREE / GSAP / MOTION / LENIS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
