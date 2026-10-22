# Forms

`react-hook-form` + `@hookform/resolvers/zod`, with the schema from `@chatovo/schemas`. A `useState` per field is banned.

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createRoomInputSchema, type CreateRoomInput, type CreateRoomRawInput } from '@chatovo/schemas/rooms';

const DEFAULT_VALUES: CreateRoomRawInput = { name: '', isPrivate: false };

const { formState: { errors }, handleSubmit, register, reset } = useForm<
  CreateRoomRawInput,
  unknown,
  CreateRoomInput
>({
  resolver: zodResolver(createRoomInputSchema),
  defaultValues: DEFAULT_VALUES
});
```

- The schema lives in `@chatovo/schemas/<resource>`, never inline in the form.
- A field component under a `FormProvider` reads errors through `const { errors } = useFormState({ control })`, never by destructuring `formState` from `useFormContext()`. The React Compiler memoizes the provider's subtree, and a child with no subscription of its own never re-renders when react-hook-form mutates `formState.errors` in place: the sign-up fields showed no error at all while the consent `Controller` beside them did. Errors passed down as a prop from the component that calls `useForm` are fine — that component is subscribed.
- Every form carries `noValidate`. The schema is the only validator: without it the browser checks `type='email'` / `type='url'` itself, blocks the submit before `handleSubmit` runs, and none of the form's own errors appear.
- Server-side errors go through `setError('field', { message: err.message })`.
- Boolean toggles outside a form use `useBoolean` from `@siberiacancode/reactuse` for an inline `onClick={() => toggle()}`. Its toggle is a new function every render, so when the setter goes into an effect, a callback or a ref, use plain `useState(false)` ([dependencies](../shared/dependencies.md#known-library-gotchas)).
