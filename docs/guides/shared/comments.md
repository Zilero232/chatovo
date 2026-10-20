# Comments and JSDoc

**Application code carries no comments.** In `pages/` (site: `views/`), `widgets/`, `features/`, `entities/` (client) and `modules/` (server) we write no `//`, no block comments and no JSDoc: the code documents itself through names. If a block needs a comment to explain it, the block should be extracted into a function with a telling name.

**Narrow exception — the public surface of reusable modules:** `packages/ui-kit`, `packages/config`, `shared/lib`, `shared/hooks` (web and site), `src/lib/` (server), `packages/schemas`. An **exported** primitive may carry a short JSDoc — one or two lines — **when the signature does not explain the purpose**: non-obvious units, a side effect, edge-case behaviour, a non-trivial return contract.

```ts
// ✓ OK — an export from shared/lib whose contract isn't readable from the signature
/** Returns `null` if the user cancelled the file picker dialog. */
export const pickAvatarFile = async (): Promise<File | null> => {
  ...
};

// ✗ NOT OK — the JSDoc just restates the signature
/** Formats bytes into a string. */
export const formatBytes = (bytes: number): string => {
  ...
};
```

**Internal helpers are never documented** — not in `shared/`, not anywhere else. The rule covers only what leaves through a barrel.

The exception does not lift the other bans: commented-out code, a `// TODO` with no ticket, and placeholder comments are banned everywhere. Technical directives are legitimate — `eslint-disable-next-line ... -- reason` ([effect deps](../client/react.md#102-hook--effect-dependencies)), `@ts-expect-error` with a reason, `'use client'` (site and kit).
