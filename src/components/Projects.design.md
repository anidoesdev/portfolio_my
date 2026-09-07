# Projects section — design spec

What `src/components/Projects.tsx`, `Schematic.tsx`, `architectures.ts`,
`unfileSound.ts` and the `.proj-*` / `.schem-*` block in `src/app/globals.css` build.

For the site-wide palette, typography and chassis this sits inside, see the root
`design.md`. This file covers only the Projects section.

---

## The idea

**Schematic-first rows.** One row per project, with that project's architecture diagram as
the main element and its text alongside. No selection, no detail pane, nothing hidden: a
reader who never clicks sees all four projects and how each one is built.

This inverts what four earlier versions did. A folder pile, a panel stack, a window cascade
and a split-pane file manager all changed the *packaging* while showing the same title,
sentence, video and tags. The diagrams — added last — were the first thing that made the
section more informative, and they were buried three levels down inside a viewer pane. This
version makes them the point.

### What it removed

The tablist, the roving tabindex, the `tabpanel` plumbing, the `hidden` panels, the
selection state, the keyboard arrow contract, and the two-pane grid. Each row is now a plain
`<article>` with a real `<h3>` — simpler for a crawler, simpler for a screen reader, and
simpler to reason about than any version that preceded it.

**Nothing is `hidden` any more**, so every description is in the document as visible text
rather than as a hidden panel a crawler has to be trusted to index.

---

## Layout

```
<section id="projects">                    py-24 px-6 section-divider band-paper
  header row                               eyebrow + h2 + lede + .audio-toggle
  <div class="flex flex-col gap-6">
    <article class="proj">                 x N
      <div class="proj-bar">               01 · PAPYRUS.PRJ ······ ONLINE
      <div class="proj-body">              1 col; 2 cols at lg
        <div class="proj-text">            h3, kicker, description, tags, actions
        <figure class="proj-schem">        the architecture diagram
      <div class="crt-well">               only while a demo is open
```

### Reading order and visual order differ, deliberately

`.proj-text` comes **first in the DOM** so the heading leads the row, and is moved to the
right-hand column visually with `grid-column: 2` at `lg`. That is allowed here because the
diagram is a figure supporting the row, not the start of its story — a screen reader gets
name, summary, description, then the diagram's `alt`, which is the order that reads well.

At `lg` the grid is `1.35fr / 1fr`, so the diagram column lands near **545px** — close to the
560-unit viewBox the schematics were drawn against, which is why their labels stay legible.

---

## Data

```ts
type Project = {
  title: string;        // heading, and TITLE.PRJ in the row bar
  kicker: string;       // one line under the heading
  description: string;
  tags: string[];
  liveUrl: string;      // "" means not deployed — drives ONLINE/LOCAL and the Launch action
  codeUrl: string;
  youtubeUrl?: string;  // "YOUR_VIDEO_ID" means no reel yet
};
```

| Function | Job |
|---|---|
| `hasDemo(url)` | False for a missing URL or the `YOUR_VIDEO_ID` placeholder — decides whether a Demo button exists at all |
| `isLive(url)` | False for `""` or `"#"` — drives the status word and whether Launch is rendered |
| `getEmbedUrl(url)` | `youtu.be/…`, `?v=…` and `/embed/…` all normalise to a `rel=0&modestbranding=1` embed |
| `pad(n)` | `1` → `"01"` |

`TOTAL` and `DEPLOYED` are counted from the array so the lede cannot drift when a project is
added. `TYPE_COLOUR` gives each row's index chip its colour.

---

## Architecture schematics

Every project's pipeline, drawn as a labelled block diagram in inline SVG.

**Diagrams are data, not hand-drawn SVG.** `architectures.ts` holds, per project, a list of
boxes with viewBox coordinates and a list of links; `Schematic.tsx` renders them. Four
routes cover every connection in all four diagrams:

| Route | What it draws |
|---|---|
| `h` (default) | Left to right, elbowing at the midpoint when the rows differ |
| `down` | A straight drop from one box into the one below it |
| `wrap` | Down, back across a `corridor` y, and into the start of the next row |
| `tie` | A dashed line with no arrowhead, for shared state such as a memory layer |

Moving a box is a coordinate change, not a redrawn path.

**The viewBox is ~560 units wide on purpose.** Label text is sized in viewBox units, so a
much wider viewBox would shrink the labels rather than making the diagram bigger.

### The DRAFT stamp

Each diagram was inferred from that project's written description, then confirmed by the
owner. All four ship clean — `DRAFT` is an empty `Set<string>` in `architectures.ts`.

The mechanism is kept for what comes next. A schematic is a claim about work someone did,
and it is exactly the kind of claim that gets probed in an interview, so **a new project's
diagram belongs in `DRAFT` until its owner has checked it** — and nobody should clear it on
someone else's behalf. Adding a title to that set brings the stamp back with no other change.

### Accessibility

Each `Diagram` carries an `alt` string — a plain-language reading of the flow — applied as
`role="img"` plus `aria-label`. The boxes do contain real SVG `<text>`, but their arrangement
is the meaning, and that does not survive being read out box by box.

---

## The demo

A `Demo` button appears **only on projects that have a real reel** — three of the four
currently have the `YOUR_VIDEO_ID` placeholder and so get no button at all, rather than a
dead control or an empty frame.

The iframe is mounted only while the demo is open. Combined with there being no default
selection, **the section now loads zero YouTube players**. The original grid loaded four.

The button carries `aria-expanded` and `aria-controls`, and the well it opens carries the
matching `id`.

---

## Sound

`unfileSound.ts` synthesizes a **classic click** — dry, mechanical, two Web Audio layers and
about 45ms end to end: 7ms of high-passed noise for the contact, and a short triangle
dropping through the mids for the body of the switch. Nothing is fetched or decoded.

- **On by default**, toggled beside the section lede.
- The preference lives in `localStorage` behind an **external store**
  (`subscribeSound` / `getSound` / `getSoundOnServer`), read with `useSyncExternalStore`.
  Storage does not exist on the server, and reading it via `setState` in an effect is a
  cascading render — the store renders the server snapshot during hydration and swaps after.
- Every call is wrapped in `try/catch`, and the `AudioContext` is created lazily. Browsers
  hold it suspended until a gesture; the click that opens a demo *is* that gesture.

> **It now fires rarely.** With selection gone, the only thing that plays a click is the
> Demo toggle, and only one project currently has a reel. The feature is worth keeping if
> more demos are coming; if they are not, it is a toggle and a synthesizer earning very
> little, and removing it would cost nothing else.

---

## Performance and SEO

- **Nothing is hidden.** All four descriptions are visible text in the document.
- **Zero iframes on load.** A player mounts only when a reader asks for one.
- Schematics are inline SVG, generated from data — no image requests.
- No selection state, no animation loop, no `requestAnimationFrame` work.

---

## Invariants

1. **`.crt-lines` stays `pointer-events: none`.** It covers the demo well, and the well
   holds a live YouTube player — without that rule it swallows every click meant for it.
2. **A Demo button exists only when `hasDemo` is true.** A control that opens an empty frame
   is worse than no control.
3. **The iframe mounts only while open.** Rendering it hidden would reintroduce the four
   players the original grid loaded.
4. **A new diagram goes into `DRAFT` until its owner confirms it.** These are inferred from
   prose; publishing one as fact is a claim about work, not a styling decision. The four
   currently shipped have been confirmed; anything added later starts stamped.
5. **`.proj-text` stays first in the DOM.** Its right-hand position at `lg` is visual only.
   Reordering the source to match the visual layout would put a figure ahead of the heading
   that names it.
6. **Counts stay derived.** `TOTAL` and `DEPLOYED` are computed from the array; hard-coding
   them is how a portfolio ends up claiming four projects while showing five.
7. **VT323 is never bolded, and never set below 15px.** It ships a single 400 weight; a
   faux-bold fills in its bitmap counters.
8. **Row colours must clear WCAG AA behind cloud-white text**, because the index chip fills
   with them. Raw `--poppy` and `--sky-deep` both fail, which is why `--label-c` and
   `--label-d` are darkened rather than taken from the palette directly.

---

## Tuning

| To change | Edit |
|---|---|
| How much room the diagram gets | The `grid-template-columns` on `.proj-body` at `lg` |
| Where the columns stack | That same media query |
| A schematic's layout | The box coordinates in `architectures.ts` — the renderer needs no changes |
| Whether a schematic shows DRAFT | The `DRAFT` set in `architectures.ts` |
| Row colours | `--label-a…d`, referenced through `TYPE_COLOUR` |
| Sound loudness | The two `gain.setValueAtTime` values in `unfileSound.ts` |
| Sound default | `getSoundOnServer()` — returns `true`; it must match the server render |

---

## Not yet verified

The build, typecheck and lint pass, and the page serves four rows with four diagrams and no
iframes. Most likely to need a pass in a real browser:

- **The diagrams at full size.** They were drawn to sit at roughly this width, but they have
  never been seen rendered. Box overlaps, arrows crossing labels, and the two wrap routes
  (Distill and Synthesis) are the likeliest problems.
- **Section length.** Four full-width rows with diagrams is a tall section. If it drags,
  the description is the first thing to shorten, not the diagram.
- Mobile, where the diagram column is narrower than the 560-unit viewBox and the labels
  shrink with it. There may need to be a floor below which the diagram scrolls sideways
  instead of scaling down.
- Whether the row bar, the tag chips and the diagram frame add up to too many nested boxes
  at a glance.
