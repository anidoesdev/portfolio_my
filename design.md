# Design System — Anika Jain Portfolio

A single-page Next.js portfolio built around one piece of artwork: `src/images/img.jpg`, a Ghibli-style meadow with a stone cottage under a big sky. The whole palette is sampled from that image — sunlit paper, sky blue, meadow green, deep forest, terracotta and poppy. The page opens on the meadow (Hero) and closes on the same meadow mirrored (Contact), with light, airy content bands in between.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (`@theme inline` tokens in `globals.css`), plain CSS utility classes for shared effects
- **Fonts:** `IBM Plex Mono` (body, var `--font-plex-mono` -> `--font-mono`) + `VT323` (display, var `--font-vt323` -> `--font-crt`), both via `next/font/google`. `Inter` and `Amarante` are still imported but nothing sets them any more — they are the pre-retro pair and can be dropped whenever you are sure you are not going back.
- **Icons:** Flaticon UIcons (solid-straight) via CDN `<link>`, plus inline SVGs for socials/arrows
- **Data viz:** `react-github-calendar` (dynamically imported, client-only) for the contributions graph
- **Deployment target:** Vercel

## Color Palette

Sampled directly from `src/images/img.jpg`. Raw palette + semantic tokens live in `:root` (`src/app/globals.css`), remapped into Tailwind via `@theme inline`.

**Raw palette** — measured from `src/images/img.jpg` (2560x1440) by bucketing pixels by HSL range and averaging, not by eyedropper. Percentages are how much of the image each bucket covers.

| Token | Hex | Measured from |
|---|---|---|
| `--paper` | `#faf7ea` | Sunlit haze / page base |
| `--paper-warm` | `#f1edda` | Warmer paper |
| `--cloud` | `#fffdf6` | Cloud white — text on dark fills |
| `--sky-pale` | `#e1f2f4` | Sky near the horizon |
| `--sky` | `#90ccd5` | Mid sky, lightened |
| `--sky-deep` | `#4496a6` | Sky, h190 s42 l46 — **12.4%** of the image |
| `--meadow-pale` | `#eff2d9` | Sunlit grass highlights |
| `--meadow` | `#9da541` | Field green, h65 s43 l45 — **12.2%** of the image |
| `--meadow-deep` | `#617023` | Grass shadow hue (h72), darkened to carry white text |
| `--forest` | `#21402d` | Tree shadow, h147 — primary text |
| `--stone` | `#b8a97e` | Cottage stonework |
| `--terracotta` | `#b55618` | Roof tiles, h24 s77 l40 — the accent |
| `--terracotta-ink` | `#9e4c15` | Same hue, darkened — small 11px eyebrow text only (see Contrast) |
| `--poppy` | `#d56138` | Red flowers in the foreground |
| `--sun` | `#e8cf43` | Yellow flowers / sunlight |

> The palette was re-measured after the source image was replaced with a 2560px version, which is graded differently from the original 736px file: the sky is more teal (h190, not h197), the meadow more olive (h65, not h76), and the darks lean blue-green. The tokens above reflect the current file.

**Semantic tokens:**

| Token | Value | Usage |
|---|---|---|
| `--background` | `var(--paper)` | Page base |
| `--foreground` | `var(--forest)` | Primary text |
| `--card` | `rgba(255,253,246,0.72)` | Card surfaces |
| `--muted-fg` | `#4f6147` | Secondary text |
| `--border` | `rgba(97,112,35,0.24)` | Default border |
| `--primary` | `var(--meadow-deep)` | Buttons, active nav, icons |
| `--accent` | `var(--terracotta)` | Hover states, eyebrows, org names |
| `--radius` | `0.1875rem` | Base corner radius — squared off for the retro chassis |

There is **no dark-section override** any more. Hero and Contact used to swap in a forest-night palette because they sat under a 75%-opacity dark scrim; they now sit under a *light* cream wash and use the same tokens as the rest of the page.

**Page canvas** — `body` paints three soft radial gradients over `--paper`: sky `rgba(68,150,166,.16)` top-left, meadow `rgba(157,165,65,.17)` mid-right, sun `rgba(232,207,67,.16)` at the foot. This reproduces the light in the artwork and keeps the page from reading as flat cream. `background-attachment: fixed` where supported.

**Corner radii** — one scale, four steps, as tokens rather than a literal per rule:

| token | value | used by |
|---|---|---|
| `--r-xs` | 3px | thin bars and small marks — the countdown line, the language swatch, the quest node, the eyebrow rule |
| `--r-sm` | 6px | chips, tags, keys, small controls — `.proj-key`, `.skill-chip`, `.retro-key`, `.glass-btn`, `.contact-cta` |
| `--r-md` | 9px | cards and panels — `.glass-card`, `.ach-card`, `.repo-card`, `.skill-group`, `.stage` |
| `--r-lg` | 14px | the big containers — `.fold-body`, `.fold-tab`, `.art-panel`, `.retro-nav` |

The site was drawn square (2px and 3px everywhere, which reads as sharp) and this rounds it
off. It is a **scale and not one value** because a chip and a folder body rounded by the same
amount look wrong together: the radius has to grow with the box, or the small things turn
into lozenges while the big ones still look square. `.fold-tab::before` sits 1px inside its
tab, so it takes `calc(var(--r-lg) - 1px)` — a nested corner needs a smaller radius than the
one around it or the two curves do not sit concentric.

True circles are **not** part of the scale and stay at `999px`: the deployed pip on a project
tab, the stage dots, the log pip.

**Screen colours** — `--crt-deep #0e1811`, `--phosphor #a8d84f`, `--amber #e8b23a`, for the places that are a *screen* rather than a case: the hero readout and the closing terminal. All three were referenced by the old `.boot` overlay from the day it was written and **never defined**, so those rules were invalid at computed-value time — that overlay-s background fell back to transparent and its text to the inherited dark green. The overlay is gone now (the hero readout replaced it), but the tokens stay: the closing terminal uses all three and the hero uses `--amber`. Both sections that sit on a photograph light their own accents brighter than `--phosphor`, which is tuned for a near-black ground.

**GitHub calendar** ramp, rebuilt on the meadow hue: empty `rgba(97,112,35,0.10)` -> `#aebb63` -> `#86953a` -> `#5e6c22` -> `#38460f`. The first attempt put `#dde3ad` at level 1, which composited to **1.05x** the empty cell's luminance — a day with commits was indistinguishable from a day without, which is the one distinction the graph exists to make. Empty was lightened and every filled step darkened; consecutive steps now sit at 1.58-1.78x, so the scale separates at every level rather than only at the top. A phosphor-on-dark version was tried during the retro pass and reverted.

## Contrast

Every text/background pairing is checked against WCAG AA (4.5:1 for normal text).

**Hero (light-on-dark).** Text sits directly on the artwork, so contrast depends on which pixels happen to fall behind it. This was solved numerically, not by eye: sample the image region the text block occupies, composite the scrim layers over those pixels, then take the **99th-percentile brightest** backdrop as the worst case. A flat 46% dim failed there (glass buttons 3.84, eyebrow 3.79). Adding a 50% radial centre pool — effective ~73% behind the text, still 46% at the corners — clears everything:

| Hero element | vs median backdrop | vs 99th-pct bright |
|---|---|---|
| `h1` / body `#fffdf6` | 8.1 | **6.3** |
| tagline `#e6ecb4` | 6.1 | **5.2** |
| eyebrow `#f7e7bd` | 6.1 | **5.3** |
| `.glass-btn` label (was a 13% cloud film) | 5.7 | **4.7** |

> **The retro pass improved this row, it did not endanger it.** `.glass-btn` went from a 13% *cloud* fill to a 58% *dark* fill, so cloud-white type on it now sits on a much darker backdrop than the 4.7 worst case above. The other rows are unchanged. Two new pairings were checked when the chassis landed: cloud-white on the `.btn-primary` gradient — which runs `--meadow-deep` → `#4c5a1a`, **darker downward, never lighter**, because a lighter top would drop it under 4.5 — and the terracotta hover, `#b55618` → `#8e4212`, at 5.0.

If the hero image is ever swapped again, re-run that check — a brighter photo will need a deeper pool.
 The palette is derived from a bright illustration, so this is not automatic — two issues were found and fixed when the tokens were re-measured:

- The roof colour taken straight from the image (`#b55618`) clears 4.5 on paper but only reaches ~4.2 on the sky and leaf band tints. Small text in that colour — the 11px `.eyebrow` labels and the 16px org names in Experience — uses `--terracotta-ink` (`#9e4c15`, same hue, darker) instead, which reaches 5.2. `--terracotta` itself is still used for borders, hover fills and larger text.
- The **previous** palette's terracotta (`#c4693f`) failed outright at 3.3:1 for eyebrow text. That was a real accessibility bug, not a drift.

Current ratios: body text 10.7, muted text 6.2, eyebrow ink 5.2-5.6, button text on `--meadow-deep` 5.4, button text on terracotta hover 4.8. If you change a palette token, re-check these — 16px semibold is **not** WCAG "large text" (that needs 18.66px bold or 24px), so it still requires the full 4.5.

## Typography

- **Display/headings** (`.section-heading`, `.display`, hero name, taglines): `VT323` via `--font-crt` — a CRT bitmap face, always in `--forest`. Section headings are `2.9rem` on mobile, `4.4rem` at `sm:` and up, uppercase, line-height 1. They run larger than the Amarante scale they replaced because VT323 reads small for its em. **Amarante is no longer used anywhere**, though it is still loaded in `layout.tsx`.
- **Body/UI text:** `IBM Plex Mono` via `--font-mono`, applied globally on `body`, with `p, li { line-height: 1.65 }` — a monospace needs the extra leading. `Inter` is still loaded and still the `--font-sans` token, but nothing sets it any more.
- **VT323 has a single 400 weight, exactly as Amarante did. Never `font-bold` it** — the browser synthesises a faux-bold that fills in the bitmap counters. `.display`, `.section-heading`, `.eyebrow`, `.retro-key` and the `.crt` helper all pin `font-weight: 400`. Nothing sets VT323 below `0.9375rem`, which is where it stops resolving.
- **Terminal type, scoped to `#projects` only:** `IBM_Plex_Mono` (`--font-plex-mono`, weights 400-700) for body copy and micro-labels, and `VT323` (`--font-vt323`, single 400 weight) for that section's heading, project titles and the phosphor plate. VT323 carries the whole machine surface — heading, titles, and every label, readout and chip — because the labels were **sized up to meet the face** (9-11px to 15-16px) rather than the face being dropped for them; Plex Mono keeps only the running prose, which needs a reading face. **VT323 carries the same rule as Amarante — never `font-bold` it**; the faux-bold fills in its bitmap counters. Both are exposed as `--font-crt` and `--font-mono` and both fall back to the system mono stack. No other section uses them.
- Hero name is a plain static `<h1>` — `text-4xl sm:text-6xl .display`, reading "Hi, I'm Anika". It sits inside the frosted `.art-panel`, so it is sized to the panel rather than the viewport. (An earlier `ScrambledText` component animated a scramble-decode reveal here; it was removed at the owner's request and the file deleted.)
- Eyebrow labels ("Selected work", "Toolkit", "Highlights", "Open source", "Contact") use the `.eyebrow` class: uppercase, `0.6875rem`, `0.18em` tracking, terracotta, preceded by a short sun-to-terracotta gradient dash (`::before`).

## Layout & Structure

Single scrolling page (`src/app/page.tsx`), sections in order:

1. **Navbar** — a **scale down the right edge**, not a bar across the foot. Six marks, one per section: a short flat rule each, lengthening and taking colour for the one you are in. Hovering the scale brings the names in from the right.
   **The tones are one ramp, not six choices.** `#3d7f8c` sky-deep at the head of the page, through meadow, to `#21402d` forest at the foot — so colour says *how far down you are*, which is the only thing a position scale has to communicate. Six unrelated hues would have looked livelier and meant nothing. All six clear **4.2:1** on cream, which a 3px mark needs to be seen at all. They live in `Navbar.tsx` as `--tone` per link, because they belong to the sections rather than to the rule.
   **The names sit outside the rail-s own width** (`right: 100%`), which is what keeps the hover strip narrow. Reveal-on-hover normally forces a choice between a wide invisible hit area that catches every stray pointer and a container that grows and shoves the page around; taking the labels out of flow avoids both. Each mark also gets a target taller than the line it draws — a 3px rule is not something to ask anyone to hit.
   **The active name stays out at rest**, which is the one deviation from a plain reveal-on-hover: a rail of unlabelled marks tells a reader the page has six parts and then refuses to say which one they are reading. Focus opens the names too, via `:has(.scale-item:focus-visible)`.
   **It never hides.** Over the hero and Contact — the two sections that run light-on-dark — it flips its whole palette instead: each link carries a `--lit` twin of its tone stepped along the same ramp, so *colour says how far down you are* survives the flip. The change is a fade rather than a cut, so crossing from Skills into Contact does not snap the rail to another palette.
   **The halo is doing the real work over the hero.** That section is a photograph, and under its dim a bright patch composites to a mid grey-green (~`#90a096`) where neither a dark mark nor a light one clears 3:1 — no fixed colour can, on an image spanning light to dark. A dark `drop-shadow` under a light mark makes its own local contrast, which is how any control sits over video. Contact needs none of it (flat `--crt-deep`, 10-17:1) but takes the same treatment so the two do not diverge.
   Earlier versions were a bevelled bottom pill, a transport strip with a travelling carriage, a spine of tabs down the left edge, and an edge-to-edge flat rule. The icon-only **sound switch** hangs below the scale past a gap — a control, not a seventh stop. It governs the click sound site-wide (see `ClickSound.tsx`) and carries `data-no-click` so turning sound *off* is silent
2. **Hero** (`#hero`) — **the machine that finished booting and stayed on.**
   The self-test used to be an overlay: it covered the hero for ~1.9s, wrote a flag to `sessionStorage`, then deleted itself — so it ran *once per session*, and a second visit in the same session saw nothing at all. The most distinctive thing on the site was built to destroy itself and then mostly not run. It does not clear now. The readout boots, the name resolves out of it, and the whole column stays lit.
   That removed more than it added: nothing to skip, nothing to remember, nothing to clear — so no state, no effect, **no client component**. `HeroBoot` is server-rendered markup and the stagger is `animation-delay` (`--d`, one sequence of 0.09s steps running the length of the column, handed across the component boundary so the readout continues the count rather than restarting it). A crawler and a reader with JavaScript off get exactly what everyone else does. The reveal uses `backwards`, not `both`: the element's own style *is* the finished state and the fill only reaches back over the delay, so switching the animation off leaves everything simply visible — no JS, no flash of empty hero.
   **Split field, not a centred stack.** The column reads on the left; the meadow is left alone on the right; one asymmetric scrim joins them rather than two boxes butting up. `.hero-dim` is heavy at the left edge and gone by ~74% — but only above 900px, where there is a right-hand side worth protecting. Below that the column is the full width and the heavy layer stays flat, since a horizontal fade there would just make the bottom of the text unreadable. Measured against a pure white pixel under the scrim: name 15.8:1, tagline 13.0:1, lede 12.2:1, check labels 10.9:1, `OK` 10.8:1, `READY` 8.3:1.
   The three check lines are not filler — they are the lede's three subjects (retrieval, agents, getting them into production) restated in the machine's register. The leader dots are a dotted border on a flex-grow span, `aria-hidden` because they are a rule and not something to read out. `READY` keeps the cursor, where a real self-test would leave it; Contact ends on a caret too, so the machine boots at the top of the page and is still idling at the foot.
3. **Projects** (`#projects`) — **folder tabs**: name tags along the top, one folder body below, each tab carrying a pip that **pulses when that project is deployed** (1.6s cycle, dipping to 0.35 rather than going out — a light that extinguishes reads as a fault; steady under `prefers-reduced-motion`, and well under the three-per-second flashing ceiling). The body is a two-column grid: architecture diagram left, text right, description **justified with `hyphens: auto`** — mandatory at a ~55-character measure, or justification opens rivers of white. Actions are two keys rather than the same key twice: `Source` always, `Launch` **lit** and rendered only when something is actually deployed, both with icons drawn in the schematic's straight-segment language and stroked in `currentColor` so they track the label through every state. The stage dots **become labelled keys on hover or focus** — `Flow` and `Demo`, the one you are on filled in `--meadow-deep` — and drop back to dots when the pointer leaves. One pair of buttons wearing two faces rather than two sets of controls, so two choices never become four tab stops; the group reserves the taller state's height so the swap cannot nudge the stage above it. It replaced a hover panel of thumbnails, which made the reader hover *and then look* to work out what a dot did; the readout is `aria-hidden` and holds no controls, since the dots already carry the full stage names on their `aria-label`s. The jump from diagram to demo now runs **once per folder**, the first time it is open and on screen, rather than re-arming on every replay: a diagram you had gone back to read would otherwise take itself away while you were reading it. The progress line under the stage went with it — a permanent bar advertising a one-time event is more chrome than the event is worth, and the `sr-only` live region still announces the change. Full spec, tuning notes and invariants live in `src/components/Projects.design.md`
4. **Experience** (`#experience`) — a **quest log**: entries down a dashed rail, each with a hollow node that lights while the role is still running (derived from the period reading *Present*, so it cannot contradict the dates beside it). Role and employer are set large in CRT type; period and **location** sit under them as a mono readout, on screen without opening anything. The dropdown control is a **drawn plus that loses its upright stroke on open**, in a bevelled square key that fills and inverts its bevel while open — it replaced a VT323 `▾`, whose weight, size and position on the line were all whatever the bitmap face decided. An `Active` chip that used to sit in the meta line is gone: the lit node already says a role is current, and so do the dates. Details expand as console output, animated `grid-template-rows: 0fr → 1fr` so nothing is clipped by a max-height guess. Unpanelled on purpose — the air between entries is what makes the hierarchy readable
5. **Skills** (`#about`) — a **spec sheet**, the page every machine shipped with. A `<dl>` of six rows: the category small and mono in a fixed 11rem label column, its entries set large in `--font-crt` and separated by middots. **Nothing has a border.**
   Three earlier versions drew each of the 29 entries as its own bordered object — pills, then chips in a rack elevation, then keycaps on a deck. Each of those is ~45 decorated elements on one screen, and *that* was the clutter, not the arrangement. The fix was to stop boxing them and let the type carry the section.
   Unpanelled on purpose, like the quest log: Achievements and the repo board are both bevelled-panel grids, and a third frame in the same stretch is what stops a reader telling those sections apart. The label column is fixed rather than auto so every entry starts on the same line down the page, which is the whole point of a spec sheet.
   **Semantics:** a definition list binds each category to its entries properly, and an `<h3>` inside each `<dt>` keeps the headings navigable — an early flat version had neither, so 29 items arrived with nothing to say what any of them belonged to. Entries are deduplicated: every skill appears exactly once.
   Dropping the category icons also retired the **Flaticon CDN stylesheet** from `layout.tsx`. Skills was its only consumer, so that is one render-blocking third-party request gone from every page load
6. **Achievements** (`#achievements`) — **record cards**: a bevelled bar with the label and its state (`RANKED` / `COMPLETE`), then the figure that matters set large. A placing is stored as rank + field size and the percentile is derived from them (`5472 / 69242 → Top 7.9%`), with the raw numbers printed underneath so the figure can be checked rather than taken on trust
7. **Contributions** (`#contributions`) — GitHub activity calendar in a `.glass-card`, followed by a board of **repository cards** (`.repo-card`) in the same bevel-and-title-bar language as the skill groups: repo name and stars in the bar, description in mono, language and forks along the foot. The whole card is the anchor — one target, one tab stop.
   **Pinned repos are only available through GitHub's authenticated GraphQL API**; REST cannot return them. So `getRepos()` queries `user.pinnedItems` when `GITHUB_TOKEN` is set and otherwise falls back to the top public non-fork repos by stars, and the heading says which of the two it is showing. Every failure path — no network, rate limit, bad token, malformed payload — returns an empty list and the block is dropped, so GitHub being unreachable can never break the build. Cached with `next: { revalidate: 3600 }`
8. **Contact** (`#contact`) — the **closing terminal**. Same `img.jpg` as the hero, mirrored (`scaleX(-1)`, `object-bottom`), dimmed to dusk rather than lifted to cream: the page opens on the field in daylight and closes on it after dark. **No panel** — the old `.art-panel` box read as a form floating on a photograph, and removing it is what makes the section an ending.
   **The dim is the hero's**, not a blackout: the same forest green (`rgba(33,64,45,0.6)`) over the same near-black pools (`rgba(16,34,24,0.66)`), inverted so the cream join sits at the head instead of the foot. A first pass buried the photograph under 94% black — dim, but not *this* dim, and it threw the field away. Because the image now shows through, contrast is measured against a **pure white pixel under the scrim** (the worst case the photograph can produce): heading 9.9:1, lede 7.7:1, keys 6.0:1, values 8.8:1, phosphor 6.8:1, footer 5.1:1. Without the two pools the same copy runs at **1.1-3.3:1** — they are load-bearing, not decoration.
   **Scattered, not stacked.** A twelve-column feel from a two-area grid: prompt top-left, the heading running wide on the left, lede and CTA under it, and the channel readout hanging off the right and **lower** (`align-self: end`), so the eye crosses the field instead of walking down a list. The mobile template matches DOM order exactly, so reading order and visual order never disagree. Channels are an aligned readout — key column a fixed `9ch`, one wider than LINKEDIN, so values fall into a column with no table and no grid hack — showing the **actual handles** rather than hiding them behind pills. One outlined phosphor key for the mailto (`--screen-lit #b9e26a`, a step brighter than the global `--phosphor`, which is tuned for the boot screen's near-black ground), and a blinking caret on the footer: the only thing still moving when you reach the bottom

Each content section shares:
- `py-24 px-6` vertical rhythm, `mx-auto max-w-5xl` container
- An eyebrow + heading + small decorative nature image pinned to the top-right (`hidden sm:block`, `mixBlendMode: multiply`): leaves, books, treasure, wood log, well, staircase
- `section-divider` — a hairline top rule that fades in from both edges and warms to `--sun` at the centre
- One of three **band tints**, alternating so the scroll does not flatten into a single sheet of cream. Each band is a vertical gradient that fades to transparent at both ends, so bands melt into each other instead of butting up:
  - `.band-paper` — warm white (Projects, Achievements)
  - `.band-sky` — pale sky (Experience, Contributions)
  - `.band-leaf` — pale meadow (Skills)

## Signature Components / Effects

- **Hero scrim** — three stacked layers over the artwork, painted top-down: a cream fade at the foot (so the hero dissolves into the page), a soft radial *centre pool* behind the text, and the flat dim itself. The pool exists because a flat dim strong enough for the bright cloud highlights would have crushed the whole image; grading it keeps the corners at 46% while the text band reaches ~73%. See **Contrast** for how those numbers were chosen.
- **`.glass-btn`** — the hero's three jump keys: a 58% dark fill, 45% cloud border, a bevel pair, and a `0 2px 0` moulded edge. `:active` presses the key 2px into the page. No blur.
- **`#hero` token scope** — the hero is the one light-on-dark region, so `--foreground`, `--muted-fg` and the eyebrow colour are all re-declared under `#hero`. Nothing else on the page inverts.
- **`.art-panel`** — the plate over the footer artwork: an opaque cream gradient, a bevel pair, a `0 3px 0` edge and a deep soft shadow. It keeps text legible without darkening the illustration, which is the whole point of using a bright, sunny image.
- **`.glass-card`** — a moulded case panel: cream gradient, `--case-edge` border, 3px corners, a hard 1px light/dark bevel pair and a `0 2px 0` edge. Used for achievement rows and the contributions panel.
- **`.glass-badge`** — a key cap: bevelled, 2px corners, for skill/tag chips, footer socials and the Source link. Interactive ones go terracotta on hover and invert their bevel on `:active`, so they read as pressed.
- **Projects schematic rows** — full spec, tuning notes and invariants live in `src/components/Projects.design.md`. In brief: one full-width row per project, with that project's **architecture diagram as the main element** and its text alongside. No selection, no detail pane, nothing hidden — which retired the tablist, the roving tabindex and the `hidden` panels that four earlier versions all carried. Each row is a plain `<article>` with a real `<h3>`. Diagrams are rendered from box-and-link data (`Schematic.tsx` + `architectures.ts`), not hand-written SVG, and carry a DRAFT stamp until their owner has confirmed them. **They also run**: a pulse travels each link in dependency order while boxes light in turn, with the timing derived from the graph itself rather than choreographed. Each diagram plays once when scrolled into view and replays whenever its name tag is clicked (a dedicated RUN key was tried and removed — the tag already did it); `prefers-reduced-motion` removes the motion entirely. Each folder is a **two-stage frame**: the running schematic, then the demo video in its place. Next/Back moves between them, and a folder advances on its own once its animation finishes — gated on being on screen, cancelled by any interaction, and skipped entirely under `prefers-reduced-motion`. The frame is a fixed 16:9 so advancing never jolts the page, and the player mounts only at stage two, so **the section still loads zero iframes**.
- **`.card-hover`** — lift-on-hover, now a shallow `translateY(-2px)` with the moulded edge deepening from 2px to 4px. Plastic does not float.
- **`.btn-primary`** — the one solid key on the board: a `--meadow-deep` → `#4c5a1a` gradient with cloud-white text, going **terracotta** on hover and pressing 2px down on `:active`. This green→terracotta move is still the site's one consistent interaction accent.
- **`.icon-btn`** — square bevelled key, meadow-green glyph, terracotta on hover, inverted bevel on press.
- **The log line** (`.log-row` and friends) — shared by Experience and Achievements: `.log-stamp` (a timestamp in `--amber-ink`), `.log-name`, `.log-dots`, `.log-status`, `.log-toggle`. The leader dots are a **flexed `border-bottom`, not a run of periods**, so they fill the gap exactly and can never wrap or overflow. `.log-detail` is a console continuation line, prefixed `>` via `::before`. Below `sm:` the row wraps and the dots are hidden — leader dots need a line to lead across.
- **`--amber-ink`** (`#7d5c0f`) — `--amber` is unreadable on cream at any small size, so log timestamps on light ground use this darkened version. 5.6:1 on `--paper`; the bright `--amber` stays for text on the dark screen surfaces only.
- **`.boot`** — the hero's power-on self-test. Server-rendered and **driven entirely by CSS animation**, so it clears itself after ~1.9s with or without JavaScript, and the hero content is always in the DOM underneath it. JavaScript adds only the skip control and the once-per-session rule, written straight to `dataset` rather than through state. `prefers-reduced-motion` hides it outright. The per-line delays are inline and the dismissal delay is in `.boot`; **the two have to stay in step**.
- **`.retro-nav` / `.retro-key`** — the bottom-centre nav as a moulded key strip; the current section's key is a pressed `--meadow-deep` cap, driven off `aria-current="page"` rather than a class string.
- **`.eyebrow`** — uppercase terracotta label with a sun→terracotta gradient dash before it.
- **Bottom floating navbar** — hidden for the whole hero, sliding up into view once `scrollY` passes the hero's bottom edge (minus 140px of lead-in). Uses `inert` + `aria-hidden` while hidden so it is not keyboard-reachable or announced. Fixed, centered, `bottom-5`, cream glass pill (`rgba(255,253,246,0.82)` + blur) with a meadow border. The active section is a solid `--meadow-deep` pill with cloud-white text; inactive links go terracotta on hover. Short labels on mobile / full labels on `sm:`.
- **Experience timeline** — left-hand vertical spine using a Flaticon tree glyph (`fi-ss-tree`) per entry connected by a thin meadow line; entries expand/collapse via `max-height` transition. Org names are terracotta.
- **Nature motif imagery** — decorative PNGs (`leaves_pile`, `books_bunch`, `treasure`, `wood_log`, `well`) rendered with `mixBlendMode: multiply` so they visually merge into the band tint instead of sitting on a white box.
- **Skills icon-pills** — every skill renders as a `glass-badge` pill with a small meadow-green Flaticon glyph (one icon per category: `fi-ss-brain` AI/ML, `fi-ss-browser` Frontend, `fi-ss-database` Backend, `fi-ss-cloud` Database & Cloud, `fi-ss-gears` MLOps, `fi-ss-terminal` Languages) so items stay visually grouped even without headers. Note: not every Flaticon UIcons class name renders a glyph on the free CDN tier — verify by screenshot, not just class-name presence in the stylesheet (e.g. `fi-ss-server-key` exists in the CSS but renders empty).
- **Project card corner badge** — a small circular `glass-badge` (not a raw multiply-blended image) sits at `top-2 right-2` inside each card's media area, holding `stair_case.png`. Plain `mixBlendMode: multiply` washes out over a photographic YouTube thumbnail, so this uses an opaque glass chip instead; keep decorative overlays inside a card's `overflow-hidden` bounds (positive offsets), since negative offsets get clipped by the card's own rounded corners.
- **Project media fallback** — cards whose `youtubeUrl` is missing or still a `YOUR_VIDEO_ID` placeholder (`hasDemo()`) render a sky→meadow→sun gradient plate with the project name in Amarante, at the same 16:9 ratio. A dead black iframe was the single worst thing on the page in a light palette.

## Imagery

- **`src/images/img.jpg`** — the source of the whole palette, and the only photographic imagery on the page. Used full-bleed in **Hero** (`object-center`, `preload`, `placeholder="blur"`) and **Contact** (`object-bottom`, `scale-x-[-1]`).
  - Hero overlay: `linear-gradient(180deg, rgba(250,246,234,0.28), rgba(250,246,234,0.10) 38%, rgba(250,246,234,0.72) 82%, rgba(250,246,234,1))` — light at the top so the sky stays saturated, opaque cream at the bottom so the section dissolves into the page.
  - Contact overlay: the same gradient inverted — opaque cream at the top, clearing as it goes down, so the meadow emerges out of the page rather than starting abruptly.
- The old `pixel_img.jpg` (dark scrim) and `page2_bg.jpg` (full-page texture) are **no longer used**; the page canvas is now pure CSS gradients.
- Decorative multiply-blended PNGs per section (see above) act as small illustrative accents rather than functional imagery.

> **Note on `next/image` in Next 16:** `priority` is deprecated in favour of `preload`. Static imports carry their own width/height and support `placeholder="blur"` for free.

## Interaction Details

- **The browser scrollbar is hidden site-wide** (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }` on `html`/`body`), by request. Wheel, touch, keyboard and programmatic scrolling all still work — verified with synthesized wheel gestures and PageDown; only dragging a visible bar is unavailable. Note this removes a position affordance some users rely on, and there is no scroll-position indicator to replace it.

- Smooth scroll (`html { scroll-behavior: smooth }`) for all in-page nav anchors
- CTA buttons use `active:scale-95` for tactile press feedback
- Scroll-down affordance on Hero: bouncing chevron (`animate-bounce`)
- All external links: `target="_blank" rel="noopener noreferrer"`

## Content Model (per section, current data shape)

- **Projects:** `{ title, kicker, description, tags[], liveUrl, codeUrl, youtubeUrl }` — YouTube URLs auto-converted to privacy-friendlier embed URLs (`getEmbedUrl`). `kicker` is the one-line summary shown on the card in the drawer; `description` only appears once the file is open.
- **Experience:** `{ period, title, org, location, details[] }`
- **Skills:** `{ category, icon, items[] }` — `icon` is a Flaticon UIcons class used on every pill belonging to that category
- **Achievements:** `{ stat, label, description }`
- **Contact/Hero socials:** `{ label, href }`

## Open Items / Rough Edges

- `youtubeUrl` for Sentinel, Distill and Synthesis are still `YOUR_VIDEO_ID` placeholders. They currently fall back to the gradient title plate; swap in real IDs and the iframe returns automatically.
- `Achievements`/`Projects` still carry some empty `<div>`/`<p>` scaffolding (empty stat field, empty category label) left over from earlier iterations.
- `layout.tsx` has a stale `eslint-disable` for `@next/next/no-page-custom-font` that the linter now reports as unused.
- The hero was later reworked: panel removed, dim scrim added, social icons dropped (they remain in the footer), and the single CTA replaced by three `.glass-btn` jump links. The Skills link points at `#about`, which is that section's actual id.
- The display face was later changed from `Lobster_Two` to `Amarante`, and the hero's scramble animation removed, at the owner's request.
- The source image was replaced with a 2560x1440 version (the first was 736x414 — a Pinterest-width file being upscaled ~2-4x by the full-bleed layout) and the palette re-measured against it.
