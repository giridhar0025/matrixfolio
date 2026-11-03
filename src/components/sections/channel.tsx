"use client";

import { useState } from "react";
import { MagneticLink } from "@/components/magnetic-link";
import { Reveal } from "@/components/reveal";
import { channel, identity } from "@/lib/content";

export function Channel() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  };

  return (
    <section
      id="channel"
      className="channel"
      aria-labelledby="channel-title"
      data-sim-intensity="0.72"
      data-sim-core="0.18"
    >
      <div className="channel-inner page-pad">
        <Reveal className="channel-top">
          <p className="section-label">
            <span>{channel.label}</span>
            <span className="section-label-rule" aria-hidden="true" />
          </p>
          <span className="channel-response">
            <span className="status-dot" aria-hidden="true" />
            {channel.responseTime}
          </span>
        </Reveal>

        <div className="channel-main">
          <Reveal>
            <p className="channel-kicker">{channel.kicker}</p>
            <h2 id="channel-title" className="channel-title">
              Let's build
              <br />
              something that <span className="title-accent">ships.</span>
            </h2>
            <p className="channel-body">{channel.body}</p>
          </Reveal>

          <Reveal className="channel-contact" delay={0.12}>
            <div className="channel-email-row">
              <MagneticLink
                href={`mailto:${identity.email}`}
                className="channel-email"
                strength={0.12}
              >
                {identity.email}
                <span className="channel-email-arrow" aria-hidden="true">
                  ↗
                </span>
              </MagneticLink>
              <button type="button" className="copy-button" onClick={copyEmail}>
                <span className={`copy-dot${copied ? " is-copied" : ""}`} />
                {copied ? "COPIED" : "COPY EMAIL"}
              </button>
            </div>

            <div className="channel-meta">
              <span>{channel.location}</span>
              <span>OPEN TO PRODUCTS, PLATFORMS, AND AMBITIOUS INTERFACES</span>
            </div>

            <div className="channel-links">
              <a href={identity.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href={identity.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                href={identity.resume}
                download="Pulichara-Giridhar-Resume.pdf"
              >
                Resume <span aria-hidden="true">↓</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="channel-marquee" aria-hidden="true">
          <div className="channel-marquee-track">
            <span>OPEN A CHANNEL</span>
            <span>•</span>
            <span>OPEN A CHANNEL</span>
            <span>•</span>
            <span>OPEN A CHANNEL</span>
            <span>•</span>
            <span>OPEN A CHANNEL</span>
            <span>•</span>
          </div>
        </div>
      </div>
    </section>
  );
}
