---
paths:
  - 'apps/web/**/*.{ts,tsx}'
  - 'apps/site/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/ (slices, slice-ui, model-hooks, segments); keep them in sync. -->

# Client — slice layout

Segments: `ui/` `model/` `lib/` `api/` `config/` + `index.ts`; the minimum is `ui/` + `index.ts`.

## `ui/`

The main component sits flat: `VoiceRoom.tsx`, `VoiceRoom.types.ts`, `VoiceRoom.module.scss`. Subcomponents go in `ui/components/<Name>/`; the aggregating `ui/components/index.ts` points straight at the file (`export { X } from './X/X'`) — **no per-component `index.ts` outside `packages/ui-kit`**. Side effects with no markup are headless controllers in `ui/controllers/` that render `null`.

`packages/ui-kit`: `primitives/` (base) `components/` (composed) `icons/` `styles/` `messages/`, each component a PascalCase folder **with** its own `index.ts`; segments import each other relatively, never through `@/`.

## `model/`

Hooks, stores, contexts, state types. Barrels live in the subfolders (`model/hooks/index.ts`) — **never a slice-level `model/index.ts`**. A hook with its own types gets a folder; its input type is `Use<Name>Input`. Public slice types go in `model/types.ts`. No top-level `types/` or `hooks/` segment.

## `lib/` and `api/`

`lib/` — pure functions, no React (returns JSX → `ui/`, uses React → `model/`, constants → `config/`). `api/` — the I/O boundary of the slice. HTTP goes only through the shared axios instance in `shared/api/http`; no manual `fetch`, no own `axios.create`.

## Naming

Slices, segments, hook and util files: kebab-case. Component folders and files: PascalCase. Props: `<Name>Props` in `<Name>.types.ts`.
