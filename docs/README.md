# matrixfolio — Docs

A Matrix / simulation-theory portfolio for **Pulichara Giridhar**. The site is
built as a system the visitor can inspect: a live WebGL glyph field, a scroll-driven
narrative, a command shell, and a real record of AI-assisted engineering practice.

## Index

| Doc | What it covers |
|-----|----------------|
| [`research/01-top-10-portfolio-sites.md`](research/01-top-10-portfolio-sites.md) | Teardown of 10 award-level developer/designer portfolios: concept, motion, tech, what to borrow, what not to copy. |
| [`research/02-scroll-motion-teardown.md`](research/02-scroll-motion-teardown.md) | How Apple-style scroll storytelling actually works: pinning, scrubbing, horizontal galleries, text reveals, performance and accessibility constraints. |

## Project intent

- **Scroll-driven cinema** — scroll position is the playhead, not a trigger.
- **Matrix + simulation theory** — the portfolio behaves like an inspectable system.
- **Proof over decoration** — the site demonstrates the interface, full-stack, and AI
  delivery claims in the work itself.
- **Performance is design** — fewer, better effects; no page-blocking spectacle.
- **Asset-ready** — procedural visuals now, optional generated media later.

## Status

- [x] Research dossier
- [x] Architecture decision
- [x] v1 implementation
- [x] Bullet-time anomaly beat with scroll-scrubbed time dilation
- [x] Desktop / tablet / mobile browser QA
- [x] Keyboard, no-JS, and reduced-motion paths
- [x] axe WCAG 2.1 A/AA audit — zero violations at time of build
- [ ] Production domain set (`NEXT_PUBLIC_SITE_URL`)
- [ ] Real project case-study pages / public links (if available)
- [ ] Optional generated project stills

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| App | Next.js 16, React 19, TypeScript | Static-renderable, SEO-safe, fast route payloads. |
| 3D | Three.js + custom GLSL | One signature scene instead of a heavy 3D framework. Points render in a single draw call. |
| Scroll | GSAP + ScrollTrigger + Lenis | Precise pinned/scrubbed choreography and one shared animation clock. |
| UI motion | Motion | Enter/exit, dialog, magnetic interactions, and accessible reduced-motion updates. |
| Styling | Hand-authored CSS + Tailwind v4 reset | Design control for a highly bespoke visual system. |
| Content | Typed local content model | No CMS cost for v1; easy to migrate later. |

## The eight beats

1. **Boot** — skippable terminal handshake (CSS/JS, reduced-motion aware).
2. **Hero** — name, positioning, CTAs, and the live WebGL glyph field.
3. **Choice** — red pill / blue pill routes to work or contact.
4. **Manifesto** — sticky, scroll-scrubbed operating principles while the glyph field
   assembles into a 3D core.
5. **Bullet Time** — an observer-anomaly freeze-frame. Scroll decelerates the field,
   hangs five projectiles mid-air, holds at `0.000×`, then re-enters flow. The HUD,
   phase meter, afterimage title, and deja-vu flag are all driven by the same scroll
   progress; the WebGL clock slows with it.
6. **Work** — pinned horizontal transmissions with four systems and real metrics.
7. **AI Protocol** — the agent-delivery method, capability tabs, and build note.
8. **Channel / Exit** — contact, resume, socials, and the closing line.

## Architecture

```
src/
  app/
    layout.tsx              metadata, fonts, no-JS fallback
    page.tsx                route entry
    globals.css             design system + responsive/a11y states
    opengraph-image.tsx     1200×630 social image
  components/
    experience.tsx          root composition + GSAP/Lenis orchestration
    simulation-canvas.tsx   dynamic Three.js + GLSL glyph field
    boot-sequence.tsx       skippable intro
    command-shell.tsx       ⌘K terminal with keyboard trap
    section-rail.tsx        scroll index / active section
    site-header.tsx         nav, progress, command trigger
    sections/bullet-time.tsx scroll-scrubbed time-dilation scene
    sections/*              the narrative beats
    project-visual.tsx      procedural product UI mockups
  lib/
    content.ts              identity, work, protocol, copy
    simulation-state.ts     mutable bridge between scroll and WebGL
    use-prefers-reduced-motion.ts
```

### Scroll → WebGL bridge

React does not re-render on scroll. GSAP writes section intensity, manifesto core
progress, and the bullet-time `dilation` factor into `simulation-state.ts`; the Three.js
render loop reads that shared object and damps the shader uniforms. `dilation` scales
the simulation clock, so at `0.000×` the glyph field itself holds still while pointer
parallax remains responsive. This keeps scroll and pointer input off the React render
path.

### Progressive enhancement

- Without JavaScript, bullet time renders as a complete freeze-frame and the work
  gallery becomes a vertical static stack; all Motion intro states are forced visible.
- `prefers-reduced-motion: reduce` skips the boot, disables Lenis/ScrollTrigger, renders
  a static WebGL frame, holds bullet time at `0.000×`, and stacks the project gallery
  vertically.
- Mobile keeps the vertical bullet-time sticky scene but removes the pinned horizontal
  work stage in favor of a native swipe gallery.
- The command shell traps focus, restores the previous focus, pauses smooth scroll, and
  supports Escape.
- Every project card has real context and metrics; the site never relies on hover-only
  information.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # TypeScript
npm run build      # production build
npm run start      # serve production build
```

Production domain for canonical / OG URLs:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used as a fallback.

## Assets and Higgsfield

v1 is intentionally asset-light. The WebGL glyph field, project dashboards, charts, and
social image are procedural or code-native, which keeps the initial payload low and the
art direction coherent.

Use an image/video generator such as Higgsfield only where it adds specific value:

- optional stills for case-study detail pages;
- editorial project covers for an archive page;
- social / campaign variants.

Keep generated video out of the core homepage background. It is heavy, not scrubbable,
and competes with the real-time WebGL signature. If generated assets are added, export
AVIF/WebP at fixed aspect ratios, preload only the hero asset, and lazy-load the rest.

## Open decisions

1. **Domain** — set `NEXT_PUBLIC_SITE_URL`.
2. **Case-study depth** — add `/work/[slug]` pages if public links or deeper writeups exist.
3. **Generated assets** — decide whether Higgsfield stills add enough art direction to
   justify replacing any procedural project visual.
4. **Contact backend** — current contact is mailto + copy-to-clipboard; add a form only
   if spam handling and analytics are worth the operational cost.
