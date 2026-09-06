# Design System — Anika Jain Portfolio

A single-page Next.js portfolio built around one piece of artwork: `src/images/img.jpg`, a Ghibli-style meadow with a stone cottage under a big sky. The whole palette is sampled from that image — sunlit paper, sky blue, meadow green, deep forest, terracotta and poppy. The page opens on the meadow (Hero) and closes on the same meadow mirrored (Contact), with light, airy content bands in between.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (`@theme inline` tokens in `globals.css`), plain CSS utility classes for shared effects
- **Fonts:** `Inter` (body/sans, var `--font-inter`) + `Amarante` (display, var `--font-amarante`), both via `next/font/google`
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
| `--radius` | `0.75rem` | Base corner radius |

There is **no dark-section override** any more. Hero and Contact used to swap in a forest-night palette because they sat under a 75%-opacity dark scrim; they now sit under a *light* cream wash and use the same tokens as the rest of the page.

**Page canvas** — `body` paints three soft radial gradients over `--paper`: sky `rgba(68,150,166,.16)` top-left, meadow `rgba(157,165,65,.17)` mid-right, sun `rgba(232,207,67,.16)` at the foot. This reproduces the light in the artwork and keeps the page from reading as flat cream. `background-attachment: fixed` where supported.

**GitHub calendar** ramp, rebuilt on the meadow hue: `rgba(97,112,35,0.12)` -> `#dde3ad` -> `#b6c05a` -> `#84913a` -> `#4a5620`.

## Contrast

Every text/background pairing is checked against WCAG AA (4.5:1 for normal text).

**Hero (light-on-dark).** Text sits directly on the artwork, so contrast depends on which pixels happen to fall behind it. This was solved numerically, not by eye: sample the image region the text block occupies, composite the scrim layers over those pixels, then take the **99th-percentile brightest** backdrop as the worst case. A flat 46% dim failed there (glass buttons 3.84, eyebrow 3.79). Adding a 50% radial centre pool — effective ~73% behind the text, still 46% at the corners — clears everything:

| Hero element | vs median backdrop | vs 99th-pct bright |
|---|---|---|
| `h1` / body `#fffdf6` | 8.1 | **6.3** |
| tagline `#e6ecb4` | 6.1 | **5.2** |
| eyebrow `#f7e7bd` | 6.1 | **5.3** |
| `.glass-btn` label (incl. its own 13% film) | 5.7 | **4.7** |

If the hero image is ever swapped again, re-run that check — a brighter photo will need a deeper pool.
 The palette is derived from a bright illustration, so this is not automatic — two issues were found and fixed when the tokens were re-measured:

- The roof colour taken straight from the image (`#b55618`) clears 4.5 on paper but only reaches ~4.2 on the sky and leaf band tints. Small text in that colour — the 11px `.eyebrow` labels and the 16px org names in Experience — uses `--terracotta-ink` (`#9e4c15`, same hue, darker) instead, which reaches 5.2. `--terracotta` itself is still used for borders, hover fills and larger text.
- The **previous** palette's terracotta (`#c4693f`) failed outright at 3.3:1 for eyebrow text. That was a real accessibility bug, not a drift.

Current ratios: body text 10.7, muted text 6.2, eyebrow ink 5.2-5.6, button text on `--meadow-deep` 5.4, button text on terracotta hover 4.8. If you change a palette token, re-check these — 16px semibold is **not** WCAG "large text" (that needs 18.66px bold or 24px), so it still requires the full 4.5.

## Typography

- **Display/headings** (`.section-heading`, `.display`, hero name, taglines): `Amarante` — an art-nouveau flared serif, always in `--forest`. Section headings are `2.25rem` on mobile, `3.5rem` at `sm:` and up, line-height 1.1.
- **Amarante ships a single 400 weight.** Never apply `font-bold`/`font-semibold` to it — the browser synthesises a faux-bold that smears its flared stems. Emphasis comes from size and colour instead. The shared `.display` class sets the family and pins `font-weight: 400` so this is hard to get wrong.
- **Body/UI text:** `Inter` via `--font-sans`, applied globally on `body`.
- Hero name is a plain static `<h1>` — `text-4xl sm:text-6xl .display`, reading "Hi, I'm Anika". It sits inside the frosted `.art-panel`, so it is sized to the panel rather than the viewport. (An earlier `ScrambledText` component animated a scramble-decode reveal here; it was removed at the owner's request and the file deleted.)
- Eyebrow labels ("Selected work", "Toolkit", "Highlights", "Open source", "Contact") use the `.eyebrow` class: uppercase, `0.6875rem`, `0.18em` tracking, terracotta, preceded by a short sun-to-terracotta gradient dash (`::before`).

## Layout & Structure

Single scrolling page (`src/app/page.tsx`), sections in order:

1. **Navbar** — fixed pill nav, bottom-center (not top), floating over content
2. **Hero** (`#hero`) — full-bleed `img.jpg` under a **dim scrim**, text directly on the artwork (no panel), and three translucent `.glass-btn` jump links to Projects / Experience / Skills
3. **Projects** (`#projects`) — 2-col grid of glass cards with embedded YouTube demos
4. **Experience** (`#experience`) — vertical timeline with expand/collapse entries
5. **Skills** (`#about`) — flat, centered icon-pill list (all items from all categories flattened into one wrapped row group per category, each pill carrying its category's Flaticon icon; no visible category headers)
6. **Achievements** (`#achievements`) — icon + stat list
7. **Contributions** (`#contributions`) — GitHub activity calendar
8. **Contact** (`#contact`) — the same `img.jpg`, mirrored (`scale-x-[-1]`, `object-bottom`), in a matching `.art-panel`: mailto CTA + social pills + footer line. The page opens and closes on the same field.

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
- **`.glass-btn`** — the hero's three translucent jump links: 13% cloud fill, 40% cloud border, `blur(10px)`, an inner top highlight and a deep shadow. Hover lifts and roughly doubles the fill.
- **`#hero` token scope** — the hero is the one light-on-dark region, so `--foreground`, `--muted-fg` and the eyebrow colour are all re-declared under `#hero`. Nothing else on the page inverts.
- **`.art-panel`** — the frosted plate that floats over the footer artwork: `rgba(255,253,246,0.80)` + `blur(14px) saturate(1.1)`, a white hairline border, an inner top highlight, and a deep soft drop shadow. It keeps text legible without darkening the illustration, which is the whole point of using a bright, sunny image.
- **`.glass-card`** — translucent card (`rgba(255,253,246,0.74)`) with `blur(12px) saturate(1.08)` and a soft meadow border, on a two-layer shadow (tight contact shadow + wide ambient). Used for project cards, achievement rows, and the contributions panel.
- **`.glass-badge`** — pale meadow pill (`rgba(233,241,217,0.78)`) for skill/tag pills, footer socials, and the Code link. Interactive ones (`a`/`button`) tint toward meadow green on hover.
- **`.card-hover`** — lift-on-hover: `translateY(-6px)`, border shifts to terracotta, shadow deepens.
- **`.btn-primary`** — solid `--meadow-deep` pill with cloud-white text; on hover it becomes **terracotta** and lifts. This green→terracotta move is the site's one consistent interaction accent.
- **`.icon-btn`** — circular translucent button, meadow-green glyph, turns terracotta on hover.
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

- **Projects:** `{ title, description, tags[], liveUrl, codeUrl, youtubeUrl }` — YouTube URLs auto-converted to privacy-friendlier embed URLs (`getEmbedUrl`)
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
