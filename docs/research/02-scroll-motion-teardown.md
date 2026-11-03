# Scroll-Motion Teardown — How Apple-Style Storytelling Actually Works

> Research for **matrixfolio**. This is not an architecture decision. It documents the
> mechanics used by Apple product pages and the top portfolios in
> `01-top-10-portfolio-sites.md`, so the stack can be chosen with eyes open.

---

## 1. The core idea: scroll is a timeline, not a trigger

Most sites use scroll as a **trigger**: an element enters the viewport and a one-shot
animation plays. Apple-style sites treat scroll as a **timeline**: the scroll position
*is* the playhead, so the scene can move forward and backward continuously under the
user's finger.

Three consequences:

1. **Reversible by default.** Scroll up and the story rewinds. No "already animated"
   state to fight.
2. **Interruptible by default.** The user is always in control; there is no autoplay
   to wait out.
3. **Pacing belongs to the user.** Long scroll distances = slow, deliberate beats;
   short = fast cuts.

The craft is choosing *which* properties are scrubbed and which are triggered.

---

## 2. The six primitives

Almost every cinematic scroll site is a composition of these:

| Primitive | What it does | Typical use |
|-----------|--------------|-------------|
| **Pin** | Freezes an element while the page keeps scrolling | Product stage, horizontal gallery |
| **Scrub** | Maps scroll progress (0→1) to animation progress | Transforms, opacity, video time |
| **Reveal** | Animates in once, when entering the viewport | Headlines, cards, captions |
| **Parallax** | Layers move at different speeds | Depth, hero backgrounds |
| **Horizontal translate** | Vertical scroll drives X movement | Work galleries, timelines |
| **Sequence** | Scroll drives frames of video / image sequence | Product rotation, "exploded" views |

### Pin + scrub
A tall section (e.g. `400vh`) contains a `position: sticky` stage (or a JS-pinned
element). While the section is on screen, the stage stays put and the timeline
progresses with scroll. When the section ends, the page resumes normally.

```
<section class="stage-wrap">   height: 400vh
  <div class="stage">          position: sticky; top: 0; height: 100vh
    ...the scene...
  </div>
</section>
```

### Horizontal gallery
The same pin, with the inner track translated on X:

```
progress 0 → 1  =>  track.x = -(trackWidth - viewportWidth) * progress
```

This is the single most copied "Apple-like" pattern for portfolios.

### Sequence
Apple often scrubs a `<video>` or a preloaded image sequence:
`video.currentTime = progress * duration`. This looks incredible but is the heaviest
option: dozens of MB of frames, decode cost, and mobile limitations. It should be a
deliberate choice, not a default.

---

## 3. Apple's anatomy (observed)

Apple product pages typically compose:

1. **Hero statement** — oversized product name, one line of copy, no interaction.
2. **Sticky media stage** — the product stays centered while feature captions swap.
3. **Scrubbed transforms** — scale, rotation, opacity, and camera-like movement tied
   directly to scroll progress.
4. **Pinned feature beats** — each feature occupies its own scroll distance; the
   media crossfades or moves between states.
5. **Specs / details** — conventional, readable sections after the cinematic part.
6. **One CTA** — repeated at natural decision points, never competing with the story.

Key restraint: **one continuous scene per page**, not a new effect per section.
Transitions are crossfades and camera moves, not wipes and confetti.

### Timing values worth stealing
- Long easing curves: `cubic-bezier(0.16, 1, 0.3, 1)` or `power3.out`.
- Scrub lag: a numeric scrub (~0.5–1.5s) reads smoother than `scrub: true`, which
  feels welded to the scrollbar.
- Reveal durations: 0.6–1.0s, stagger 60–120ms.
- Parallax range: subtle. 5–15% of viewport, not 100%.
- Prefer **transform + opacity** only; never animate layout properties.

---

## 4. What each reference site uses

| Site | Scroll mechanics observed | Lesson |
|------|---------------------------|--------|
| **Apple** | Sticky stages, scrubbed transforms, video sequences, crossfades | One scene, many beats; restraint |
| **Bruno Simon** | World navigation (not scroll), spatial audio | The interaction *is* the concept |
| **Dennis Snellenberg** | GSAP timelines, smooth scroll, parallax speeds, horizontal galleries, page transitions | One motion language across the whole site |
| **Aristide Benoist** | WebGL scene, custom render loop, precise easing | One canvas, optimized hard |
| **Jesse Zhou** | Three.js narrative, scroll-linked 3D | Art direction beats effect count |
| **Robby Leonardi** | Scroll as level progression, illustrated scenes | Scroll position = story position |
| **Brittany Chiang** | IntersectionObserver reveals, no scroll-jacking | Restraint still wins |
| **Rauno Freiberg** | Interruptible, responsive micro-interactions | Feedback before commit |
| **Adham Dannaway** | Structural concept, minimal motion | The layout can be the idea |
| **Keita Yamada** | Almost none | Content hierarchy > effects |

The pattern: the award-winning sites use **fewer effects, tuned harder**. The
effects are not the differentiator; the concept and the finish are.

---

## 5. The two implementation roads (open question)

### A. GSAP + ScrollTrigger + Lenis
- Most control: pinning, scrubbing, snapping, timelines, callbacks.
- Lenis smooths scroll and both share a single clock.
- Larger JS payload than native; requires careful cleanup in React.
- Battle-tested on the exact sites in the research.

Canonical Lenis ↔ GSAP wiring:

```ts
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Pitfalls:
- Do not run Lenis's own `autoRaf` **and** a GSAP ticker loop — two owners of the frame.
- Call `ScrollTrigger.refresh()` after fonts/images/layout settle.
- Pinning changes page height; Lenis must be told after `refresh`.
- Clean up `gsap.context()` / `ctx.revert()` on unmount.

### B. Native CSS scroll-driven animations
- `animation-timeline: scroll()` / `view()` runs off the main thread in supporting
  browsers (Chromium, Safari 18+).
- Zero JS cost for the animation itself.
- Weaker pinning/staggering ergonomics; limited timeline composition; fallback needed
  for older browsers.
- Excellent for reveals, progress bars, and simple parallax.

### C. Hybrid (likely the pragmatic answer)
- Native `view()` for simple reveals and progress indicators.
- GSAP/ScrollTrigger only for the pinned horizontal gallery and the scrubbed
  manifesto.
- Lenis optional — only if the smooth-scroll feel is worth the accessibility and
  native-behavior trade-offs.

> Decision deferred. The research suggests the hybrid, but the final call depends on
> the asset types (video? 3D? image sequences?) and the target browser matrix.

---

## 6. Performance budget for "fast as fuck"

| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.0s (fast 4G, mid-range laptop) | First impression |
| INP | < 200ms | Scroll/hover must feel instant |
| CLS | < 0.05 | The preloader and canvas must not shift layout |
| Desktop scroll | 60fps | Non-negotiable for the concept |
| Mid-range mobile | 30fps+ stable | Graceful degradation |
| Main-thread JS (initial) | < 150KB gzipped | Motion libraries are not free |
| Canvas pixel ratio | capped at 2 | Retina is not worth 4× fill cost |
| Offscreen work | paused | `IntersectionObserver` + `visibilitychange` |

Rules:
- Animate only `transform` and `opacity`.
- No scroll listeners doing layout reads; use rAF or the animation library's ticker.
- `will-change` only on elements actively animating, removed afterwards.
- Pause canvas/WebGL when offscreen or the tab is hidden.
- Cap DPR, reduce particle counts on low-core devices
  (`navigator.hardwareConcurrency`), and prefer 2D canvas for simple effects.
- Load heavy media only when its section is near the viewport.
- Preload the hero; lazy-load everything below the first fold.
- Self-host fonts with `font-display: swap` and preload the display face.

---

## 7. Accessibility guardrails

- **`prefers-reduced-motion: reduce`** — disable Lenis, pinning, scrubbing, canvas
  animation, and the preloader. Content must be static and complete.
- Never trap the user in a pinned section; native scroll must always move the page.
- Keep focus visible and keyboard order logical.
- Buttons, not divs, for interactive controls.
- Provide a "skip the intro" path and a visible route to Work + Contact.
- Do not rely on hover for essential information (mobile has none).
- Respect `prefers-reduced-transparency` / contrast where relevant.
- Video: muted, no autoplay with sound, captions if speech exists.

---

## 8. Concept mapping for matrixfolio

| Beat | Primitive | Scene change |
|------|-----------|--------------|
| 00 Boot | timed, skippable | Terminal text, then glitch cut to hero |
| 01 Hero | parallax + scrub fade | Digital rain falls; name holds; rain recedes on scroll |
| 02 Choice | pin + scrub | Two pills; red route advances, blue route resets the scene |
| 03 Manifesto | pin + scrub | Words illuminate as the statement assembles |
| 04 Work | pin + horizontal translate | Transmissions track moves sideways; cards scale near center |
| 05 Capabilities | reveal + stagger | Terminal readout with animated bars |
| 06 Channel | reveal + magnetic hover | One CTA, one email, one clear exit |
| 07 Exit | static | "There is no spoon." + system status |

The whole page should feel like **one continuous simulation**, not seven unrelated
sections. Transitions between beats are where the budget should go.

---

## 9. Open questions for the architecture phase

1. **Framework:** Next.js static export (SEO, image tooling) vs Astro (lighter,
   islands) vs Vite + React (simplest, no SSG).
2. **Motion:** GSAP + ScrollTrigger vs native scroll-driven CSS vs hybrid.
3. **Smooth scroll:** Lenis vs native. Does the feel justify the trade-offs?
4. **Hero visual:** 2D canvas digital rain vs WebGL shader rain vs pre-rendered video.
   (Note: pre-rendered video is not scrubbable and is heavy on mobile.)
5. **Assets:** will the supplied media be images, video, or 3D models? This changes
   the loading strategy and the performance budget.
6. **Deployment:** static CDN is assumed. Any need for server routes (contact form,
   analytics proxy, CMS)?
7. **Content:** real project case studies, or placeholders first?

---

## 10. Sources

- Apple product pages (observed structure): https://www.apple.com/iphone/
- Lenis documentation: https://lenis.darkroom.engineering
- GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- "Your Scroll Animations Look Amateur. Here's the GSAP + Lenis Setup That Fixes It"
- "Immersive web stack in 2026: Lenis, GSAP, and what to skip" — adamarant.com
- "How to Build an Apple-Style Scroll Website" — vulk.dev
- Rauno Freiberg, *Invisible Details of Interaction Design*: https://rauno.me/craft
- Dennis Snellenberg teardown — step1.dev gallery
- CSS Design Awards 2025 winners:
  https://www.cssdesignawards.com/blog/2025-website-of-the-year-winners/430
