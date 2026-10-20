import { match } from 'ts-pattern';

export const deviceErrorKey = (error: Error) =>
  match(error.name)
    .with('NotAllowedError', 'SecurityError', () => 'errorDenied' as const)
    .with('NotFoundError', 'OverconstrainedError', () => 'errorNotFound' as const)
    .with('NotReadableError', 'AbortError', () => 'errorBusy' as const)
    .otherwise(() => 'errorUnknown' as const);
