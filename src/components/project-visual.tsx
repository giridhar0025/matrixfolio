import type { Project } from "@/lib/content";

export function ProjectVisual({ project }: { project: Project }) {
  if (project.visual === "kapwa") {
    return (
      <div className="project-visual pv-kapwa" aria-hidden="true">
        <div className="pv-chrome">
          <span className="pv-chrome-title">KAPWA // WORKSPACE</span>
          <span className="pv-chrome-status">LIVE</span>
        </div>
        <div className="pv-kapwa-layout">
          <div className="pv-sidebar">
            <span className="pv-sidebar-logo">K</span>
            <span className="pv-sidebar-line is-active" />
            <span className="pv-sidebar-line" />
            <span className="pv-sidebar-line" />
            <span className="pv-sidebar-line is-short" />
            <span className="pv-sidebar-line is-short" />
          </div>
          <div className="pv-kapwa-main">
            <div className="pv-panel-heading">
              <div>
                <span className="pv-micro">DECISION ROOM</span>
                <p>Q3 talent review</p>
              </div>
              <span className="pv-chip">17 PEOPLE</span>
            </div>
            <div className="pv-chart">
              <span className="pv-chart-line pv-chart-line-1" />
              <span className="pv-chart-line pv-chart-line-2" />
              <span className="pv-chart-line pv-chart-line-3" />
              <span className="pv-chart-area" />
              <div className="pv-bars">
                {[38, 56, 44, 72, 61, 88, 70, 94, 77, 84].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="pv-kapwa-foot">
              <div className="pv-agent-log">
                <span className="pv-micro">AGENT RUN / 14:32</span>
                <p>
                  <span className="pv-ok">✓</span> vendor decision synced
                </p>
                <p>
                  <span className="pv-ok">✓</span> profile permissions verified
                </p>
                <p>
                  <span className="pv-warn">→</span> awaiting human approval
                </p>
              </div>
              <div className="pv-health">
                <span className="pv-health-value">08</span>
                <span className="pv-micro">API MODULES GREEN</span>
                <div className="pv-health-dots">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (project.visual === "harness") {
    return (
      <div className="project-visual pv-harness" aria-hidden="true">
        <div className="pv-chrome">
          <span className="pv-chrome-title">AGENT HARNESS // TRACE</span>
          <span className="pv-chrome-status">ARMED</span>
        </div>
        <div className="pv-harness-layout">
          <div className="pv-harness-side">
            <span className="pv-micro">OPERATORS</span>
            <strong>40</strong>
            <span className="pv-harness-rule" />
            <span className="pv-micro">SERVERS</span>
            <div className="pv-server-list">
              <span>FIGMA</span>
              <span>BROWSER</span>
              <span>CONTEXT7</span>
            </div>
          </div>
          <div className="pv-trace">
            {[
              ["00.000", "spec", "parse acceptance criteria + constraints"],
              ["00.184", "mcp", "figma.get_design_context()"],
              ["00.391", "map", "resolve component boundaries"],
              ["00.663", "gen", "implement feature slice + tests"],
              ["01.204", "guard", "typecheck · playwright · a11y"],
            ].map(([time, tag, text]) => (
              <div className="pv-trace-line" key={time}>
                <span className="pv-trace-time">{time}</span>
                <span className={`pv-trace-tag tag-${tag}`}>{tag}</span>
                <span className="pv-trace-text">{text}</span>
              </div>
            ))}
            <div className="pv-flow">
              <span>SPEC</span>
              <i>→</i>
              <span>CONTEXT</span>
              <i>→</i>
              <span>HARNESS</span>
              <i>→</i>
              <span>VERIFY</span>
            </div>
            <div className="pv-harness-approval">
              <span className="pv-status-dot" />
              <span>HUMAN APPROVAL REQUIRED</span>
              <span className="pv-blink">_</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (project.visual === "luminate") {
    return (
      <div className="project-visual pv-luminate" aria-hidden="true">
        <div className="pv-chrome">
          <span className="pv-chrome-title">LUMINATE // CONTROL TOWER</span>
          <span className="pv-chrome-status">SYNCED</span>
        </div>
        <div className="pv-luminate-body">
          <div className="pv-kpi-row">
            {[
              ["04", "SITES", "12.4%"],
              ["92.1", "FILL RATE", "+4.8%"],
              ["18.7", "LEAD TIME", "-2.1d"],
            ].map(([value, label, delta]) => (
              <div className="pv-kpi" key={label}>
                <span className="pv-kpi-label">{label}</span>
                <span className="pv-kpi-value">{value}</span>
                <span className="pv-kpi-delta">{delta}</span>
              </div>
            ))}
          </div>
          <div className="pv-main-chart">
            <div className="pv-chart-heading">
              <span className="pv-micro">SEQUENCING RULES / THROUGHPUT</span>
              <span className="pv-chip">LIVE MODEL</span>
            </div>
            <svg viewBox="0 0 520 170" role="presentation">
              <defs>
                <linearGradient id="luminate-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g className="pv-chart-grid">
                <path d="M0 34H520M0 84H520M0 134H520" />
                <path d="M86 0V170M172 0V170M258 0V170M344 0V170M430 0V170" />
              </g>
              <path
                className="pv-chart-fill"
                d="M0 132 C45 128, 66 102, 105 108 S166 137, 206 108 S266 78, 303 88 S360 52, 400 57 S470 18, 520 28 L520 170 L0 170 Z"
                fill="url(#luminate-area)"
              />
              <path
                className="pv-line"
                d="M0 132 C45 128, 66 102, 105 108 S166 137, 206 108 S266 78, 303 88 S360 52, 400 57 S470 18, 520 28"
              />
              <circle cx="400" cy="57" r="4" className="pv-chart-dot" />
            </svg>
            <div className="pv-chart-axis">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
            </div>
          </div>
          <div className="pv-luminate-foot">
            <span>
              <i className="pv-status-dot" /> MULTI-KPI COMPONENT
            </span>
            <span>REUSED BY 4+ TEAMS</span>
            <span>0 CRITICAL DEFECTS</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual pv-revcdi" aria-hidden="true">
      <div className="pv-chrome">
        <span className="pv-chrome-title">REVCDI // TASK QUEUE</span>
        <span className="pv-chrome-status">PROCESSING</span>
      </div>
      <div className="pv-revcdi-body">
        <div className="pv-queue-header">
          <div>
            <span className="pv-micro">CLINICAL DOCUMENTATION</span>
            <p>Review queue</p>
          </div>
          <span className="pv-chip">OWNED E2E</span>
        </div>
        <div className="pv-queue">
          {[
            ["CDI-0891", "Quality review", "In review", "92"],
            ["CDI-0892", "Physician query", "Queued", "68"],
            ["CDI-0893", "Coding validation", "Complete", "100"],
            ["CDI-0894", "Compliance pass", "Complete", "100"],
            ["CDI-0895", "Query response", "In review", "86"],
          ].map(([id, task, status, progress]) => (
            <div className="pv-queue-row" key={id}>
              <span className="pv-queue-id">{id}</span>
              <span className="pv-queue-task">{task}</span>
              <span className="pv-queue-bar">
                <i style={{ width: `${progress}%` }} />
              </span>
              <span
                className={`pv-queue-status${
                  status === "Complete" ? " is-complete" : ""
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="pv-revcdi-foot">
          <div className="pv-ring">
            <svg viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" className="pv-ring-track" />
              <circle cx="36" cy="36" r="30" className="pv-ring-value" />
            </svg>
            <span>+30%</span>
          </div>
          <p>
            <span className="pv-micro">PROCESSING EFFICIENCY</span>
            Task-queue module redesigned and owned end-to-end.
          </p>
          <div className="pv-revcdi-stats">
            <span>
              <strong>15+</strong> FEATURES
            </span>
            <span>
              <strong>01</strong> MODULE OWNER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
