# Projects section — design spec

What `src/components/Projects.tsx`, `Schematic.tsx`, `architectures.ts`,
`unfileSound.ts` and the `.proj-*` / `.schem-*` block in `src/app/globals.css` build.

For the site-wide palette, typography and chassis this sits inside, see the root
`design.md`. This file covers only the Projects section.

---

## The idea

**Folders with their name tags along the top.** The tags sit in a row on the top edge and the
body below shows whichever folder is open. Opening one is a single click, and every tag is
legible at once.

This is the pile idea without the pile's problem. An earlier version stacked the folders
deep enough that three of four were buried behind the front one — the tags were the only
navigation and they were the first thing the stacking hid.

Between the pile and this there were three other attempts (a panel stack, a window cascade,
a split-pane file manager) and a schematic-first row layout with no selection at all. What
survived all of them, and is the actual content of the section, is the **architecture
diagram per project** — see below.

### The trade this version makes

Three of four bodies are closed at any moment. They stay in the DOM as `hidden` panels rather
than being unmounted, so every description is still there to be read and indexed; but unlike
the rows layout, a reader does have to click to see three of them.

That is the cost of the tags-on-top shape, and it is a deliberate choice rather than an
oversight.

---

## Layout

```
<section id="projects">                    py-24 px-6 section-divider band-paper
  header row                               eyebrow + h2 + lede + .audio-toggle
  <div role="tablist" class="fold-tabs">   the name tags
    <button role="tab" class="fold-tab">   01 · PAPYRUS · live pip          x N
  <div class="fold-body">                  one open folder at a time
    <div role="tabpanel" hidden>           x N, all but one hidden
      <div class="proj-body">              1 col; 2 cols at lg
        <div class="proj-text">            h3, kicker, description, tags, actions
        <div class="proj-stage">
          <div class="stage" data-stage>   the diagram, or the video in its place
          <div class="stage-timer">        only while a countdown is running
          <div class="stage-nav">          Back · dots · Next   (only where there is a reel)
```

The tag row sits on `margin-bottom: -1px` so the open tag can erase its own segment of the
body's top border, and tag and folder read as one piece of card.

### Reading order and visual order differ, deliberately

`.proj-text` comes **first in the DOM** so the heading leads, and is moved to the right-hand
column visually with `grid-column: 2` at `lg`. That is allowed because the diagram is a
figure supporting the folder, not the start of its story — a screen reader gets name,
summary, description, then the diagram's `alt`, which is the order that reads well.

At `lg` the grid is `1.35fr / 1fr`, so the stage lands near **545px** — close to the 560-unit
viewBox the schematics were drawn against, which is why their labels stay legible.

---

## Data

```ts
type Project = {
  title: string;        // the name tag, and the h3 inside the folder
  kicker: string;       // one line under the heading
  description: string;
  tags: string[];
  liveUrl: string;      // "" means not deployed — drives the tag's pip and the Launch action
  codeUrl: string;
  youtubeUrl?: string;  // "YOUR_VIDEO_ID" means no reel yet
};
```

| Function | Job |
|---|---|
| `hasDemo(url)` | False for a missing URL or the `YOUR_VIDEO_ID` placeholder — decides whether the folder has a second stage at all |
| `isLive(url)` | False for `""` or `"#"` — drives the tag's pip and whether Launch is rendered |
| `getEmbedUrl(url)` | `youtu.be/…`, `?v=…` and `/embed/…` all normalise to a `rel=0&modestbranding=1` embed |
| `runDuration(diagram)` | The animation's own length, from the graph's depth. The auto-advance times off this |
| `pad(n)` | `1` → `"01"` |

`TOTAL` and `DEPLOYED` are counted from the array so the lede cannot drift when a project is
added. `TYPE_COLOUR` gives each name tag its colour strip.

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

## The stage: two stages in one frame

Each folder's right-hand side is a **stage** with two states: the running schematic, then
the demo video. The video **replaces** the diagram rather than appearing below it, and a
`Next` / `Back` pair plus a two-dot indicator moves between them.

### It is a fixed 16:9, deliberately

Both stages occupy exactly the same box. A schematic is roughly 560×170 and a video is 16:9,
so letting the frame size itself would make advancing jolt the page — and it advances *on
its own*, which makes a jolt much worse than it would be after a click. The diagram is
scaled to fit and centred, which leaves some air above and below it. That air is the price
of the two stages never moving anything.

### The swap

The two stages **slide past each other**: the incoming one enters from the right, the
outgoing one leaves to the left. Going back reverses it. Direction is a `--dir` custom
property on `.stage` (`1` forward, `-1` back) that both keyframes read, so one pair of
animations covers both directions.

**Both layers are on screen for the whole slide**, which is what lets the outgoing stage
actually travel rather than just vanishing. That has one consequence worth stating plainly:

> The video layer and the diagram layer are **keyed siblings** of `.stage`, not two branches
> of a ternary. If they were nested branches, React would unmount and remount the iframe on
> every transition — refetching the video each time you stepped back to the diagram. The
> stable `key="demo"` is doing real work.

The frame itself never changes. The recessed screen look belongs to the video *layer*, so it
travels with it — when that styling sat on `.stage`, the whole box restyled the instant the
slide began, and a box changing appearance while its contents move reads as a light
switching on rather than as anything sliding.

An earlier version collapsed the stage to a line and exchanged the content at the pinch.
That hid the iframe's first paint, which the slide does not — a video sliding in while it
loads is legible, though, in a way a crossfade dissolving into a grey rectangle is not.

Under `prefers-reduced-motion` the slide is skipped in JS and the keyframes are disabled in
CSS as well.

### Clicking a name tag always replays

`open` has **no `i === active` early return**. Clicking the folder you are already in is a
request to play it again, and returning early there was exactly why a second click did
nothing. Three cases:

| You click | What happens |
|---|---|
| A different folder | Reset outright — any swap still in flight is cancelled, since it belongs to the folder being left |
| The folder you are in, showing the demo | `swapTo(0)` slides back, which replays the diagram on the way in |
| The folder you are in, showing the diagram | The animation simply runs again |

All three clear `paused`, so a countdown is armed every time.

### It runs once per folder, and only once

The jump to the demo is an **introduction, not a behaviour**. Each folder makes it the first
time it is open and on screen; after that it never fires again for that folder, however many
times the diagram is replayed.

It used to re-arm on every run, and that was wrong in a specific way: a diagram you had gone
*back* to in order to read would take itself away again while you were still reading it. The
one thing the reader had just asked for was the one thing the countdown then undid.

`introduced` is a `useRef<Set<string>>` keyed by project title — a ref because writing it must
not re-render and nothing on screen derives from it. A title is added **before** the timer is
set rather than inside it, so a countdown that gets cancelled still counts as the
introduction having been offered; otherwise leaving the folder and coming back would arm it
again, which is the thing being fixed.

`paused` still cancels a countdown in flight — it just has nothing to re-arm afterwards.

There was a `Run` key beside `Source` and `Launch` for this. It was removed: clicking the open
folder's tag already replays the diagram (`open()` has no `i === active` early return, which is
deliberate), so `Run` was a third way to do a thing two controls already did.

The ordering that makes this work is subtle: the cancel handlers fire on `pointerdown`, which
precedes `click`, so `Back` re-arms *after* its own press has cancelled. And
`pointerenter` does not re-fire while the cursor stays inside the folder, so a reader whose
mouse is already resting on `Back` still gets the next pass.

Nothing auto-advances from the video: stage 2 has nowhere to go, so the sequence is bounded
at one swap per run rather than looping.

**The delay is derived, not typed.** `runDuration(diagram)` in `Schematic.tsx` returns the
animation's own length from the graph's depth, and `HOLD` (1s) is added to it. A deeper
pipeline therefore gets proportionally longer instead of being cut off by a fixed clock.
Papyrus runs for about 2s, so its sequence lands at about **3 seconds**.

> **One deviation worth naming.** Scrolling does *not* cancel the auto-advance, even though
> "any interaction" would normally include it. The countdown only starts once the folder is
> on screen, so scrolling to reach it would otherwise guarantee it never ran. Everything
> else — hover, click, focus, keypress — cancels it.

### The video never autoplays

Advancing mounts the player; it does not start it. `autoplay` is deliberately absent from
the iframe's `allow` list, so arriving at stage 2 can never make noise on its own.

### The countdown is not visible

There was a thin progress line under the stage while an advance was pending. It is gone,
along with `.stage-timer` and the `stageCount` keyframes.

It was earning its place when the advance fired on every run — a thing that happens to you
repeatedly needs to be something you can see coming and stop. Now that it happens **once per
folder**, a permanent bar advertising a one-time event is more chrome than the event is
worth, and the `sr-only` live region still announces the change either way.

### No reel yet

The three projects without a real video **have no stage nav at all** — a two-step control
strip on a one-step folder is two dead buttons. They get a plain line instead: "No demo reel
on file yet."

An earlier version rendered `Next` disabled with an `sr-only` explanation. Hiding it is
better: nothing should imply a second stage that does not exist.

### The arrows

Two arrow buttons sit **over the stage**, vertically centred against its edges. Each is
hidden until the cursor comes near that side, revealed by a narrow hover strip down that
edge. The dots sit centred in the strip underneath, on their own.

**The strips cover the middle band only** — roughly 26% to 74% of the height. At the video
stage the top and bottom of the frame are YouTube's own title and control bars, and a strip
running the full height would take clicks meant for the player.

**Both arrows always act, and they wrap.** Right moves forward, left moves back, and with
two stages either lands on the other one. `swapTo` therefore takes an explicit direction:
which way the slide travels is no longer implied by which stage is arriving, because the
right arrow moves forward even when it is returning to stage 0.

That wrapping paid for a deletion. The old `Back` / `Next` key caps disabled themselves at
the ends, which meant a press could leave a keyboard user focused on a control that had just
gone dead — so there was a pending-focus ref and an effect to move focus off it. **Nothing
is ever disabled now, so all of that is gone.**

### Hover is not the only way in

A control that appears on hover does not exist on a phone and cannot be found with a
keyboard. So the arrows are also:

- permanently visible under `@media (hover: none)`;
- revealed on `:focus-visible`, and in the tab order like any button.

Without both, the only route to the demo on touch would be to wait out the auto-advance, and
with a keyboard there would be none at all.

### It runs once per folder, and only once

The jump to the demo is an **introduction, not a behaviour**. Each folder makes it the first
time it is open and on screen; after that it never fires again for that folder, however many
times the diagram is replayed.

It used to re-arm on every run, and that was wrong in a specific way: a diagram you had gone
*back* to in order to read would take itself away again while you were still reading it. The
one thing the reader had just asked for was the one thing the countdown then undid.

`introduced` is a `useRef<Set<string>>` keyed by project title — a ref because writing it must
not re-render and nothing on screen derives from it. A title is added **before** the timer is
set rather than inside it, so a countdown that gets cancelled still counts as the
introduction having been offered; otherwise leaving the folder and coming back would arm it
again, which is the thing being fixed.

`paused` still cancels a countdown in flight — it just has nothing to re-arm afterwards.

There was a `Run` key beside `Source` and `Launch` for this. It was removed: clicking the open
folder's tag already replays the diagram (`open()` has no `i === active` early return, which is
deliberate), so `Run` was a third way to do a thing two controls already did.

The ordering that makes this work is subtle: the cancel handlers fire on `pointerdown`, which
precedes `click`, so `Back` re-arms *after* its own press has cancelled. And
`pointerenter` does not re-fire while the cursor stays inside the folder, so a reader whose
mouse is already resting on `Back` still gets the next pass.

Nothing auto-advances from the video: stage 2 has nowhere to go, so the sequence is bounded
at one swap per run rather than looping.

**The delay is derived, not typed.** `runDuration(diagram)` in `Schematic.tsx` returns the
animation's own length from the graph's depth, and `HOLD` (1s) is added to it. A deeper
pipeline therefore gets proportionally longer instead of being cut off by a fixed clock.
Papyrus runs for about 2s, so its sequence lands at about **3 seconds**.

> **One deviation worth naming.** Scrolling does *not* cancel the auto-advance, even though
> "any interaction" would normally include it. The countdown only starts once the folder is
> on screen, so scrolling to reach it would otherwise guarantee it never ran. Everything
> else — hover, click, focus, keypress — cancels it.

### The video never autoplays

Advancing mounts the player; it does not start it. `autoplay` is deliberately absent from
the iframe's `allow` list, so arriving at stage 2 can never make noise on its own.

### The countdown is not visible

There was a thin progress line under the stage while an advance was pending. It is gone,
along with `.stage-timer` and the `stageCount` keyframes.

It was earning its place when the advance fired on every run — a thing that happens to you
repeatedly needs to be something you can see coming and stop. Now that it happens **once per
folder**, a permanent bar advertising a one-time event is more chrome than the event is
worth, and the `sr-only` live region still announces the change either way.

### No reel yet

The three projects without a real video **have no stage nav at all** — a two-step control
strip on a one-step folder is two dead buttons. They get a plain line instead: "No demo reel
on file yet."

An earlier version rendered `Next` disabled with an `sr-only` explanation. Hiding it is
better: nothing should imply a second stage that does not exist.

### Focus after advancing

Pressing `Next` disables `Next`. Without help a keyboard user is left focused on a dead
control, so `goStage` records which button should take focus and an effect moves it after
the render — to `Back` on advancing, to `Next` on going back.

**The automatic advance sets no pending focus.** Stealing focus from whatever someone is
reading is worse than the problem it solves.

---

## The tabs, the keys and the dots

### A deployed tab has a light on

Every name tag carries a pip. It was already lit for a deployed project and dim for a
source-only one; it now **breathes** as well — one cycle every 1.6s. Two details are
deliberate. It never goes fully out (it dips to 0.35), because a light that extinguishes
reads as a *fault*, which is the opposite of what this one means. And 1.6s is nowhere near
the three-flashes-per-second ceiling that makes blinking a seizure risk. Under
`prefers-reduced-motion` it simply stays on: still clearly lit against a dim pip, just not
moving.

### Two keys, not two identical keys

`Source` and `Launch` used to be the same key twice. `Source` is always present; `Launch`
only exists when something is actually deployed — so it is the **lit** one, the rarer and
more valuable door, and it presses in on `:active` like the solid key elsewhere on the site.
Cloud-white on `--meadow-deep` clears AA at 5.4, which is why that gradient runs *darker*
downward and never lighter.

Both carry an icon drawn in the schematic's language — straight segments, square caps, no
curves — stroked in `currentColor` so the glyph tracks the label through hover and focus
instead of needing rules of its own.

They **share the row out between them** (`flex: 1 1 9rem`) rather than hugging its left, so
the block ends flush with both edges of the justified paragraph above — the same shape the
text makes. Two keys sitting left with a gap of dead space to their right made the column
look like it had stopped early. The `9rem` basis is the point below which two will not sit
side by side: on a narrow column they wrap and each takes the full width instead of being
squeezed. Labels are centred, because the label is no longer the width of the key.

### The stage switch

A **two-position rocker** under the frame: `Flow` and `Demo` either side of a recessed track
with a knob that travels between them. The knob-s place on the track *is* the state — the words
report it rather than having to carry it alone.

That is what the previous version got wrong. Dots that became labelled keys on hover asked two
glyphs to hold the whole state and showed **neither label at rest**, so a reader had to hover
before they could learn what either dot went to.

**Square, not a pill.** Every corner on this site is 3-14px; a fully rounded track would have
read as a generic app toggle dropped onto a machine panel. The knob is knurled with a
repeating gradient — two hairlines from one background rather than two elements — because a
thumb-slide that is perfectly smooth does not look like it is meant to be pushed.

**The track takes no pointer events**, and the two labels- padding runs underneath it
(`padding-right: 2rem` on the first, `padding-left: 2rem` on the second). So the whole switch
is covered by one control or the other: a reader aiming at the knob — which is exactly what a
switch invites — lands on a real button instead of a dead strip in the middle.

The knob travels by **exactly its own width** (`translate: 100%`), so nothing has to be kept
in step with the track-s size if either changes.

### The description is justified

`text-align: justify` with `hyphens: auto`. The hyphenation is not optional at this measure:
the column runs about 55 characters, and justifying that narrow without letting words break
opens rivers of white down the paragraph.

### A rule that never matched

The `lg` grid placed `.proj-schem` in column 1. The section renders `.proj-stage` — that
selector had never matched anything, and the layout worked only because auto-placement had
exactly one free cell to drop the stage into. Named correctly, the arrangement is stated
rather than inferred.

---

## Sound

`unfileSound.ts` synthesizes a **classic click** — dry, mechanical, two Web Audio layers and
about 45ms end to end: 7ms of high-passed noise for the contact, and a short triangle
dropping through the mids for the body of the switch. Nothing is fetched or decoded.

- **On by default**, toggled from the **navbar** — an icon-only switch on the same key rail
  as the links, so it governs the whole site rather than this section. It used to sit beside
  the lede here, which is why that row was a flex.
- The preference lives in `localStorage` behind an **external store**
  (`subscribeSound` / `getSound` / `getSoundOnServer`), read with `useSyncExternalStore`.
  Storage does not exist on the server, and reading it via `setState` in an effect is a
  cascading render — the store renders the server snapshot during hydration and swaps after.
- Every call is wrapped in `try/catch`, and the `AudioContext` is created lazily. Browsers
  hold it suspended until a gesture; the first click *is* that gesture.

**This section no longer plays it itself.** `ClickSound.tsx`, mounted once in the root
layout, delegates from `document` in the capture phase and sounds every `button`, `a[href]`,
`summary`, `[role="button"]` and `[role="tab"]` on the page — currently ~40 controls. The
three explicit `playUnfile()` calls in `Projects.tsx` were removed when it landed, because
they would now double-fire. Capture phase is deliberate: the folder tabs stop propagation,
and a bubbling listener would go silent on exactly the controls the sound was written for.

Opt a control out with `data-no-click` on it or any ancestor. The navbar switch uses it —
otherwise the global listener would sound the click that turns sound *off*.

It fires on `pointerdown` rather than `click`, because the keys press in on `:active` and a
sound arriving on release would lag the visual by the length of the press. Keyboard
activation fires no pointer event, so `keydown` is handled alongside it: Enter or Space on a
button, Enter only on a link, since Space scrolls a link rather than following it.

---

## Interaction and accessibility

- The name tags are a horizontal `role="tablist"`; each folder body is a `role="tabpanel"`
  wired with `aria-selected`, `aria-controls` and `aria-labelledby`. IDs come from `useId()`.
- **Roving tabindex** — only the open folder's tag is in the tab order.
- **Keyboard:** ←/→ (and ↑/↓) move between folders and open them, Home/End jump to the ends.
  Opening from the keyboard runs the pipeline and plays the click exactly as a mouse does.
- **Every control has its own `:focus-visible` ring.** They all sit on custom backgrounds,
  where the browser default lands on too little contrast to rely on.
- Focus is moved off a control that the press just disabled — see **Focus after advancing**.
- The stage change is announced through one small `sr-only` live region in the nav
  ("Step 2 of 2: demo"), not by making the whole frame a live region: that would read the
  diagram's entire `alt` aloud on every advance.
- Each diagram carries an `alt` describing the flow in words. The boxes contain real SVG
  `<text>`, but their arrangement is the meaning, and that does not survive being read out
  box by box.
- **`prefers-reduced-motion: reduce`** removes the pulse, the box lighting, the folder-open
  transition and the countdown, and stops the folder advancing on its own. The diagram is
  drawn in full and simply sits there, which is the honest outcome — it already says
  everything the animation does.

---

## Performance and SEO

- **Closed folders are `hidden`, not unmounted.** Every description is in the document, so
  all four are indexable even though only one is on screen.
- **Zero iframes on load.** A player mounts only at stage 2 of the folder you are looking at.
- Schematics are inline SVG generated from data — no image requests.
- No animation loop and no `requestAnimationFrame` work: the run is pure CSS, plays once, and
  is armed by a single `IntersectionObserver` that disconnects immediately after.

---

## Invariants

Break these and the section stops working, in ways that are not obvious from the diff.

1. **`.crt-lines` stays `pointer-events: none`.** It covers the stage at its video state, and
   a live YouTube player sits underneath — without that rule it swallows every click meant
   for the player.
2. **The stage stays a fixed 16:9.** Both stages share one box. Sizing the frame to its
   contents would make the auto-advance jolt the page, which is far worse unprompted than it
   would be after a click.
3. **The iframe mounts only at stage 2.** Rendering it hidden would reintroduce the four
   players the original grid loaded, and `autoplay` stays out of its `allow` list so
   advancing can never make noise.
4. **The auto-advance is gated on in-view AND not-held.** Drop either and the section either
   moves content nobody is looking at, or moves it out from under someone reading.
5. **`SWAP_MS` in `Projects.tsx` must match `@keyframes stageSlideIn` / `stageSlideOut`.**
   It is how long both layers stay mounted. Too short and the outgoing stage is cut off
   mid-travel; too long and a dead layer sits over the live one.
6. **The two stage layers stay keyed siblings.** Collapsing them into a ternary remounts the
   iframe on every transition, which refetches the video each time you step back.
7. **`.stage` looks the same in both states.** Anything that restyles the frame on stage
   change competes with the slide — the box appears to switch rather than the contents to
   move. Per-stage styling belongs on the layer, which travels.
8. **`paused` cancels a pass, never the feature.** `goStage(0)` and `run` both clear it, and
   they must keep doing so — that is the whole of "the swap follows every run". Setting it
   permanently is how the auto-advance quietly becomes a once-per-page-load thing again.
9. **`swapTo` is the only path that changes stage.** Setting `stage` directly anywhere else
   would skip the transition for that one route, which is how a countdown ends up cutting
   while a button press animates.
10. **Both arrows always act.** Disabling one at an end reintroduces the problem the
    wrapping removed: a press can leave focus on a control that just died, which is why the
    pending-focus machinery existed and could be deleted.
11. **`aria-disabled` controls also get `pointer-events: none`.** They are guarded in their
   handlers as well, but a control that looks dead and still reacts to a click is worse than
   either failure alone.
12. **The pulse paths keep `pathLength="1"`.** Without it the dash pattern is measured against
   each path's real length, and a two-hop link and a long wrap animate at wildly different
   speeds.
13. **Replay remounts; it does not re-add a class.** CSS animation delays are relative to the
   element's lifetime, so re-adding `schem-run` to a live element replays nothing. The `key`
   on the animated group is doing real work.
14. **Nothing is armed on the server render.** If the animation classes were applied at mount
   instead of on intersection, every diagram would run at once for a reader who has not
   scrolled to any of them.
15. **A new diagram goes into `DRAFT` until its owner confirms it.** These are inferred from
   prose; publishing one as fact is a claim about work, not a styling decision. The four
   currently shipped have been confirmed; anything added later starts stamped.
16. **`.proj-text` stays first in the DOM.** Its right-hand position at `lg` is visual only.
   Reordering the source to match the visual layout would put a figure ahead of the heading
   that names it.
17. **Counts stay derived.** `TOTAL` and `DEPLOYED` are computed from the array; hard-coding
    them is how a portfolio ends up claiming four projects while showing five.
18. **VT323 is never bolded, and never set below 15px.** It ships a single 400 weight; a
    faux-bold fills in its bitmap counters.
19. **Folder colours must clear WCAG AA behind cloud-white text**, because a name tag's strip
    and the index chip use them. Raw `--poppy` and `--sky-deep` both fail, which is why
    `--label-c` and `--label-d` are darkened rather than taken from the palette directly.
---

## Tuning

| To change | Edit |
|---|---|
| How much room the diagram gets | The `grid-template-columns` on `.proj-body` at `lg` |
| Where the columns stack | That same media query |
| A schematic's layout | The box coordinates in `architectures.ts` — the renderer needs no changes |
| Whether a schematic shows DRAFT | The `DRAFT` set in `architectures.ts` |
| Run speed | `STEP` and `PULSE` in `Schematic.tsx` |
| Arrow reveal area | The `top` / `bottom` / `width` on `.stage-zone` — keep it clear of the video's own chrome |
| Swap speed | `SWAP_MS` in `Projects.tsx` **and** `@keyframes stageSlideIn` / `stageSlideOut` — all three together |
| How long the diagram holds before the demo | `HOLD` in `Projects.tsx`, added to `runDuration(diagram)`. The progress line reads the same number, so the two cannot drift |
| When the countdown may start | The `threshold` on the folder-body `IntersectionObserver` |
| Pulse and light appearance | `.schem-pulse` and `@keyframes schemLight` |
| Folder colours | `--label-a…d`, referenced through `TYPE_COLOUR` |
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
- **The auto-advance in practice.** Three seconds is brisk — the video arrives about a
  second after the pulse reaches the last box. `HOLD` is the dial if that turns out to be
  too little time to read the diagram.
- Whether the letterboxing above and below the diagram inside the 16:9 stage reads as
  deliberate framing or as wasted space.
- Whether the progress line reads as a helpful warning or as pressure. It is the one addition
  here that could go either way; removing it is one element and one CSS block.
- Whether 380ms is the right length for the slide, and whether the video sliding in while
  it is still loading reads acceptably or looks broken on a slow connection.
