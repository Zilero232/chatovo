# React conventions

- Function components, arrow functions.
- `'use client'` in every file with hooks / state / event handlers — in `apps/site` and `packages/ui-kit`, which render under React Server Components. The web app is a client-only SPA and carries no directive.
- React Compiler is enabled — no `useMemo` / `useCallback` for micro-optimisation. Keep them only for a semantically stable ref (`useEffect` dependencies, a key in a Map).
- Event handlers are `on<Event>` in camelCase: `onSubmit`, `onSelectRoom`.
- React types are **named imports**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` is banned.**

## 10.1 Hook order

ESLint does not sort hooks — held by hand and caught at review.

Group order:

1. **Navigation** — `useRouter`, `usePathname`, `useSearchParams`, `useParams`.
2. **Store / context** — `useCurrentUser`, `useAuthStore`, any `use<Name>Store`.
3. **Data** — TanStack Query/Mutation hooks.
4. **State** — `useState`, `useReducer`.
5. **Ref** — `useRef`.
6. **Memo / callbacks** — `useMemo`, `useCallback`, `useTransition`, `useId`.
7. **Effects** — `useEffect`, `useLayoutEffect`.
8. **Derived const** — `const x = params.get(...)`, values unpacked from hooks.

A blank line between groups. No blank line within a group.

```tsx
export const ChannelsPanel = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { user, isAdmin } = useCurrentUser();

  const rooms = useRooms();
  const deleteMutation = useDeleteRoom();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    // ...
  }, [rooms.data]);

  const activeRoom = params.get('name');

  return /* ... */;
};
```

**Reordering rules:**

- Never move a hook across a data dependency: if `name` is needed by `useRoomToken({ roomName: name })`, `name` must come before the hook. When the group order conflicts with that, leave it as is and mark it `// data dep: name → query`.
- `if (...) useFoo()` is a `rules-of-hooks` bug — fix it, don't sort it.

**Custom hooks** are placed by what they do inside: `useRooms` (runs a `useQuery`) → the Data group; `useCurrentUser` (a context wrapper) → the Store group; `useDocumentTitle` (an effect) → the Effects group.

## 10.1b Logic lives in hooks, components stay pure

A component's job is markup. Everything that is not markup — data fetching, mutations, subscriptions, derived state, scroll or focus bookkeeping, event wiring — belongs in a hook under `model/hooks/`. The component calls one hook, destructures what it renders, and returns JSX.

The practical test: if the body has anything between the hook calls and the `return` other than trivial derived consts, that work belongs in a hook.

```tsx
// ✗ orchestration inline: five hooks, a ref, two effects, an observer — all in the JSX file
export const ChatConversation = ({ roomId, currentUserId }: ChatConversationProps) => {
  const { messages, hasOlder, loadOlderMessages } = useChatHistory(roomId);
  const { send, retry } = useChatSend({ roomId, sender });
  const listRef = useAutoScroll<HTMLDivElement>();
  const anchorRef = useRef<{ height: number; top: number } | null>(null);
  const { ref: sentinelRef, entries } = useIntersectionObserver({ root: listRef });

  useEffect(() => {
    if (entries?.at(-1)?.isIntersecting && hasOlder) {
      loadOlderMessages();
    }
  }, [entries, hasOlder]);

  return <div>{/* ... */}</div>;
};

// ✓ one orchestration hook; the component only renders
export const ChatConversation = ({ roomId, currentUserId }: ChatConversationProps) => {
  const { lines, listRef, sentinelRef, actions, isPending } = useChatConversation({
    roomId,
    currentUserId
  });

  return <div>{/* ... */}</div>;
};
```

The hook returns a flat shape named for what the markup needs (`lines`, `listRef`, `actions`), not the internals it assembled it from. Grouping related callbacks under one key (`actions`) keeps the destructuring short.

This composes with the [component body order](component-body.md) rather than replacing it: the ordering rules apply inside the hook too. It also keeps the 100-line [component budget](component-size.md) honest — a component that outgrows it is almost always carrying logic that should have been a hook.

## 10.2 Hook / effect dependencies

A `useEffect` `deps` array holds only what **should actually re-trigger** the effect. If we know the effect needs a single `roomId`, we don't add `room`, `router` or mutation objects "to keep the linter quiet".

**Stable refs don't go into deps.** `navigate` from TanStack Router (`router` from `next/navigation` on the site) and `reset` / `mutate` from react-query are stable across renders. Adding them is pointless — the effect must not react to them "changing". `// eslint-disable-next-line react/exhaustive-deps -- reason` with an explicit reason is normal practice, not a hack.

```tsx
// ✗ BAD — surplus deps, and the mutation object changes its ref every render
useEffect(() => {
  if (!roomId) {
    router.replace(ROUTES.lobby);
  }
}, [roomId, room, router, tokenMutation]);

// ✓ OK — only roomId triggers it, and the reason is recorded
// eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
useEffect(() => {
  if (!roomId) {
    router.replace(ROUTES.lobby);
  }
}, [roomId]);
```

**Anti-pattern: `useEffect` + `mutate` to load data.** The mutation object in deps means a new ref every render, which means refetch loops. Do declarative loading with `useQuery` and a key (`queryKey: [roomId]`) — react-query refetches on a key change by itself, and neither `useEffect` nor `reset()` is needed.

**A fresh callback inside an effect → `useEffectEvent`** (React 19.2+). The effect omits the event from its deps and still calls the latest version. Do not hand-roll `const cbRef = useRef(cb); cbRef.current = cb;` for that. The ref pattern stays only where an Effect Event is forbidden — a callback a library captures once, such as reactuse `useDropZone`'s `onDrop` ([dependencies](../shared/dependencies.md#known-library-gotchas)).

## 10.3 Destructuring query / mutation results

The result of `useQuery` or a custom query hook is **destructured immediately** — don't carry the object around and don't reach through the dot:

```tsx
// ✗ BAD — dot access, the wrapper object is unnecessary
const roomById = useRoomById(roomId);
const room = roomById.data;
// ... roomById.isLoading, roomById.isError

// ✓ OK — destructured on the spot, renamed to say what it is
const { data: room, isLoading } = useRoomById(roomId);
const { data: publicTokenData, isError: publicTokenFailed } = usePublicRoomToken(roomId, enabled);
```

`data` is almost always renamed (`data: room`) — a bare `data` carries no meaning.

**Exception — `useMutation`.** Keep the mutation object whole: you need both the fields (`isPending`, `isError`, `error`, `data`) and the methods (`mutateAsync`, `reset`). Destructuring 5+ names reads worse, and the methods get called as `tokenMutation.reset()` anyway.

```tsx
// ✓ OK — the mutation stays an object
const tokenMutation = useRoomTokenMutation();
// ... tokenMutation.isPending, tokenMutation.mutateAsync(...), tokenMutation.reset()
```
