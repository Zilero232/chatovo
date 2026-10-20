# Component size

**100 lines per JSX file, maximum.**

Over the limit means refactor:

1. Subcomponents → `components/`.
2. Logic → `model/` (a hook).
3. Utilities → the slice's `lib/`.

**A barrel of related primitives is no exception.** `ui-kit` components like `Dialog` / `Sheet` / `DropdownMenu` export 8–15 small parts (`Dialog`, `DialogContent`, `DialogHeader`, …). Keeping them in one file is not allowed: each part goes in `components/<Name>/`, and `<Name>.tsx` stays a thin re-export.

```
packages/ui-kit/primitives/Dialog/
  Dialog.tsx                  ← only `export { ... } from './components'`
  Dialog.types.ts
  Dialog.module.scss
  dialog-overlay-context.ts   ← shared context (otherwise an import cycle)
  components/
    index.ts
    DialogRoot/DialogRoot.tsx
    DialogContent/DialogContent.tsx
    DialogHeader/DialogHeader.tsx   ← Header + Footer + Title + Description
    DialogClose/DialogClose.tsx     ← Close + Portal + Overlay
```

Group by meaning, not "one file per export": related parts (`Header` / `Footer` / `Title` / `Description`) live together.

**Context shared by the parts goes into its own module** next to `<Name>.tsx` (`dialog-overlay-context.ts`), never inside the component: otherwise `components/*` import the parent and the parent imports them. Context shared by several primitives goes in a `lib/` folder at the package root (`packages/ui-kit/lib/`).
