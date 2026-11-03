# Top 10 Developer & Designer Portfolios — Research Dossier

> Research compiled October 2026 for **matrixfolio** — a Matrix / simulation-theory portfolio.
> The goal of this document is not to copy surfaces. It is to reverse-engineer the **decision**
> behind each site: why it works, how the motion is built, and which mechanic is worth
> borrowing for a fast, scroll-driven, cinematic portfolio.

---

## TL;DR — the ten

| # | Site | Who | Archetype | The one mechanic worth stealing |
|---|------|-----|-----------|--------------------------------|
| 1 | [bruno-simon.com](https://bruno-simon.com) | Bruno Simon | 3D playground | The site itself is the proof of skill |
| 2 | [rauno.me](https://rauno.me) | Rauno Freiberg | Interaction craft | Motion that responds from the first pixel |
| 3 | [dennissnellenberg.com](https://dennissnellenberg.com) | Dennis Snellenberg | High-motion minimal | Scroll choreography + magnetic targets |
| 4 | [brittanychiang.com](https://brittanychiang.com) | Brittany Chiang | Disciplined dark portfolio | Restraint as a premium signal |
| 5 | [aristidebenoist.com](https://aristidebenoist.com) | Aristide Benoist | WebGL craft | One 3D idea, executed to the edge |
| 6 | [jesse-zhou.com](https://jesse-zhou.com) | Jesse Zhou | 3D narrative | Spatial storytelling with Blender assets |
| 7 | [adhamdannaway.com](https://adhamdannaway.com) | Adham Dannaway | Split identity | Instantly communicate dual expertise |
| 8 | [p5aholic.me](https://p5aholic.me) | Keita Yamada | Radical minimalism | Structure and type, almost no chrome |
| 9 | [rleonardi.com](https://rleonardi.com) | Robby Leonardi | Scroll-game resume | Scroll as a narrative timeline |
| 10 | [vanschneider.com](https://vanschneider.com) | Tobias van Schneider | Editorial personal brand | Every project framed as a decision |

**Bonus references:** [Active Theory](https://activetheory.net) (studio-scale WebGL),
Apple product pages (the gold standard for scrub-driven product storytelling),
and the 2025 CSS Design Awards winners (Dropbox Brand, Bruno's Portfolio, Merouane Bali).

---

## 1. Bruno Simon — bruno-simon.com

**Who:** Creative developer, creator of Three.js Journey.
**Archetype:** The portfolio as a playable world.
**Awards:** Awwwards Site of the Month (Jan 2026), Developer Award, Best Portfolio
Site — CSS Design Awards 2025.

### What it is
You land in a low-poly 3D landscape and drive a little car around. Projects, social
links, and easter eggs are physical places. There is no conventional grid, no project
list, no menu-first navigation.

### Why it works
- **The medium is the message.** A creative developer's portfolio should demonstrate
  the skill it claims. Driving a hand-built world is stronger evidence than a bullet
  list that says "Three.js".
- **Play creates memory.** Visitors remember a place, not a card.
- **The concept is legible in five seconds.** You immediately understand that this
  person builds interactive worlds.
- **There is a fallback.** Standard navigation remains available, so the novelty
  never becomes a wall.

### Motion & tech (reported)
- Three.js / WebGL, custom physics, hand-coded terrain and props.
- Aggressive optimization: texture compression, frustum culling, LOD, capped pixel ratio.
- Spatial audio and per-area rooms.

### Steal for matrixfolio
- **World-building over section-stacking.** Our "world" is the simulation: the page
  should feel like a system you are inside, not a document you are reading.
- **One signature interaction** that can be explained in a sentence.
- **Escape hatch:** always provide a fast path to work and contact.

### Don't copy
- A full 3D game. It is months of work, heavy on mobile, and easy to make slow.
  We get 80% of the feeling with a 2D canvas digital rain, depth layers, and pinning.

---

## 2. Rauno Freiberg — rauno.me

**Who:** Design engineer (Vercel). Author of *Invisible Details of Interaction Design*.
**Archetype:** The portfolio as a demonstration of interaction taste.

### What it is
A quiet, typographic site where the craft lives in the details: text selection,
hover states, interruptible transitions, scroll behavior, and the feeling that
every element answers the cursor immediately.

### Why it works
- **Responsive gestures.** Feedback begins on the first millimetre of input; the
  animation commits only after a threshold. Nothing waits for a "trigger".
- **Interruptible motion.** A mistap costs one reversed motion, not a forced wait.
- **No decoration without a job.** Almost every pixel earns its place.
- **The writing is part of the portfolio.** Ideas about interaction become proof of
  interaction skill.

### Motion & tech
- Hand-tuned CSS/JS interactions, minimal dependencies.
- Small type, generous whitespace, restrained color.
- Motion durations tuned by feel, not by a design-system default.

### Steal for matrixfolio
- **Magnetic buttons and links** that track the pointer with a lerp, not a snap.
- **Hover states that begin instantly** and settle smoothly.
- **Interruptible reveals** — never lock scrolling or input during animation.
- **Write one real essay / case study** in the portfolio; it raises perceived depth.

### Don't copy
- The ultra-minimal aesthetic. Our Matrix concept needs a stronger visual signature.
  We take the interaction honesty, not the palette.

---

## 3. Dennis Snellenberg — dennissnellenberg.com

**Who:** Creative developer / designer.
**Archetype:** High-motion minimalist portfolio.

### What it is
A monochrome, editorial portfolio with a high-impact intro, list-based work index,
hover-triggered image previews, horizontal galleries, magnetic buttons, and a
multi-language preloader.

### Why it works
- **Extreme scale contrast.** Massive thin headlines against tiny utilitarian meta
  text create hierarchy without color.
- **Motion is choreographed, not sprinkled.** The preloader, intro, work list, and
  page transitions share one motion language.
- **The work list is the navigation.** Hover reveals media in place; no extra page
  load just to preview.
- **Magnetic CTAs** make the site feel physically responsive.

### Motion & tech (reported)
- GSAP timelines, Locomotive Scroll (smooth scroll), Barba.js page transitions.
- `data-scroll-speed` parallax, staggered line reveals, cursor-following media.
- A single accent color (electric blue) against near-black and off-white.

### Steal for matrixfolio
- **Magnetic primary CTA** for the contact / red-pill action.
- **Staggered line reveals** for headlines.
- **A hover-preview work index** as the mobile/accessible fallback for the pinned
  horizontal gallery.
- **One accent color** used sparingly (ours: matrix green; rare red for glitches).

### Don't copy
- A long preloader. Ours must be under ~1.5s and skippable; a portfolio should not
  make a recruiter wait to see the work.

---

## 4. Brittany Chiang — brittanychiang.com

**Who:** Frontend engineer.
**Archetype:** The disciplined dark portfolio.

### What it is
A fast, typography-led one-pager: sticky sidebar with name/nav, numbered sections,
concise project summaries, a clear archive, and a dark slate palette with a single
teal accent.

### Why it works
- **Clarity in the first five seconds.** Name, role, and focus are unmistakable.
- **Curation.** A handful of strong projects beats twenty average ones.
- **Structure scales.** Numbered sections and a sticky nav make a long page feel short.
- **Restraint reads as seniority.** No effect exists to impress other developers.
- **Performance is part of the message.** Next.js + Tailwind, minimal media, fast paint.

### Motion & tech (reported)
- Next.js + Tailwind CSS.
- Subtle fade/slide-in on scroll, hover lifts, no scroll-jacking.
- Accessible contrast and focus states.

### Steal for matrixfolio
- **A sticky HUD/side rail** that keeps identity + section index visible.
- **Numbered sections** (00–07) — fits the terminal/system concept perfectly.
- **Project cards with real context:** role, stack, outcome — not just a thumbnail.
- **Fast by default.** Our "fast as fuck" requirement is a design constraint, not a
  post-launch optimization.

### Don't copy
- The exact dark-slate/teal palette or the sidebar layout. We use the information
  architecture, not the skin.

---

## 5. Aristide Benoist — aristidebenoist.com

**Who:** Creative developer.
**Archetype:** WebGL craft, one idea executed to the edge.

### What it is
A highly polished, award-winning creative developer portfolio built around real-time
WebGL, custom shaders, and unusually precise motion. The visual is distinctive and
the interaction is deliberate rather than decorative.

### Why it works
- **Depth of craft over breadth of effects.** One signature WebGL moment carries the
  whole site.
- **Motion has weight.** Easing, timing, and stagger feel physically consistent.
- **The UI stays out of the way.** Navigation is minimal; the visual is the product.
- **Performance discipline.** Real-time graphics are optimized so the experience
  remains smooth instead of becoming a tech demo that stutters.

### Motion & tech (reported)
- Three.js / WebGL, custom GLSL shaders, GPU-friendly transforms.
- Careful render-loop management and pixel-ratio caps.

### Steal for matrixfolio
- **One hero canvas, done well.** Our digital rain is the signature; we will not add
  a second competing WebGL scene.
- **Consistent easing language** across CSS, GSAP, and canvas.
- **Cap devicePixelRatio at 2** and pause rendering when offscreen/hidden.

### Don't copy
- Shader-heavy 3D everywhere. It is the fastest way to lose the 60fps budget on a
  mid-range laptop.

---

## 6. Jesse Zhou — jesse-zhou.com

**Who:** Creative developer.
**Archetype:** 3D narrative portfolio.

### What it is
An interactive 3D experience built with Three.js and Blender assets, presenting
skills, experience, and hobbies as a spatial narrative. It is designed to remain
usable on mobile as well as desktop.

### Why it works
- **Art direction first.** Custom 3D assets give the site a look that cannot be
  bought as a template.
- **Narrative structure.** The 3D scene is not a toy; it carries the story.
- **Mobile considered.** The experience is adapted, not simply shipped and broken.
- **Personality.** Hobbies and interests make the person behind the résumé visible.

### Motion & tech (reported)
- Three.js + Blender for assets.
- Responsive 3D scene composition and performance tuning.

### Steal for matrixfolio
- **A narrative spine.** Our scroll is a story: wake up → choose → see the system →
  the work → plug in → exit.
- **Personality beats.** A "deja vu" moment, a black cat, a glitch, a hidden terminal
  command — details people talk about.
- **Asset pipeline discipline.** When the user supplies images/video/3D, define slots
  and budget before dropping them in.

### Don't copy
- A Blender-heavy pipeline for v1. We ship CSS/canvas visuals first, then upgrade
  with real assets.

---

## 7. Adham Dannaway — adhamdannaway.com

**Who:** Designer and developer.
**Archetype:** Split-screen dual identity.

### What it is
The homepage is split in two: design work on one side, code on the other. The layout
itself communicates "half designer, half programmer" before a single word is read.

### Why it works
- **The concept is the layout.** No explanatory copy is needed.
- **Immediate differentiation.** Most portfolios claim breadth; this one demonstrates it.
- **Simple, legible, fast.** The idea is strong enough that the execution can stay clean.
- **Clear paths.** Each half leads to the relevant body of work.

### Motion & tech
- Split-screen layout, CSS/JS interactions, restrained hover effects.

### Steal for matrixfolio
- **Let the structure carry the message.** A "dual reality" layout — simulation vs.
  reality, design vs. engineering — is a natural fit for the Matrix theme.
- **No explanatory paragraph where a layout can do the job.**
- **Two clear doors:** "See the work" and "Open a channel".

### Don't copy
- A literal 50/50 split. We use the duality idea inside the red-pill / blue-pill beat.

---

## 8. Keita Yamada — p5aholic.me

**Who:** Creative coder / frontend developer.
**Archetype:** Radical minimalism.

### What it is
A small, clean site: a short bio, a projects page, contact, and a light/dark toggle.
Almost nothing else. It is beloved precisely because it refuses to add more.

### Why it works
- **Confidence through subtraction.** If the work is good, the site does not need to
  shout.
- **Typography and spacing do the heavy lifting.**
- **Fast and accessible by construction.**
- **A tiny delightful detail** — the theme toggle — is enough personality.

### Motion & tech
- Minimal stack, lightweight pages, restrained interaction.

### Steal for matrixfolio
- **Kill sections that do not earn their scroll.** Our v1 has seven beats, not twelve.
- **One small signature detail** that visitors can discover (terminal command,
  Konami-style glitch, "there is no spoon" hover).
- **A real content hierarchy underneath the spectacle.**

### Don't copy
- Minimalism as the primary aesthetic. Matrix needs atmosphere; we keep the
  discipline, not the blank page.

---

## 9. Robby Leonardi — rleonardi.com

**Who:** Interactive designer / illustrator.
**Archetype:** The scroll-game résumé.

### What it is
An interactive résumé drawn as a side-scrolling video game. Scrolling moves the
character through levels that represent career stages, skills, and projects.

### Why it works
- **Scroll is the timeline.** The interaction model matches the content model.
- **Illustration gives it a soul.** It could not be mistaken for a template.
- **Narrative momentum.** Each scroll increment reveals a new scene, so users keep going.
- **The format proves the skill.** Illustration + animation + frontend in one artifact.

### Motion & tech
- Scroll-driven scene transitions, illustrated assets, vanilla JS/CSS.
- Character and environment animation tied to scroll position.

### Steal for matrixfolio
- **Scroll as a story spine** rather than a stack of sections.
- **Scene-to-scene transitions** — each beat should change the visual state, not just
  fade in another card.
- **A memorable protagonist.** Ours is the cursor / the visitor as "The One".

### Don't copy
- Gamified navigation that hides information. Our scroll game still ends at a
  readable portfolio with a contact CTA.

---

## 10. Tobias van Schneider — vanschneider.com

**Who:** Designer, creative director, founder.
**Archetype:** Editorial personal brand.

### What it is
A minimal, opinionated portfolio where strong typography and confident copy carry
the experience. Projects are framed as business decisions, not galleries of pixels.

### Why it works
- **Point of view.** The site sounds like a person, not a LinkedIn profile.
- **Case studies framed as problems and outcomes.** Recruiters and clients hire
  thinking, not thumbnails.
- **Editorial rhythm.** Big type, deliberate whitespace, short paragraphs.
- **The brand is the through-line.** Everything looks like it belongs to the same mind.

### Motion & tech
- Typography-led layout, restrained transitions, CMS-driven content.

### Steal for matrixfolio
- **A voice.** The copy should be written in the world of the Matrix, not generic
  "passionate developer" language.
- **Problem → intervention → outcome** for every project.
- **One visual system** — type, color, grid, motion — repeated until it feels owned.

### Don't copy
- The exact editorial-minimal layout. We keep the voice and the case-study rigor.

---

## Cross-cutting patterns (what all ten agree on)

1. **Five-second legibility.** Who you are, what you do, and what to do next are
   clear before any scroll. Spectacle never delays comprehension.
2. **One idea, fully committed.** The best sites can be described in one sentence.
   Bruno = drive a 3D world. Robby = scroll through a game. Adham = split identity.
3. **Motion hierarchy.** One signature moment, a few supporting reveals, and
   micro-interactions. Not every section fights for attention.
4. **Curation over volume.** Three to six strong projects with context beat twenty
   thumbnails.
5. **Performance is design.** The premium feel comes from 60fps and instant response
   as much as from art direction.
6. **Accessibility is not optional.** Reduced-motion paths, keyboard focus, contrast,
   and semantic structure separate craft from demo.
7. **A fallback for every spectacle.** If the 3D fails, the work must still be reachable.
8. **Personality is a differentiator.** The black cat, the car, the theme toggle —
   small, memorable details outperform generic polish.

---

## Synthesis — the matrixfolio thesis

> **"The portfolio is a simulation you can inspect."**

- **From Bruno:** build a world, not a page. The site is the proof.
- **From Rauno:** every interaction answers immediately; motion is interruptible.
- **From Dennis:** one motion language, magnetic CTAs, staggered line reveals.
- **From Brittany:** numbered sections, sticky HUD, real project context, speed.
- **From Aristide:** one canvas, executed with a strict performance budget.
- **From Jesse:** a narrative spine and personality beats.
- **From Adham:** let the structure state the duality.
- **From Keita:** subtract until only the essential remains.
- **From Robby:** scroll is the timeline; each beat changes the scene.
- **From Tobias:** write like a human with a point of view.

### The seven beats (v1)

```
00 BOOT        Wake up… — terminal preloader
01 HERO        The digital rain + name as a system signature
02 CHOICE      Red pill / blue pill — the site's central metaphor
03 MANIFESTO   Scroll-scrubbed simulation-theory statement
04 WORK        Pinned horizontal transmissions (projects)
05 CAPABILITIES Terminal readout (skills / stack)
06 CHANNEL     Contact — "open a channel", magnetic CTA
07 EXIT        "There is no spoon." + system status footer
```

### Non-negotiables

- LCP under 2.0s on a mid-range laptop / fast 4G.
- 60fps scroll on desktop, stable 30fps+ on mid-range mobile.
- No layout shift from fonts, canvas, or the preloader.
- `prefers-reduced-motion` gets a complete, static, readable experience.
- The work and contact are reachable in one click from anywhere.
- No dependency that does not directly buy motion, speed, or DX.

---

## Sources & further reading

- CSS Design Awards — 2025 Website of the Year winners:
  https://www.cssdesignawards.com/blog/2025-website-of-the-year-winners/430
- Awwwards — site of the day / developer awards: https://www.awwwards.com
- Bruno Simon — https://bruno-simon.com
- Rauno Freiberg — *Invisible Details of Interaction Design*: https://rauno.me/craft
- Dennis Snellenberg — https://dennissnellenberg.com
- Brittany Chiang — https://brittanychiang.com
- Aristide Benoist — https://aristidebenoist.com
- Jesse Zhou — https://jesse-zhou.com
- Adham Dannaway — https://adhamdannaway.com
- Keita Yamada — https://p5aholic.me
- Robby Leonardi — https://rleonardi.com
- Tobias van Schneider — https://vanschneider.com
- Active Theory — https://activetheory.net
- "15 Best portfolio website examples for inspiration in 2025" — Position Is Everything
- "Web developer portfolio examples" — Scoutt
- "Award-Winning Websites — 2025–2030 Reference" — coroboros/research (GitHub)

> Note: stack details are reported from public teardowns and may change as sites are
> rebuilt. Treat them as directional, not as audits.
