---
paths:
  - 'apps/web/**/*.{ts,tsx}'
  - 'apps/site/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/component-body.md and component-size.md; keep them in sync. -->

# Client — component body and size

**100 lines per JSX file, maximum.** Over it: subcomponents → `components/`, logic → a hook in `model/hooks/`, utils → `lib/`. A multi-part primitive (`Dialog`, `DropdownMenu`) splits its parts into `components/` too; context shared by the parts gets its own module.

**Logic lives in hooks.** A component calls one orchestration hook, destructures a flat shape named for the markup (`lines`, `listRef`, `actions`) and returns JSX. Anything between the hooks and the `return` beyond trivial derived consts belongs in a hook.

Body order, a blank line between blocks: hooks → derived consts → early returns → handlers → `return`. Never interleave.
