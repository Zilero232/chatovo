# Functions

**Every declaration (top-level and module-level) uses a block body with `return`.** One-line expression bodies are banned: `=> { return ... }` looks the same regardless of body size, and you never have to rewrite it when the logic grows.

```ts
// ✓ OK
const readRole = (user: User | null): UserRole => {
  return user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
};

const resolveDisplayName = (user: User | null): string => {
  return (
    firstNonEmptyString([meta.display_name, meta.full_name, meta.name]) ??
    user?.email?.split('@')[0] ??
    'you'
  );
};

// ✗ NOT OK
const readRole = (user: User | null): UserRole =>
  user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
```

**Exceptions — keep the expression body:**

- **React components that return JSX directly** — the JSX is itself the "body", and a `{ return }` wrapper visually duplicates it:

  ```tsx
  // ✓ OK
  export const Avatar = ({ src }: Props) => <img src={src} />;

  export const Foo = (props: P) => (
    <div>
      <span>{props.text}</span>
    </div>
  );
  ```

- **Inline callbacks** (function arguments, JSX props, hook methods):

  ```ts
  // ✓ OK — this is an argument, not a declaration
  arr.map((x) => x.id);
  arr.filter((x) => x.active);
  pipe(xs, filter((x) => x > 0));
  useEffect(() => setOpen(true), []);
  <Button onClick={() => router.push('/foo')} />
  match(state).with('idle', () => null)
  ```

- **Primitives in `packages/ui-kit/`** — they follow their own convention (PascalCase folders, SCSS modules, Base UI). See [`ui-kit` structure](../client/slice-ui.md#21-ui-kit-structure).

**Review rule:** if the arrow sits to the right of an `=` (a function declaration) — block body. If the arrow sits inside `(...)` or `{...}` (an argument) — your call, usually an expression.

## 9.5 `if` / `else` — always with braces

**The body of `if`, `else if` and `else` is always in `{}`, even for a single line.** A one-line `if (cond) doThing();` is banned: adding a second statement to a branch shouldn't require restructuring, diffs stay cleaner, and there is no "forgot the braces" trap. Held by hand and caught at review.

```ts
// ✓ OK
if (!isTauri()) {
  return;
}

if (isManual) {
  toast.success(t('upToDate'));
}

// ✗ NOT OK
if (!isTauri()) return;
if (isManual) toast.success(t('upToDate'));
```

A ternary that returns a value is still fine (it's an expression, not a statement): `return a ? b : c;`.

## 9.6 Independent `await` calls go in parallel

**Independent async calls go through `Promise.all`, not sequential `await`s.** Sequential `await`s add up the latency: two 200 ms requests become 400 ms instead of 200. Independence is easy to check: the second call does not use the first one's result.

```ts
// ✗ NOT OK — sequential, though the calls are independent
const user = await getUser(id);
const rooms = await getRooms(id);

// ✓ OK
const [user, rooms] = await Promise.all([getUser(id), getRooms(id)]);
```

**`Promise.allSettled` — when partial failure is acceptable.** `Promise.all` rejects as a whole on the first error; if a failing branch must not take the others down (notifications, optional analytics, cache warm-up), use `allSettled` and inspect `status` per result.

```ts
// ✓ OK — a failing push does not cancel the email
const results = await Promise.allSettled([sendEmail(userId), sendPush(userId)]);
```

**Keep them sequential** when the order matters:

- The second call consumes the first one's result (`const room = await getRoom(id); const members = await getMembers(room.id);`).
- The order is part of the logic: a permission check before a mutation, a write before a read, transaction steps.

## Object parameters

**2+ arguments → a single object with destructuring.** Positional arguments (especially same-typed ones — `string, string`) are easy to swap; an object is self-documenting and order-independent. Single-argument functions (`listFriends(userId)`) stay positional. The same rule applies on the server, where the shape is `<Fn>Input` in `<module>.service.types.ts` ([NestJS modules](../server/nestjs.md)).

```ts
// ✗ BAD — 4 positional args, easy to mix up
resolveDisplayName(displayName, name, email, userId);

// ✓ OK — object parameter, destructured in the signature
resolveDisplayName({ displayName, name, email, userId });
```
