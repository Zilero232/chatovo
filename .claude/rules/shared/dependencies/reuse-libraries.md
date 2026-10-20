---
paths:
  - '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}'
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/dependencies.md; keep them in sync. -->

# Dependencies — reuse before writing

Before writing a helper, check what is installed: `@siberiacancode/reactuse` (hooks), `remeda` (data), `ts-pattern` (branching), `date-fns`, `react-hook-form` + the zod resolver, `@tanstack/react-query` (keys in `shared/constants/query-keys.ts`), `clsx` (no `cn()`), `@base-ui/react` (in `ui-kit`), `lucide-react`, `sonner`, `@livekit/components-react`, `use-intl` / `next-intl`, `motion`, `appBus` (`shared/lib/app-bus`), `useEffectEvent`, `useFileDialog` + `FilePicker`, the kit's `Image` in the web app, `next/image` on the site (never a raw `<img>`; always `sizes`), `@tanstack/react-router` (`useNavigate`, `useSearch`) in the web app, `handleExternalLinkClick` (`shared/lib`). Server: `sharp` through `src/lib` helpers, `safeFetch` for any user-supplied URL, `open-graph-scraper`, `cache-manager` `wrap` / `coalesceAsync`, JSX + `renderToStaticMarkup` for HTML, `buildHashKey`. The full table is in the guide.

Only libraries **declared** in a `package.json` count — a transitive one is a phantom dependency.

## Known gotchas

- `useBoolean`'s toggle is new every render → plain `useState` when the setter goes into an effect, a callback or a ref.
- `useDropZone` captures `onDrop` once → the `cbRef.current = cb` pattern is correct there (`useEffectEvent` is forbidden in a library callback).
- `useAudio` can't loop → a manual `new Audio()` for the ringtone.
- `node:https` + custom `lookup` drops SNI under Bun → SSRF pinning uses Bun `fetch` with `tls.serverName` (`safeFetch`).
- `html-encoding-sniffer` defaults to windows-1252 → pass `defaultEncoding: 'UTF-8'`.
- Library docs are fetched through context7 (`docs/guides/shared/references.md`), never guessed.
