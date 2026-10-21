# Dependencies — reuse over reinvention

Before writing a helper, hook or util by hand, check whether an installed library already has it. Hand-rolled code is for when nothing fits: it duplicates logic someone else has already debugged and tested, and it makes the bundle harder to predict.

Only libraries **already declared** in a `package.json` count. A transitive dependency used directly is a phantom dependency: it works locally through hoisting and fails on a clean CI install.

## What to reach for

| Need | Library | Notes |
| --- | --- | --- |
| Generic React hooks (debounce, throttle, copy, mount, idle, intersection, media query, local storage, event listener, click outside, hover, toggle, previous, timeout, interval) | `@siberiacancode/reactuse` | `useBoolean`, `useCounter`, `useDebounceValue`, `useEventListener`, `useClickOutside`, `useLocalStorage`, `useMediaQuery`, `createContextHook` |
| Arrays, objects, data (groupBy, sortBy, pick, omit, partition, unique, mapValues, entries, isNullish) | `remeda` | |
| Typed branching, discriminated unions, conditional render | `ts-pattern` | `match`, `.with`, `.exhaustive`, `P.*` — no hand-rolled if/else ladders ([conditional render](../client/conditional-render.md)) |
| Form state and validation | `react-hook-form` + `@hookform/resolvers/zod` | Schemas from `@chatovo/schemas` ([forms](../client/forms.md)) |
| Server state, caching, mutations | `@tanstack/react-query` | Every query key lives in `shared/constants/query-keys.ts`. No `useEffect` + `fetch` |
| Dates and times | `date-fns` | No `Date` arithmetic by hand |
| Class composition | `clsx` | Directly — no `cn()` wrapper |
| Validation schemas | Zod 4 via `@chatovo/schemas` | The schema is the source of truth; infer types with `z.infer` ([schemas](schemas.md)) |
| UI primitives (dialog, dropdown, tooltip, popover, tabs, switch) | `@base-ui/react` inside `packages/ui-kit/` | Import from the subpath (`@base-ui/react/menu`). No hand-made focus trap or aria ([Base UI](../client/base-ui.md)) |
| Icons | `lucide-react` | Inline SVG only for brand marks |
| Toasts | `sonner` | `toast.success` / `toast.error` |
| LiveKit room state, participants, tracks, chat | `@livekit/components-react` | `useChat`, `useParticipants`, `useTracks`, `useConnectionState`. Raw `Room` listeners only when no hook covers it |
| Tauri (window, fs, deep-link, updater, global-shortcut, opener, os, process) | `@tauri-apps/api` + the plugin packages | Always behind `isTauri()` ([Tauri on the client](../client/tauri.md)) |
| i18n | `use-intl` (web, ui-kit), `next-intl` (site) | `useTranslations`, `useFormatter`, `useLocale` — no string maps ([i18n](../client/i18n.md)) |
| Markdown in chat messages | `react-markdown` + `remark-gfm` + `remark-breaks` | Custom renderers through the `components` prop |
| Colour picker (profile banner) | `react-colorful` | |
| Animated number transitions (lobby stats, counters) | `@number-flow/react` | |
| Keyboard event → readable combo (shortcut recording) | `keyboard-event-to-string` | |
| App-wide pub/sub (mute/deafen, PTT, recheck-update) | `appBus` in `shared/lib/app-bus` | Built on reactuse `createEventEmitter`; event types in `AppBusEvents`. Not `window` `CustomEvent` |
| A fresh callback inside `useEffect` without re-running it | `useEffectEvent` (React 19.2+) | Not the `cbRef.current = cb` pattern — see the gotchas below for the one exception |
| Enter/exit animations, layout transitions, stagger | `motion` | `motion.div`, `AnimatePresence`, `useReducedMotion` ([styles](../client/styles.md#animation)) |
| File selection | `useFileDialog` (reactuse) + `FilePicker` from `ui-kit` | A native `<input type="file">` can't be styled |
| Images | `Image` from `@chatovo/ui-kit` (web), `next/image` (site) | Never a raw `<img>`. In the web app the `ImageConfigProvider` loader sends optimizable sources to `GET /images`; give every image a `sizes` that matches its rendered size ([images](../../architecture/images.md)) |
| Routing (web) | `@tanstack/react-router` | `useNavigate`, `Link`, `useLocation({ select })`, `useSearch` — typed against the route tree ([web-app](../../architecture/web-app.md)) |
| Opening an external link from an `<a>` | `handleExternalLinkClick` in `shared/lib` | System browser on desktop, native behaviour on the web |
| Links inside a chat message | `unified` + `remark-parse` + `remark-gfm` + `unist-util-visit` | The same parse the chat renders, so code spans are skipped |
| Server: image resize / re-encode | `sharp` through `src/lib` (`openImage`, `resizeImage`, `optimizeAvatar`, `processChatImage`) | Never a bare `sharp()` on user input — `openImage` caps the pixel count |
| Server: fetching a URL a user supplied | `safeFetch` in `src/lib` | Never a raw `fetch` — SSRF ([images](../../architecture/images.md#outbound-fetches-and-ssrf)) |
| Server: page metadata | `open-graph-scraper` + `decodeHtml` (`html-encoding-sniffer` + `iconv-lite`) | |
| Server: memoised async work, request coalescing | `@nestjs/cache-manager` `wrap`, `coalesceAsync` from `@cacheable/utils` | No hand-rolled in-flight `Map` |
| Server: an HTML document (bot pages) | JSX + `renderToStaticMarkup` from `react-dom/server` | React escapes; no template strings with hand-escaped values. Emails use `@react-email/render` |
| Server: hashing to a cache key or file name | `buildHashKey` in `src/lib` | |

## When to write your own

- Project-specific glue no library reasonably covers.
- Domain logic — the business rules of `entities/` and `features/`.
- A thin wrapper that enforces a project convention over a library API (a typed `useEventListener` for one custom event name).
- A library with a real gotcha that hurts the call site — the known ones are below.

The order when adding a feature: name the category of the new code (state, side effect, data, UI primitive, validation), search `package.json` and `bun.lock` for a fitting helper, grep for a library already used elsewhere that has it, and only then write it — in `shared/lib/` or `shared/hooks/` if reusable, otherwise in the slice's `lib/`.

## Known library gotchas

- **`useBoolean`** (reactuse) returns a **new toggle function every render**. As a setter inside `useEffect` deps it re-runs the effect on each render and trips `exhaustive-deps`. Use plain `useState(false)` when the setter goes into effects, callbacks or refs; `useBoolean` is fine for an inline `onClick={() => toggle()}`.
- **`useDropZone`** (reactuse) captures its `onDrop` **once**, in an effect keyed only on the element, so a stale closure would call the first render's handler forever. `useEffectEvent` can't fix it — `rules-of-hooks` forbids calling one from a library callback — so the `cbRef.current = cb` pattern is the correct escape here. The same goes for any reactuse hook whose effect deps exclude its callback.
- **`useKeyboard(ref, …)`** (reactuse) listens on **`window`** while the ref is empty, and an element that never mounts keeps it there. The chat's edit dialog, closed for every message, swallowed every Enter in the room that way (the music field, other dialogs). A key handler for one element is that element's own `onKeyDown`.
- **`useEventListener`** (reactuse) types `event` as `keyof WindowEventMap`. A custom event name needs a cast or module augmentation; for a one-off custom event, plain `addEventListener` + cleanup is shorter.
- **`Intl.NumberFormat`** with `style: 'unit', unit: 'byte', notation: 'compact'` formats inconsistently (`1.5kB` vs `1.5K B`) across `unitDisplay` values. A hand-rolled byte formatter is fine.
- **`useAudio`** (reactuse) has no `loop` option and returns only controls, never the `HTMLAudioElement`. A looping sound (the call ringtone) needs a manual `new Audio()` — see `entities/social/friend/model/hooks/use-friend-call-ringtone.ts`. One-shot sounds still use `useAudio`.
- **`node:https` with a custom `lookup` under Bun** connects to the resolved IP without SNI, so certificate checks fail. That is why SSRF pinning (`safeFetch`) uses Bun's `fetch` with `tls.serverName` instead of an `http.Agent`-based library.
- **`html-encoding-sniffer`** falls back to windows-1252 when a page declares nothing, per the HTML spec. `decodeHtml` passes `defaultEncoding: 'UTF-8'`, which is what the modern web means.
- **Back/forward availability** (`shared/hooks/use-nav-history`) uses the native **Navigation API** (`window.navigation.canGoBack/canGoForward` + `currententrychange`) through `useSyncExternalStore`; reactuse has no equivalent. It is Chromium-only, which is fine because the title-bar navigation is Tauri/WebView2-only. Gate it with `'navigation' in window`; elsewhere the buttons fall back to disabled.

## Versions live in the catalog

`workspaces.catalog` in the root `package.json` is the single source of truth for every version more than one workspace uses: react, react-dom, zod, typescript, remeda, ts-pattern, date-fns, better-auth. A workspace writes `"zod": "catalog:"`, never a version. Bumping means editing the catalog; adding a shared dependency means the catalog **and** `catalog:` in every consumer.

A package that must move in lockstep with a catalogued one is catalogued too, even with one consumer — `react` without `react-dom` puts two Reacts in the tree.

## Library documentation is fetched, never guessed

[references.md](references.md) holds the resolved context7 ids for every major dependency and the situations where reading the docs before writing code is mandatory.
