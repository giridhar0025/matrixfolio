"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  commandHelp,
  identity,
  sectionIndex,
} from "@/lib/content";

type FeedEntry = {
  id: number;
  command?: string;
  output: string;
};

type CommandShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialFeed: FeedEntry[] = [
  {
    id: 0,
    output:
      "SIMULATION SHELL // v0.9.7\nOperator session established. Type `help` to inspect available commands.",
  },
];

export function CommandShell({ open, onOpenChange }: CommandShellProps) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");
  const [feed, setFeed] = useState<FeedEntry[]>(initialFeed);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const idRef = useRef(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.dispatchEvent(
      new CustomEvent("folio:lock-scroll", { detail: { locked: true } }),
    );
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 40);

    return () => {
      document.documentElement.style.overflow = overflow;
      window.clearTimeout(focusTimer);
      previousFocus.current?.focus?.();
      window.dispatchEvent(
        new CustomEvent("folio:lock-scroll", { detail: { locked: false } }),
      );
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    feedRef.current?.scrollTo({
      top: feedRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [feed, open]);

  const navigate = (target: string) => {
    onOpenChange(false);
    window.dispatchEvent(
      new CustomEvent("folio:navigate", { detail: { target } }),
    );
  };

  const run = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    let output = "";
    let shouldNavigate: string | null = null;

    if (command === "help") {
      output = commandHelp
        .map((item) => `  ${item.command.padEnd(10)} ${item.description}`)
        .join("\n");
    } else if (command === "whoami") {
      output = `${identity.name} — ${identity.role}\n${identity.description}\nLocation: ${identity.location}`;
    } else if (command === "work" || command === "ls work") {
      output = "Routing to TRANSMISSIONS...";
      shouldNavigate = "work";
    } else if (
      command === "construct" ||
      command === "time" ||
      command === "bullet"
    ) {
      output = "Loading the construct. Scroll to compile the scene.";
      shouldNavigate = "construct";
    } else if (command === "ai" || command === "protocol") {
      output = "Opening AI PROTOCOL...";
      shouldNavigate = "protocol";
    } else if (command === "contact" || command === "channel") {
      output = "Opening CHANNEL...";
      shouldNavigate = "channel";
    } else if (command === "resume" || command === "cv") {
      output = "Opening resume...";
      window.open(identity.resume, "_blank", "noopener,noreferrer");
    } else if (command === "ls" || command === "index") {
      output = sectionIndex
        .map((item) => `  ${item.index}  ${item.label.toUpperCase()}`)
        .join("\n");
    } else if (command === "date") {
      output = new Date().toString();
    } else if (command === "wake") {
      output =
        "Reality check failed. You are still in the simulation.\nTry scrolling instead.";
      document.documentElement.classList.add("is-waking");
      window.setTimeout(
        () => document.documentElement.classList.remove("is-waking"),
        900,
      );
    } else if (command === "sudo" || command.startsWith("sudo ")) {
      output = "Permission denied. The simulation is read-only.";
    } else if (command === "clear") {
      setFeed([]);
      setValue("");
      return;
    } else {
      output = `command not found: ${command}\nTry \`help\`.`;
    }

    setFeed((current) => [
      ...current,
      { id: idRef.current++, command: rawCommand.trim(), output },
    ]);
    setValue("");

    if (shouldNavigate) {
      window.setTimeout(() => navigate(shouldNavigate as string), 220);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(value);
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, [href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);

    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="command-overlay"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onOpenChange(false);
          }}
        >
          <motion.div
            ref={panelRef}
            className="command-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onPanelKeyDown}
          >
            <header className="command-header">
              <div>
                <p className="command-eyebrow">{identity.name} / operator console</p>
                <h2 id="command-title">Simulation shell</h2>
              </div>
              <button
                type="button"
                className="command-close"
                onClick={() => onOpenChange(false)}
                aria-label="Close command shell"
              >
                ESC
              </button>
            </header>

            <div className="command-feed" ref={feedRef} aria-live="polite">
              {feed.length === 0 ? (
                <p className="command-empty">Feed cleared. Type `help`.</p>
              ) : null}
              {feed.map((entry) => (
                <div className="command-entry" key={entry.id}>
                  {entry.command ? (
                    <p className="command-echo">
                      <span className="command-caret">&gt;</span>
                      {entry.command}
                    </p>
                  ) : null}
                  <p className="command-output">{entry.output}</p>
                </div>
              ))}
            </div>

            <form className="command-form" onSubmit={onSubmit}>
              <label htmlFor="command-input" className="sr-only">
                Run a simulation command
              </label>
              <span className="command-caret" aria-hidden="true">
                &gt;
              </span>
              <input
                id="command-input"
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="command-input"
                placeholder="type a command…"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
              <button type="submit" className="command-submit">
                RUN <span aria-hidden="true">↵</span>
              </button>
            </form>

            <div className="command-hints" aria-label="Command suggestions">
              {commandHelp
                .filter((item) => item.command !== "clear")
                .map((item) => (
                  <button
                    key={item.command}
                    type="button"
                    className="command-hint"
                    onClick={() => run(item.command)}
                  >
                    {item.command}
                  </button>
                ))}
            </div>

            <footer className="command-footer">
              <span>ENTER / execute</span>
              <span>ESC / close</span>
              <span>HUMAN REVIEW REQUIRED</span>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
