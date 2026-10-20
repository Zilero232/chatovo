# Visual design — "a warm evening with Chato"

The whole product — the public site, auth, the lobby, the room, the music panel, settings, the 404 and error screens, the OG card — speaks one visual language, even though the public site (`apps/landing`, chatovo.ru) and the product (`apps/client/web`, app.chatovo.ru) are separate apps. Both read the same design system, `@chatovo/ui-kit`. This file is the reference; the tokens live in `packages/ui-kit/styles/_tokens.scss`.

## Why it changed

The old look was the default of every AI-generated landing page: near-black, violet-to-cyan neon, frosted glass, aurora blobs, gradient text, uppercase letter-spaced labels, a faint grid and a pointer glow. Nothing in it was ours. The brand already had something nobody else has — the winking cat on the logo. The redesign is built around him and around what Chatovo is: friends talking in the evening.

- **Dark, but warm.** Voice rooms are an evening thing, people sit in them for hours and next to video, so the theme stays dark — ink-plum instead of blue-black, cream instead of white, and a coral accent instead of neon.
- **Solid, not glass.** Surfaces are opaque and stacked by lightness; nothing blurs what is behind it. Depth comes from a soft warm shadow and a 1px cream hairline.
- **A character, not decoration.** Chato the cat appears where a person would smile: the hero, empty states, the 404, errors, the music panel, the auth scene. Never as wallpaper.

## Palette

All text pairs are AA on their background; the ratios were computed, not eyeballed.

| Token | Value | Use | Ratio |
| --- | --- | --- | --- |
| `--background` | `#16111b` | the page | — |
| `--surface-1` | `#221a2b` | cards, panels | — |
| `--surface-2` | `#2e2439` | raised: popovers, inputs, hover | — |
| `--surface-3` | `#3b2f48` | highest: active rows, tooltips | — |
| `--foreground` | `#f5ecdf` | text | 15.9 on bg |
| `--muted-foreground` | `#b8acbf` | secondary text | 8.6 on bg, 7.3 on surface-2 |
| `--subtle-foreground` | `#a092aa` | captions, meta | ≥ 4.5 on every surface |
| `--brand-coral` (`--primary`) | `#ff7a59` | the action colour: buttons, live, links | 7.2 on bg |
| `--primary-foreground` | `#2a1015` | text on coral | 6.9 |
| `--brand-sun` | `#ffcf5c` | warm highlight: badges, "new", the marker under a word | 12.7 on bg |
| `--brand-violet` | `#a48bff` | secondary accent, focus ring | 6.8 on bg |
| `--brand-mint` | `#7ee0b5` | speaking, success, online | 11.7 on bg |
| `--destructive` | `#ff6b78` | errors, leave | 6.8 on bg |

The legacy names (`--brand-cyan`, `--brand-fuchsia`, `--brand-lime`) are remapped onto this palette so untouched components follow; new code uses the names above.

## Type

- **Headings on the public site — Lora** (serif with full Cyrillic, variable weight), `--font-display`, set explicitly per heading: the marketing pages, auth, legal, 404 and error screens. Accent words may be set in Lora italic with the sun marker under them; never in a gradient. There is no global `h1, h2` rule: inside the app — room names, dialog titles (Base UI renders them as `h2`), empty states, admin — headings stay in Manrope, because a serif next to dense UI text reads as a broken font.
- **Text — Manrope**, `--font-sans`. Labels are sentence case; no uppercase letter-spaced captions.
- **Mono — JetBrains Mono** only for what is literally technical: an invite code, an error digest.

## Shape and depth

- Radii are small and quiet: `--radius-sm` 4px, `--radius-md` 6px (controls), `--radius-lg` 8px, `--radius-xl` 10px (cards), `--radius-2xl` 12px (dialogs, the room frame). No pills — round only what is round by nature (avatars, status dots, toggles).
- Elevation is a warm shadow (`--shadow-soft`, `--shadow-elevated`) plus a `--border` hairline (`rgb(245 236 223 / 14%)`); `--border-strong` (26%) marks hover and floating surfaces, and `--input-border` (38%) keeps field and control edges visible against every surface. No glow shadows, no backdrop blur, no inner highlights.
- The page background is flat `--background` with one large, very soft warm vignette at the top. No grids, noise, aurora or orbs.

## Motion

`motion` for everything that moves, presets in `apps/client/web/src/shared/config/motion.ts` and the kit's `*.motion.ts` files. Things settle, they do not bounce around: a short ease-out for UI, a spring only for the cat and for drag. Only `transform` and `opacity` animate. Reduced motion means static, not slower; the WebGL hero does not mount at all.

## Chato

`@chatovo/ui-kit`'s `components/Chato` draws the cat from the logo's geometry in poses: `wave` (hero, auth), `listen` (headphones — music, voice), `sleep` (empty states: no rooms, no friends, nothing playing), `peek` (404, errors), `wink` (success). The logo mark stays the head on a coral plaque.

## Logo

The app icon and the logo mark share one palette, matched to the tokens: the plaque is a coral gradient `#ff8f6b` → `#ff7a59` → `#f2643f`, the cat is cream `#fff6ea` with coral inner ears `#ff9f86`, and the ink (eyes, nose, outline) is plum `#2c1a33`. The old violet plaque (`#6a4dff`) is gone everywhere — favicons, Tauri and Android icons, the Play icon and feature graphic were regenerated from the same source.

On the home page Chato is also a real-time 3D scene (`three` + `@react-three/fiber`): he sits on a cushion with headphones, blinks, follows the pointer and bobs to a soft sound wave. It is progressive enhancement over the SVG pose, loaded lazily by device tier exactly like the rules in [the WebGL section](#webgl-hero).

## WebGL hero

- **The poster is the content.** The SVG Chato paints first; the canvas mounts over it in a box of the same aspect ratio and fades in after its first frame.
- **Code-split** through `next/dynamic` with `ssr: false`; three and r3f live in their own lazy chunk.
- **When to load** is `useWebglStage` (`apps/landing/shared/hooks`, built on `shared/lib/webgl`): `webglTier` turns the environment into `off` / `lite` / `full` (off for reduced motion, Save-Data, slow connections, no WebGL, ≤ 2 GB or ≤ 2 cores; lite for ≤ 4 GB, ≤ 4 cores or a phone). `full` loads on idle, `lite` on the first interaction.
- **When to run.** The frame loop stops while the canvas is off-screen or the tab is hidden.
- **Cheap.** Procedural geometry and `MeshToonMaterial` only — no models, textures or HDRs.

## Components

- **Buttons.** Primary: coral, dark text. Secondary: `--surface-2` with a hairline. Ghost: text only, `--surface-2` on hover. Destructive: `--destructive` text on a tinted fill.
- **Inputs** sit on `--surface-2` with a hairline; focus is a 2px violet ring, never a glow.
- **Overlays** (dialog, sheet, popover, menu) are opaque `--surface-1`/`--surface-2` with `--shadow-elevated`; the scrim is a plain dim, no blur.

## The app keeps its layout

Inside the product — the lobby, the room, the chat, the room list, friends, dialogs — the redesign is a change of palette, type and surfaces only. No block is added, removed or moved: the same components render the same structure, and what changed is the tokens they read and the neon, glass and glow their stylesheets used to carry. A user who knows where things are finds them in the same place. New structure appears only with a new feature (room music: the minibar under the room header, the music button in the control bar, the player dialog — see [room-music.md](room-music.md)).

The speaking highlight on a participant card turns the card's own 1px border mint and adds an inner ring: an absolutely positioned `::after` with a 1px border and radius `calc(var(--radius-2xl) - 1px)`, so the two read as one 2px edge that follows the corner exactly. An inset `outline` was tried first and dropped: on a rounded `overflow: hidden` card the outline doesn't follow the radius, so the corners showed square ([pitfalls](pitfalls.md)). The voice ring around the avatar draws outside its SVG box (`overflow: visible`) and is sized so its loudest state stays clear of the name.

The illustrated, re-composed treatment — Chato, serif heroes, new sections — belongs to the public site, auth, and the 404 and error screens.

## The public site

The site is its own server-rendered app, `apps/landing` ([CLAUDE.md](../../apps/landing/CLAUDE.md)); everything below lives there.

- **Show the product.** The home hero puts Chato in the arch scene and lays a real-looking room card over it — people with the speaker ringed in mint, the room's music bar — so the first screen says what Chatovo is, not just who the mascot is. The "how it works" steps each end with the piece of UI that step uses (the create button, the invite link, the mic toggle).
- **The arch scene** (`MarketingScene`) is the one frame for Chato on every page hero: a plum arch with a sun-coloured moon and a floor line, the pose standing on the floor. Chato never floats on the page background.
- **Lists, not card grids.** Feature lists, support answers and the FAQ are rows divided by a hairline, with a small coral icon tile — not walls of identical bordered boxes. Boxes are kept for things that are objects: the bento mocks, the steps, release entries, the final call to action.
- **One action in the header.** Every public page has "Sign in" / "Open the app" next to the language switch (inside the menu on phones).
- **Rhythm.** Sections are 48 px apart on phones and 72 px on desktop; a section that has nothing to show (no contributors yet) does not render at all.

## Forbidden

Gradient text, neon or glow shadows, `backdrop-filter`, aurora/orb/blob backgrounds, grid or noise textures, pointer-following glows, uppercase letter-spaced labels, emoji as icons in UI chrome, and violet-to-cyan gradients.
