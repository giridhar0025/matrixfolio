"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { bootLines } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const STORAGE_KEY = "matrixfolio:booted";

export function BootSequence() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadyBooted = false;
    }

    if (reduceMotion || alreadyBooted) {
      setVisible(false);
      return;
    }

    const start = window.setTimeout(() => setProgress(1), 80);
    const finish = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Session storage can be unavailable in privacy modes.
      }
      setVisible(false);
    }, 1750);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(finish);
    };
  }, [reduceMotion]);

  const skip = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Session storage can be unavailable in privacy modes.
    }
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Session storage can be unavailable in privacy modes.
      }
      setVisible(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="boot-overlay"
          role="dialog"
          aria-label="System boot sequence"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: reduceMotion ? 0 : 0.55, ease: "easeInOut" },
          }}
        >
          <div className="boot-noise" aria-hidden="true" />
          <div className="boot-topline">
            <span>CONSTRUCT://BOOT</span>
            <span>REV 0.9.7</span>
          </div>
          <div className="boot-content">
            <div className="boot-sigil" aria-hidden="true">
              <span>PG</span>
              <span>///</span>
            </div>
            <div className="boot-terminal">
              {bootLines.map((line, index) => (
                <motion.p
                  key={line.text}
                  className="boot-line"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.1 + index * 0.14,
                    duration: 0.2,
                  }}
                >
                  <span className="boot-prompt">{line.prompt}</span>
                  <span>{line.text}</span>
                </motion.p>
              ))}
              <div className="boot-progress" aria-hidden="true">
                <span
                  className="boot-progress-fill"
                  style={{
                    transform: `scaleX(${progress})`,
                    transitionDuration: reduceMotion ? "0ms" : "1300ms",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="boot-footer">
            <span>AGENT-ASSISTED BUILD // HUMAN-REVIEWED</span>
            <button type="button" onClick={skip} className="boot-skip">
              Skip boot [ESC]
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
