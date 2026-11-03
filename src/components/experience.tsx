"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";
import { BootSequence } from "@/components/boot-sequence";
import { CommandShell } from "@/components/command-shell";
import { SectionRail } from "@/components/section-rail";
import { SimulationCanvas } from "@/components/simulation-canvas";
import { SiteHeader } from "@/components/site-header";
import { Channel } from "@/components/sections/channel";
import { Choice } from "@/components/sections/choice";
import { Construct } from "@/components/sections/construct";
import { Exit } from "@/components/sections/exit";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Protocol } from "@/components/sections/protocol";
import { Work } from "@/components/sections/work";
import { simulationState } from "@/lib/simulation-state";

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function Experience() {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    const init = async () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        simulationState.intensity = 0.42;
        simulationState.core = 0.18;
        simulationState.dilation = 1;

        const progressBar =
          document.querySelector<HTMLElement>(".scroll-progress");

        const syncProgress = () => {
          if (!progressBar) return;
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress =
            maxScroll > 0
              ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
              : 0;
          progressBar.style.transform = `scaleX(${progress})`;
        };

        const handleReducedNavigate = (event: Event) => {
          const customEvent = event as CustomEvent<{ target: string }>;
          const target = document.getElementById(customEvent.detail.target);
          target?.scrollIntoView({ behavior: "auto", block: "start" });
        };

        window.addEventListener("scroll", syncProgress, { passive: true });
        window.addEventListener("folio:navigate", handleReducedNavigate);
        syncProgress();
        cleanup = () => {
          window.removeEventListener("scroll", syncProgress);
          window.removeEventListener("folio:navigate", handleReducedNavigate);
        };
        return;
      }

      const [{ gsap }, { ScrollTrigger }, { default: LenisClass }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      document.documentElement.classList.add("motion-ready");

      const lenis: Lenis = new LenisClass({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.15,
        wheelMultiplier: 1,
        overscroll: false,
      });

      const progressBar =
        document.querySelector<HTMLElement>(".scroll-progress");
      const setScrollProgress = progressBar
        ? (gsap.quickSetter(progressBar, "scaleX") as (value: number) => void)
        : () => {};

      const handleLenisScroll = () => {
        ScrollTrigger.update();
        setScrollProgress(Math.min(1, Math.max(0, lenis.progress)));
      };

      lenis.on("scroll", handleLenisScroll);
      setScrollProgress(lenis.progress);

      const ticker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const handleAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const targetElement =
          event.target instanceof Element
            ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
            : null;
        if (!targetElement || targetElement.classList.contains("skip-link")) return;
        if (targetElement.target && targetElement.target !== "_self") return;

        const href = targetElement.getAttribute("href");
        if (!href || href === "#") return;

        const id = decodeURIComponent(href.slice(1));
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        lenis.scrollTo(target, { duration: 1.2 });
        window.history.pushState(null, "", href);
      };

      const handleShellNavigate = (event: Event) => {
        const customEvent = event as CustomEvent<{ target: string }>;
        const target = document.getElementById(customEvent.detail.target);
        if (target) {
          // The command shell pauses Lenis while it is open. React may not
          // have committed the close cleanup yet when this event fires, so
          // resume explicitly before requesting the scroll.
          lenis.start();
          lenis.scrollTo(target, { duration: 1.2 });
          window.history.pushState(null, "", `#${customEvent.detail.target}`);
        }
      };

      const handleScrollLock = (event: Event) => {
        const customEvent = event as CustomEvent<{ locked: boolean }>;
        if (customEvent.detail.locked) {
          lenis.stop();
        } else {
          lenis.start();
        }
      };

      const handleWorkFocus = (event: FocusEvent) => {
        if (!window.matchMedia("(min-width: 960px)").matches) return;
        if (!(event.target instanceof Element)) return;
        if (!event.target.closest(".work-track")) return;
        if (!event.target.matches(":focus-visible")) return;

        const workSection = document.getElementById("work");
        if (!workSection) return;

        const sectionTop =
          workSection.getBoundingClientRect().top + window.scrollY;
        const endScroll =
          sectionTop + workSection.offsetHeight - window.innerHeight;

        window.requestAnimationFrame(() => {
          lenis.scrollTo(endScroll, { duration: 0.8 });
        });
      };

      document.addEventListener("click", handleAnchorClick);
      document.addEventListener("focusin", handleWorkFocus);
      window.addEventListener("folio:navigate", handleShellNavigate);
      window.addEventListener("folio:lock-scroll", handleScrollLock);

      let scrollMedia: ReturnType<typeof gsap.matchMedia> | null = null;

      const context = gsap.context(() => {
        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
          },
        });

        heroTimeline
          .to(
            ".hero-title-block",
            { yPercent: -10, opacity: 0.12, force3D: true, ease: "none" },
            0,
          )
          .to(
            ".hero-bottom",
            { yPercent: -20, opacity: 0, force3D: true, ease: "none" },
            0,
          )
          .to(".hero-topline", { opacity: 0, ease: "none" }, 0.1)
          .to(".hero-side-label", { opacity: 0, ease: "none" }, 0);

        gsap.set(".manifesto-word", { opacity: 0.12 });

        gsap.to(".manifesto-word", {
          opacity: 1,
          stagger: 0.045,
          ease: "none",
          scrollTrigger: {
            trigger: "#manifesto",
            start: "top 58%",
            end: "bottom 72%",
            scrub: 0.85,
          },
        });

        ScrollTrigger.create({
          trigger: "#manifesto",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const progress = self.progress;
            simulationState.core =
              Math.min(
                smoothstep(0.04, 0.3, progress),
                1 - smoothstep(0.73, 0.98, progress),
              ) * 0.94;
          },
        });

        const constructSection = document.getElementById("construct");
        if (constructSection) {
          const panels = Array.from(
            constructSection.querySelectorAll<HTMLElement>(
              "[data-construct-panel]",
            ),
          );
          const statusValue = constructSection.querySelector<HTMLElement>(
            "[data-construct-status]",
          );
          const rateValue = constructSection.querySelector<HTMLElement>(
            "[data-construct-rate]",
          );
          const observerValue = constructSection.querySelector<HTMLElement>(
            "[data-construct-observer]",
          );

          const setText = (node: HTMLElement | null, value: string) => {
            if (node && node.textContent !== value) node.textContent = value;
          };

          const updateConstruct = (progress: number) => {
            const phase =
              progress < 0.34
                ? "construct"
                : progress < 0.7
                  ? "bullet-time"
                  : "deja-vu";
            const lockIn = smoothstep(0.33, 0.43, progress);
            const release = smoothstep(0.67, 0.76, progress);
            const dilation = Math.max(0, Math.min(1, 1 - lockIn + release));
            const activePanel = panels.find(
              (panel) => panel.dataset.constructPanel === phase,
            );

            simulationState.construct = progress;
            simulationState.dilation = dilation;
            if (constructSection.dataset.phase !== phase) {
              constructSection.dataset.phase = phase;
            }
            constructSection.style.setProperty(
              "--construct-progress",
              progress.toFixed(4),
            );

            setText(
              statusValue,
              activePanel?.dataset.panelStatus ?? "Environment load",
            );
            setText(rateValue, `${dilation.toFixed(3)}×`);
            setText(observerValue, dilation <= 0.01 ? "LOCKED" : "ACTIVE");
          };

          ScrollTrigger.create({
            trigger: constructSection,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => updateConstruct(self.progress),
            onRefresh: (self) => updateConstruct(self.progress),
            onLeave: () => updateConstruct(1),
            onLeaveBack: () => updateConstruct(0),
          });

          updateConstruct(0);
        }

        document
          .querySelectorAll<HTMLElement>("[data-sim-intensity]")
          .forEach((section) => {
            const intensity = Number.parseFloat(
              section.dataset.simIntensity ?? "0.4",
            );
            if (Number.isNaN(intensity)) return;

            ScrollTrigger.create({
              trigger: section,
              start: "top 58%",
              end: "bottom 42%",
              onToggle: (self) => {
                if (!self.isActive) return;
                gsap.to(simulationState, {
                  intensity,
                  duration: 0.7,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
            });
          });

        gsap.set(".work-progress-fill", {
          scaleX: 0.02,
          transformOrigin: "left center",
        });

        scrollMedia = gsap.matchMedia();

        scrollMedia.add(
          "(min-width: 960px) and (prefers-reduced-motion: no-preference)",
          () => {
            const workSection = document.getElementById("work");
            const workTrack = document.getElementById("work-track");
            if (!workSection || !workTrack) return;

            const getDistance = () =>
              Math.max(0, workTrack.scrollWidth - window.innerWidth);

            // Add a short hold at the end: the track lands cleanly, gives the
            // final card a beat to breathe, then the page unpins.
            const getScrollRange = () => getDistance() * 1.12;

            const setWorkHeight = () => {
              workSection.style.height = `${window.innerHeight + getScrollRange()}px`;
            };

            setWorkHeight();

            const fill = workSection.querySelector<HTMLElement>(
              ".work-progress-fill",
            );
            const setWorkProgress = fill
              ? (gsap.quickSetter(fill, "scaleX") as (value: number) => void)
              : () => {};

            const workTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: workSection,
                start: "top top",
                end: () => `+=${getScrollRange()}`,
                scrub: 0.9,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  simulationState.work = self.progress;
                  const travelProgress = Math.min(1, self.progress / 0.89);
                  setWorkProgress(Math.max(0.02, travelProgress));
                },
                onRefresh: setWorkHeight,
              },
            });

            workTimeline.to(
              workTrack,
              {
                x: () => -getDistance(),
                duration: 0.89,
                ease: "none",
                force3D: true,
              },
              0,
            );

            // The remaining 11% is the end-of-gallery hold.
            workTimeline.to({}, { duration: 0.11 }, 0.89);

            return () => {
              workTimeline.kill();
              workSection.style.removeProperty("height");
              gsap.set(workTrack, { clearProps: "transform" });
            };
          },
        );
      });

      let refreshTimer = 0;
      const scheduleRefresh = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      };

      void document.fonts.ready.then(scheduleRefresh);
      window.addEventListener("load", scheduleRefresh, { once: true });
      scheduleRefresh();

      cleanup = () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener("load", scheduleRefresh);
        document.removeEventListener("click", handleAnchorClick);
        document.removeEventListener("focusin", handleWorkFocus);
        window.removeEventListener("folio:navigate", handleShellNavigate);
        window.removeEventListener("folio:lock-scroll", handleScrollLock);
        document.documentElement.classList.remove("motion-ready");
        scrollMedia?.revert();
        context.revert();
        lenis.destroy();
        gsap.ticker.remove(ticker);
      };
    };

    void init().catch((error) => {
      document.documentElement.classList.remove("motion-ready");
      console.error("Scroll choreography failed to initialize.", error);
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SimulationCanvas />
      <BootSequence />
      <SiteHeader onOpenCommand={() => setCommandOpen(true)} />
      <SectionRail />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Choice />
        <Manifesto />
        <Construct />
        <Work />
        <Protocol />
        <Channel />
      </main>
      <Exit />
      <CommandShell open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
