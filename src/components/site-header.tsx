"use client";

import { useEffect, useRef, useState } from "react";
import { identity, navItems } from "@/lib/content";

type SiteHeaderProps = {
  onOpenCommand: () => void;
};

export function SiteHeader({ onOpenCommand }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const lastScrolled = useRef(false);

  useEffect(() => {
    const update = () => {
      const next = window.scrollY > 24;
      if (next !== lastScrolled.current) {
        lastScrolled.current = next;
        setScrolled(next);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="scroll-progress" aria-hidden="true" />
      <a href="#top" className="brand">
        <span className="brand-mark" aria-hidden="true">
          PG
        </span>
        <span className="brand-text">
          <span>Pulichara</span>
          <span>Giridhar</span>
        </span>
        <span className="sr-only">— home</span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="nav-link">
            <span className="nav-index">{item.index}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <span className="availability">
          <span className="availability-dot" aria-hidden="true" />
          {identity.availability}
        </span>
        <button
          type="button"
          className="command-trigger"
          onClick={onOpenCommand}
        >
          <span className="sr-only">Open command shell</span>
          <span className="command-glyph" aria-hidden="true">
            ⌘
          </span>
          <span className="command-key" aria-hidden="true">
            K
          </span>
        </button>
      </div>
    </header>
  );
}
