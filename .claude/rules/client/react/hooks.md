---
paths:
  - 'apps/web/**/*.{ts,tsx}'
  - 'apps/site/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/react.md; keep them in sync. -->

# Client — hooks, effects, queries

`'use client'` in every file with hooks, state or handlers. The React Compiler is on — `useMemo` / `useCallback` only for a semantically stable ref. React types are named imports, never `import type * as React`.

## Hook order

A blank line between groups: navigation → store/context → data (queries) → state → ref → memo/callbacks → effects → derived consts. A custom hook goes by what it does inside. Never move a hook across a data dependency.

## Effects

Deps hold only what should re-trigger the effect; stable refs (`router`, `mutate`, `reset`) stay out, with `// eslint-disable-next-line react/exhaustive-deps -- <reason>`. A fresh callback inside an effect → `useEffectEvent`, not `cbRef.current = cb`. Loading data is `useQuery` with a key — never `useEffect` + `mutate`.

## Query results

Destructure `useQuery` on the spot and rename `data` (`data: room`); keep a `useMutation` result whole.
