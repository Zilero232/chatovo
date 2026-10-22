---
paths:
  - 'apps/client/web/**/*.{ts,tsx}'
  - 'apps/landing/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/ (conditional-render, forms, drill-cleanup); keep them in sync. -->

# Client — render branches, forms, props

## Branches

3+ branches → `match` from `ts-pattern` with `.exhaustive()`, never nested `if (...) return <X />` or chained ternaries. Take narrowed values from the handler's argument, not the closure or `as`. One branch → `cond && <X />` with a **boolean** condition (`items.length > 0`, not `items.length`); never `cond ? <X /> : null`. A ternary is for two real branches.

## Forms

`react-hook-form` + `zodResolver` with the schema from `@chatovo/schemas`, a module-level `DEFAULT_VALUES`, server errors through `setError`. No `useState` per field. Under a `FormProvider`, a field component reads errors via `useFormState({ control })`, never `formState` from `useFormContext()` — the React Compiler leaves it stale. Every `<form>` / `as='form'` carries `noValidate`, or the browser's own `type='email'` check blocks the submit and no schema error shows.

## Drill cleanup

A leaf that can call a global hook does so instead of taking drilled props. Static text is not a prop (`<RoomLoadingFallback />`, not `<RoomLoader text="…" />`). Keep props for `.map` data, the orchestrator's UI state, and callbacks that need the parent.
