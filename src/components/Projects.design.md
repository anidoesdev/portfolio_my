# Projects section — design spec

What `src/components/Projects.tsx`, `src/components/unfileSound.ts` and the `.nc-*` /
`.crt-*` block in `src/app/globals.css` actually build.

For the site-wide palette, typography and chassis this sits inside, see the root
`design.md`. This file covers only the Projects section.

---

## The idea

**A split-pane file manager.** A listing of projects on the left, the selected project's
contents on the right, a function-key bar along the foot — Norton Commander and its
descendants. The window is **light**: a paper-white application sitting on the cream band, not a dark
terminal cut into it.

It was chosen because it is the canonical retro-computer layout for *exactly this data
shape*: a list plus a detail view. Everything the section needs was already list-and-detail;
the earlier metaphors (a folder pile, a panel stack, a window cascade) were all spending
effort to make a physical object behave like one.

It also makes the `F1`–`F5` labels on the site nav mean something: the footer key bar is
where that convention comes from.

### What this retired

The cascade, the flying-clone morph, the click flap, the expansion rails, per-project case
tints, tilt/drift/inset, and the whole `--slot` placement system. A row in a listing cannot
fly into a pane without looking wrong, so the morph went with the metaphor rather than being
kept for its own sake.

The **CTAs also moved**. Launch and Source used to sit in the panel body; they now live in
the function-key bar, because in this metaphor that is where actions belong and keeping both
would be two sets of controls for the same two links.

### It uses the page's own colours

A dark version of this window existed briefly and was reverted. That one had to redeclare
`--foreground`, `--muted-fg` and their `--color-*` twins on `.nc` the way `#hero` does, so
that Tailwind text utilities would not vanish into the background.

**The light chassis needs none of that.** The section inherits the site's tokens like every
other section, which is one less place for the palette to fork. The only colour rules left
are the ones that are genuinely specific: the file-type bars, the amber-ink numerals and the
status words.

`--amber-ink` (`#7d5c0f`) does the work the bright `--amber` cannot — raw amber is
unreadable on a light ground at any small size. It is defined once, alongside the log-line
styles, and reused here for the file numbers and the `F`-key digits.

---

## Layout

```
<section id="projects">                      py-24 px-6 section-divider band-paper
  header                                     eyebrow + h2 + lede
  <div class="nc">                           the application window
    <div class="nc-bar">                     A:\PROJECTS ........ 04 FILES · 02 DEPLOYED
    <div class="nc-panes">                   1 col; 2 cols at 900px
      <div class="nc-pane">                  LISTING
        <div class="nc-pane-head">           NAME .......... STATUS
        <div role="tablist" class="nc-list">
          <button role="tab" class="nc-row"> ▸ 01 PAPYRUS.PRJ ···· ONLINE
        <div class="nc-list-fill">           the empty rest of the listing
      <div class="nc-pane">                  VIEWER
        <div class="nc-pane-head">           swatch + PAPYRUS.PRJ + 01/04
        <div class="nc-view">
          <div role="tabpanel" class="project-panel">  x N, all but one `hidden`
            <p class="nc-kicker">
            <div class="crt-well">           iframe or .crt-plate, + .crt-lines
            <div class="media-strip">
            description
            <div class="nc-tags">
    <div class="nc-keys">                    F4 SOURCE · F5 LAUNCH · F9 SOUND
```

- The listing pane is deliberately narrow (`19rem`) — it is an index, not the content.
- Below 900px the panes stack, listing above viewer.
- `.nc-list-fill` gives the listing a floor even with four files in it. A real file manager's
  listing runs to the bottom of its pane whether or not there is anything to fill it, and
  without it the pane collapses to the height of the rows.

---

## Data

```ts
type Project = {
  title: string;        // rendered as TITLE.PRJ in the listing and viewer header
  kicker: string;       // one line at the head of the viewer
  description: string;  // viewer only
  tags: string[];       // listed in the viewer; the count feeds the media strip
  liveUrl: string;      // "" means not deployed — drives ONLINE/LOCAL and the F5 key
  codeUrl: string;
  youtubeUrl?: string;  // "YOUR_VIDEO_ID" means no reel yet
};
```

| Function | Job |
|---|---|
| `hasDemo(url)` | False for a missing URL or the `YOUR_VIDEO_ID` placeholder |
| `isLive(url)` | False for `""` or `"#"` — drives the status word and whether F5 is a link |
| `getEmbedUrl(url)` | `youtu.be/…`, `?v=…` and `/embed/…` all normalise to a `rel=0&modestbranding=1` embed |
| `pad(n)` | `1` → `"01"` |

`TOTAL` and `DEPLOYED` are counted from the array so the lede and the window's own counter
cannot drift when a project is added.

`TYPE_COLOUR` is the only per-project styling left: the file-type colour, used for the
selection bar and the viewer header's swatch. All four are dark enough to hold cloud-white
text at AA, which matters because the selection bar puts white on them.

---

## The listing

A row is `▸ 01 PAPYRUS.PRJ ····· ONLINE`.

- The **selection bar is a solid block of colour**, not a border or a tint. That is the
  visual language of a file manager, and it is why the type colours had to be AA-safe
  against cloud white.
- Leader dots are a **flexed `border-bottom`, not a run of periods**, so they fill the gap
  exactly and can never wrap or overflow.
- The `▸` caret is `aria-hidden` and revealed by opacity, so rows do not reflow on selection.
- Each row carries an explicit `aria-label` of `"<title> — <kicker>"`. Without it the name
  would absorb the caret glyph, the number and the leader dots.

---

## The function-key bar

`F4 SOURCE`, `F5 LAUNCH`, `F9 SOUND`. Labels only — browsers reserve the real function keys
(F1 help, F5 reload) and hijacking them would be hostile.

**When a project has no deployment, F5 renders as a `<span>`, not a disabled anchor.** An
anchor without `href` is not a link, and leaving one in with `aria-disabled` would keep it
in the tab order still announcing itself as a link. The span is `aria-disabled` and dimmed,
and is simply not focusable.

---

## Sound

`unfileSound.ts` synthesizes a **classic click** — dry, mechanical, two Web Audio layers and
about 45ms end to end: 7ms of high-passed noise for the contact, and a short triangle
dropping through the mids for the body of the switch. Nothing is fetched or decoded.

There is deliberately no tail, no sweep and no settle. Two earlier versions had them — a
paper-and-latch sound, and a longer buckling-spring keyswitch — and both were reverted: a
machine's button is short and dry, and a long tail on something you click repeatedly wears
out fast.

- **On by default**, toggled from `F9`. Gains are low: this plays on a portfolio, in an
  office, near other people.
- The preference lives in `localStorage` behind an **external store**
  (`subscribeSound` / `getSound` / `getSoundOnServer`), read with `useSyncExternalStore`.
  Storage does not exist on the server, and reading it via `setState` in an effect is a
  cascading render — the store renders the server snapshot during hydration and swaps after.
- Every call is wrapped in `try/catch`, and the `AudioContext` is created lazily. Browsers
  hold it suspended until a gesture; the click that selects a row *is* that gesture.

---

## Interaction and accessibility

- Vertical `role="tablist"` / `role="tab"` / `role="tabpanel"`, wired with `aria-selected`,
  `aria-controls` and `aria-labelledby`. IDs come from `useId()`.
- **Roving tabindex** — only the selected row is in the tab order.
- **Keyboard:** ↓/→ and ↑/← move and open, wrapping at both ends; Home/End jump. Selection
  moves focus with it and plays the click, exactly as a mouse does.
- Focus ring is inset (`outline-offset: -2px`) so it is not clipped by the pane edge.
- The caret, the leader dots, the swatch and the scanline overlay are all `aria-hidden`.
- `prefers-reduced-motion: reduce` drops the panel fade, the blinking caret and the row
  transitions.

---

## Performance and SEO

- **All panels stay in the DOM**, inactive ones hidden with the `hidden` attribute, so every
  project's description is crawlable.
- **The iframe is mounted only for the selected project** (`hasDemo(...) && i === active`).
  The original grid loaded four YouTube players on page load.
- Scanlines are generated in CSS — no image requests.
- No morph clone, no per-frame animation, no `requestAnimationFrame` work.

---

## Invariants

1. **`.crt-lines` stays `pointer-events: none`.** It covers the media well, and the well can
   hold a live YouTube player — without that rule it swallows every click meant for it.

   > Two wider scanline layers used to exist as well: a page-wide `body::after` veil and an
   > `.nc::after` over the whole window. Both were removed — grey lines over a light ground
   > read as dirt, not as a screen. Scanlines now survive only on the media well, which is
   > the one surface that is actually a display.

2. **The media strip sits *under* the well, not over it**, for the same reason: an overlay
   there would take clicks meant for the player.
3. **The window does not fork the palette.** It runs on the site's own `--foreground` and
   `--muted-fg`. If it ever goes dark again, the fix is a token block on `.nc` — the way
   `#hero` does it — not per-element colour overrides, which is how a window ends up
   half-inverted.
4. **Type colours must clear WCAG AA behind cloud-white text**, because the selection bar
   fills a row with them. Raw `--poppy` and `--sky-deep` both fail, which is why
   `--label-c` and `--label-d` are darkened rather than taken from the palette directly.
5. **Panels are never remounted to re-trigger animation.** A `key` change would reload the
   YouTube iframe. `panelUnfold` restarts by itself when `hidden` is removed.
6. **F5 is a span, not a disabled anchor, when there is no deployment.** See above.
7. **Counts stay derived.** `TOTAL` and `DEPLOYED` are computed from the array; hard-coding
   them is how a portfolio ends up claiming four projects while showing five.
8. **VT323 is never bolded, and never set below 15px.** It ships a single 400 weight; a
   faux-bold fills in its bitmap counters.

---

## Tuning

| To change | Edit |
|---|---|
| Listing width | The `grid-template-columns` on `.nc-panes` at the 900px breakpoint |
| Where the panes stack | That same media query |
| Window colours | The `background` and `--nc-edge` on `.nc`, plus the title-bar and key-cap gradients |
| Text colours inside the window | Nothing local — it inherits the site tokens; `--amber-ink` covers the numerals |
| Scanline strength | `--scanlines`, and the `opacity` on `.crt-lines` — the media well is the only surface that still has them |
| File-type colours | `--label-a…d`, referenced through `TYPE_COLOUR` |
| Which keys are in the footer | The `.nc-keys` block in `Projects.tsx` |
| Sound loudness | The two `gain.setValueAtTime` values in `unfileSound.ts` |
| Sound default | `getSoundOnServer()` — returns `true`; it must match the server render |

---

## Not yet verified

The build, typecheck and lint pass. Most likely to need a pass in a real browser:

- Whether the light chassis reads as its own object on the cream band or dissolves into it.
  The bevel and the `0 2px 0` moulded edge are doing all of that work; the dark version had
  no such problem, but punched a hole in the page instead.
- Whether `19rem` is the right listing width once the real project names are set in VT323.
- The viewer pane's height against the listing's. The listing is short and the viewer is
  tall; `.nc-list-fill` gives the listing a floor, but the balance between them at desktop
  width is a guess.
