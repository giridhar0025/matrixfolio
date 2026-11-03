"use client";

import { useEffect, useState } from "react";
import { sectionIndex } from "@/lib/content";

export function SectionRail() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const sections = sectionIndex
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: [0, 0.2, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const activeItem =
    sectionIndex.find((item) => item.id === active) ?? sectionIndex[0];
  const totalSections = String(sectionIndex.length).padStart(2, "0");

  return (
    <aside className="section-rail" aria-label="Section index">
      <div className="rail-readout" aria-hidden="true">
        <span>{activeItem.index}</span>
        <span className="rail-readout-divider">/</span>
        <span>{totalSections}</span>
      </div>
      <div className="rail-line" aria-hidden="true" />
      <nav aria-label="Jump to section" className="rail-nav">
        {sectionIndex.map((item) => {
          const isActive = item.id === active;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rail-link${isActive ? " is-active" : ""}`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${item.index} — ${item.label}`}
            >
              <span className="rail-dot" aria-hidden="true" />
              <span className="rail-label">
                <span>{item.index}</span>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
      <span className="rail-caption" aria-hidden="true">
        SYSTEM INDEX
      </span>
    </aside>
  );
}
