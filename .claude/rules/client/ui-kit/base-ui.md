---
paths:
  - 'packages/ui-kit/**'
---

<!-- Compressed editing rules, loaded automatically when a ui-kit file is edited. -->
<!-- The full reasoning is docs/guides/client/base-ui.md; keep them in sync. -->

# Client — Base UI

Import from the subpath: `@base-ui/react/menu`, never the package root; `@base-ui-components/react` is a stale name.

- State attributes are `data-popup-open`, `data-highlighted`, `data-checked`, `data-disabled`, `data-placeholder`. Radix/RAC selectors (`data-state='open'`, `data-selected`) never match.
- Custom triggers go through `render={<Button />}` — no `asChild`, no `Pressable`.
- Overlay animation: either CSS on `data-starting-style` / `data-ending-style`, or motion with a `keepMounted` portal and `AnimatePresence` — never both.
- `DropdownMenuLabel` only inside a group, or the menu silently stops opening. A toggle in a menu is `DropdownMenuCheckboxItem`.
- `Select`'s `onValueChange` hands back `unknown`; `data-placeholder` on the trigger is set by hand.
