---
paths:
  - 'apps/client/web/**/*.{ts,tsx}'
  - 'apps/landing/**/*.{ts,tsx}'
  - 'packages/ui-kit/**/*.{ts,tsx}'
---

<!-- Compressed editing rules, loaded automatically when a client file is edited. -->
<!-- The full reasoning is docs/guides/client/styles.md; keep them in sync. -->

# Client — classes and animation

Classes join with `clsx` directly — no `cn()` wrapper; variants are maps in TSX or `cva`. Enter/exit, layout transitions and stagger use `motion` (`motion.div`, `AnimatePresence`, `useReducedMotion`), never `@keyframes`.
