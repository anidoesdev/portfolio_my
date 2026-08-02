# Design System — Anika Jain Portfolio

A single-page Next.js portfolio with a warm, nature/forest-journal aesthetic — olive and khaki tones, glassmorphic cards, and hand-drawn nature motifs (trees, leaves, wood, treasure) breaking up otherwise minimal sections.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (`@theme inline` tokens in `globals.css`), plain CSS utility classes for shared effects
- **Fonts:** `Inter` (body/sans, var `--font-inter`) + `Lobster_Two` (display/script, var `--font-lobster-two`), both via `next/font/google`
- **Icons:** Flaticon UIcons (solid-straight) via CDN `<link>`, plus inline SVGs for socials/arrows
- **Data viz:** `react-github-calendar` (dynamically imported, client-only) for the contributions graph
- **Deployment target:** Vercel

## Color Palette

Defined as CSS custom properties in `:root` (`src/app/globals.css`), remapped into Tailwind via `@theme inline`.

| Token | Hex / Value | Usage |
|---|---|---|
| `--background` | `#bab389` | Page background (khaki/olive), layered under `page2_bg.jpg` |
| `--foreground` | `#252e1a` | Primary text (dark olive-black) |
| `--card` | `#c8c4a2` | Card surfaces |
| `--muted` | `#838559` | Muted surface / borders |
| `--muted-fg` | `#535c3d` | Secondary text |
| `--border` | `#838559` | Default border |
| `--primary` | `#505834` | Accent (hover states, headings) |
| `--radius` | `0.5rem` | Base corner radius |

**Dark section override** — `#hero` and `#contact` swap in a darker forest-night palette (they sit on a full-bleed photo with a dark overlay):

| Token | Value | Usage |
|---|---|---|
| `--foreground` | `#e3ebe6` | Near-white text on dark photo |
| `--muted-fg` | `#899f81` | Sage secondary text |
| `--primary` | `#899f81` | Accent |
| `--border` | `#1b2920` | Border on dark bg |
| overlay | `bg-[#1a281c]/75` | Scrim over `pixel_img.jpg` |
| button bg | `#1b2920` | CTA buttons (View my work / Say Hello) |

**GitHub calendar** uses its own 5-step green ramp: `rgba(131,133,89,0.18)` → `#c8d4a8` → `#8aaa60` → `#4a7030` → `#2e4820`.

## Typography

- **Display/headings** (`.section-heading`, hero name, taglines): `Lobster_Two` — a bold script font. Section headings are `2.25rem` on mobile, `4.5rem` at `sm:` and up, weight 700, line-height 1.1.
- **Body/UI text:** `Inter` via `--font-sans`, applied globally on `body`.
- Hero name (`ScrambledText`) is `text-5xl sm:text-7xl` Lobster Two, with a scramble-decode reveal animation on mount.
- Labels ("Highlights", "Open Source", "Contact") use uppercase, `text-xs`, `tracking-widest`, muted color — a small-caps eyebrow pattern above headings.

## Layout & Structure

Single scrolling page (`src/app/page.tsx`), sections in order:

1. **Navbar** — fixed pill nav, bottom-center (not top), floating over content
2. **Hero** (`#hero`) — full-bleed photo, scrambled-text name reveal, tagline, social icons, CTA
3. **Projects** (`#projects`) — 2-col grid of glass cards with embedded YouTube demos
4. **Experience** (`#experience`) — vertical timeline with expand/collapse entries
5. **Skills** (`#about`) — categorized tag/badge grid
6. **Achievements** (`#achievements`) — icon + stat list
7. **Contributions** (`#contributions`) — GitHub activity calendar
8. **Contact** (`#contact`) — full-bleed photo section mirroring Hero, mailto CTA + social links + footer

Each content section (`section-bg`) shares:
- `py-20 px-6` vertical rhythm, `mx-auto max-w-5xl` container
- A heading + small decorative nature image pinned to the top-right (`hidden sm:block`, `mixBlendMode: multiply` so it blends into the khaki background): leaves, books, treasure, wood log, well, staircase
- `section-divider` class (currently a no-op border hook, kept for future section separators)

## Signature Components / Effects

- **`.glass-card`** — translucent card (`rgba(200,196,162,0.35)`) with `backdrop-filter: blur(10px)` and a soft olive border. Used for project cards and the contributions panel.
- **`.glass-badge`** — same glass treatment, smaller, used for skill/tag pills and project links (Live/Code).
- **`.card-hover`** — lift-on-hover: `translateY(-6px)`, border darkens to `#505834`, shadow deepens (`0 16px 36px rgba(0,0,0,0.14)`). Applied to project cards.
- **`.icon-btn` / `.pill-btn`** — circular/pill buttons with olive border, khaki fill, invert (darken bg, lighten border) on hover; a separate `#hero .icon-btn` variant uses translucent white for the photo backdrop.
- **Scrambled text reveal** (`ScrambledText.tsx`) — hero name types in character-by-character (100ms/char) while unrevealed characters scramble through a random charset every 60ms, terminal-decrypt style.
- **Bottom floating navbar** — fixed, centered, `bottom-6`, dark glass pill (`rgba(26,40,28,0.88)` + blur), active section highlighted via scroll-position IntersectionObserver-style logic (manual scroll listener), short labels on mobile / full labels on `sm:`.
- **Experience timeline** — left-hand vertical spine using a Flaticon tree glyph (`fi-ss-tree`) per entry connected by a thin olive line; entries expand/collapse via `max-height` transition.
- **Nature motif imagery** — decorative PNGs (`leaves_pile`, `books_bunch`, `treasure`, `wood_log`, `well`) rendered with `mixBlendMode: multiply` so they visually merge into the background instead of sitting on a white box.

## Imagery

- `pixel_img.jpg` — full-bleed background photo, reused in both Hero and Contact (dark `#1a281c` overlay at 75% opacity for text contrast)
- `page2_bg.jpg` — subtle full-page background texture (`background-attachment: fixed` where supported)
- Decorative multiply-blended PNGs per section (see above) act as small illustrative accents rather than functional imagery

## Interaction Details

- Smooth scroll (`html { scroll-behavior: smooth }`) for all in-page nav anchors
- CTA buttons use `active:scale-95` for tactile press feedback
- Scroll-down affordance on Hero: bouncing chevron (`animate-bounce`)
- All external links: `target="_blank" rel="noopener noreferrer"`

## Content Model (per section, current data shape)

- **Projects:** `{ title, description, tags[], liveUrl, codeUrl, youtubeUrl }` — YouTube URLs auto-converted to privacy-friendlier embed URLs (`getEmbedUrl`)
- **Experience:** `{ period, title, org, location, details[] }`
- **Skills:** `{ category, items[] }`
- **Achievements:** `{ stat, label, description }`
- **Contact/Hero socials:** `{ label, href }`

## Open Items / Rough Edges

- Some `youtubeUrl` values are still placeholders (`YOUR_VIDEO_ID`) for Sentinel, Distill, Synthesis
- `Achievements`/`Projects` have unused empty `<div>`/`<p>` scaffolding (e.g. empty tag row, empty category label) left over from earlier iterations
- `.section-divider` is currently styled as a no-op (`border-top: none`) except for the `#contact` override
