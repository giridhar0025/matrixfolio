"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { protocol } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function Protocol() {
  const reduceMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string>(protocol.capabilities[0].id);
  const tabsId = useId();
  const activeIndex = Math.max(
    0,
    protocol.capabilities.findIndex(
      (capability) => capability.id === activeId,
    ),
  );
  const activeCapability =
    protocol.capabilities[activeIndex] ?? protocol.capabilities[0];
  const totalModules = protocol.capabilities.reduce(
    (total, capability) => total + capability.items.length,
    0,
  );

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-cap-tab]"),
    );
    const focusedTab =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>("[data-cap-tab]")
        : null;
    const currentIndex = buttons.findIndex(
      (button) =>
        button === focusedTab ||
        (!focusedTab && button.dataset.capTab === activeId),
    );
    let nextIndex = currentIndex < 0 ? 0 : currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (nextIndex + 1) % buttons.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (nextIndex - 1 + buttons.length) % buttons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = buttons.length - 1;
    }

    const nextButton = buttons[nextIndex];
    const nextId = nextButton?.dataset.capTab;
    if (nextButton && nextId) {
      nextButton.focus();
      setActiveId(nextId);
    }
  };

  return (
    <section
      id="protocol"
      className="protocol"
      aria-labelledby="protocol-title"
      data-sim-intensity="0.2"
      data-sim-core="0.1"
    >
      <div className="protocol-inner page-pad">
        <Reveal className="protocol-heading section-heading">
          <p className="section-label">
            <span>{protocol.label}</span>
            <span className="section-label-rule" aria-hidden="true" />
          </p>
          <h2 id="protocol-title" className="section-title protocol-title">
            I don't just use AI.
            <br />
            <span className="title-accent">I build the system around it.</span>
          </h2>
          <p className="section-deck protocol-deck">{protocol.description}</p>
        </Reveal>

        <div className="protocol-grid">
          <Reveal className="protocol-aside">
            <div className="protocol-stats">
              {protocol.stats.map((stat) => (
                <div className="protocol-stat" key={stat.label}>
                  <span className="protocol-stat-value">{stat.value}</span>
                  <span className="protocol-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
            <div className="protocol-principle">
              <span className="protocol-principle-mark" aria-hidden="true">
                !//
              </span>
              <p>{protocol.principle}</p>
            </div>
            <p className="protocol-aside-note">
              The point is not to remove engineers from the loop. It is to remove
              the distance between intent and a verified implementation.
            </p>
          </Reveal>

          <Reveal className="protocol-terminal-wrap" delay={0.12}>
            <div className="protocol-terminal">
              <div className="terminal-chrome">
                <span className="terminal-title">AGENT TRACE / HUMAN SUPERVISED</span>
                <span className="terminal-status">
                  <span className="status-dot" aria-hidden="true" />
                  LIVE
                </span>
              </div>
              <div className="terminal-body">
                <div className="terminal-command">
                  <span aria-hidden="true">&gt;</span>
                  run delivery.harness --spec feature.md --verify
                </div>
                <div className="terminal-trace">
                  {protocol.trace.map((line) => (
                    <div className="trace-line" key={line.time}>
                      <span className="trace-time">{line.time}</span>
                      <span className="trace-tag">{line.tag}</span>
                      <span className="trace-text">{line.text}</span>
                    </div>
                  ))}
                </div>
                <div className="terminal-result">
                  <span className="terminal-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>PROPOSAL READY FOR HUMAN REVIEW</span>
                  <span className="terminal-cursor" aria-hidden="true">
                    _
                  </span>
                </div>
              </div>
              <div className="terminal-footer">
                <span>MODEL: CONTEXT-BOUND</span>
                <span>PERMISSIONS: LEAST PRIVILEGE</span>
                <span>MERGES: HUMAN</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="protocol-workflow">
          {protocol.workflow.map((step, index) => (
            <Reveal
              className="workflow-step"
              key={step.key}
              delay={index * 0.07}
            >
              <div className="workflow-step-top">
                <span className="workflow-number">{step.step}</span>
                <span className="workflow-key">{step.key}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <span className="workflow-line" aria-hidden="true" />
            </Reveal>
          ))}
        </div>

        <div className="capabilities">
          <div className="capabilities-heading">
            <div className="capabilities-heading-main">
              <p className="section-label">
                <span>Capability stack</span>
                <span className="section-label-rule" aria-hidden="true" />
              </p>
              <p className="capabilities-kicker">
                Four layers. One delivery system.
              </p>
            </div>
            <p className="capabilities-subtitle">
              An inspector for the tools behind the work. Select a layer.
            </p>
          </div>

          <div className="capability-console">
            <div className="capability-console-bar">
              <span className="capability-console-title">
                <span aria-hidden="true">//</span> Stack inspector / 04 layers
              </span>
              <span className="capability-console-signal">
                <span className="status-dot" aria-hidden="true" />
                Live surface
              </span>
            </div>

            <div className="capability-console-body">
              <div
                className="capability-rail"
                role="tablist"
                aria-label="Capability layers"
                aria-orientation="vertical"
                onKeyDown={onTabKeyDown}
              >
                {protocol.capabilities.map((capability, index) => {
                  const isActive = capability.id === activeId;
                  return (
                    <button
                      key={capability.id}
                      type="button"
                      role="tab"
                      id={`${tabsId}-tab-${capability.id}`}
                      aria-selected={isActive}
                      aria-controls={`${tabsId}-panel-${capability.id}`}
                      tabIndex={isActive ? 0 : -1}
                      data-cap-tab={capability.id}
                      className={`capability-tab${isActive ? " is-active" : ""}`}
                      onClick={() => setActiveId(capability.id)}
                    >
                      <span className="capability-tab-index">
                        0{index + 1}
                      </span>
                      <span className="capability-tab-copy">
                        <span className="capability-tab-role">
                          {capability.role}
                        </span>
                        <span className="capability-tab-label">
                          {capability.label}
                        </span>
                        <span className="capability-tab-meta">
                          {String(capability.items.length).padStart(2, "0")}{" "}
                          modules
                        </span>
                      </span>
                      <span className="capability-tab-rail" aria-hidden="true">
                        <span />
                      </span>
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={activeCapability.id}
                className="capability-panel"
                role="tabpanel"
                tabIndex={0}
                id={`${tabsId}-panel-${activeCapability.id}`}
                aria-labelledby={`${tabsId}-tab-${activeCapability.id}`}
                initial={reduceMotion ? false : { opacity: 0.3, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="capability-panel-top">
                  <span className="capability-command">
                    <span aria-hidden="true">$</span>{" "}
                    {activeCapability.command}
                  </span>
                  <span className="capability-layer-count">
                    LAYER <b>0{activeIndex + 1}</b> / 04
                  </span>
                </div>

                <div className="capability-panel-body">
                  <div className="capability-summary">
                    <span
                      className="capability-watermark"
                      aria-hidden="true"
                    >
                      0{activeIndex + 1}
                    </span>
                    <h3>{activeCapability.label}</h3>
                    <p>{activeCapability.summary}</p>
                    <div className="capability-summary-meta">
                      <span>{activeCapability.role}</span>
                      <span>{activeCapability.items.length} modules</span>
                    </div>
                  </div>

                  <div className="capability-modules">
                    <div className="capability-modules-head">
                      <span>Module map</span>
                      <span>
                        {String(activeCapability.items.length).padStart(2, "0")}{" "}
                        tracked
                      </span>
                    </div>
                    <ul className="capability-items">
                      {activeCapability.items.map((item, itemIndex) => (
                        <li key={item}>
                          <span className="capability-item-index">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="capability-evidence">
                  <div className="capability-evidence-label">
                    <span aria-hidden="true">↳</span>
                    <span>Field evidence</span>
                  </div>
                  <p>{activeCapability.evidence}</p>
                  <div className="capability-evidence-meta">
                    <span>
                      <i aria-hidden="true" />
                      Verified in practice
                    </span>
                    <span>Status // active</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="capability-console-foot">
              <span>04 layers</span>
              <span>{totalModules} tracked modules</span>
              <span>Human-verified delivery</span>
            </div>
          </div>
        </div>

        <Reveal className="protocol-build-note">
          <span className="protocol-build-note-label">ABOUT THIS BUILD</span>
          <p>
            This site is a human-directed, agent-assisted build: research and
            architecture, a custom WebGL scene, the scroll choreography, and the
            accessibility pass were developed through an iterative AI workflow —
            then verified in a real browser.
          </p>
          <div className="protocol-build-stack">
            <span>NEXT 16</span>
            <span>THREE.JS</span>
            <span>GSAP</span>
            <span>MOTION</span>
            <span>LENIS</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
