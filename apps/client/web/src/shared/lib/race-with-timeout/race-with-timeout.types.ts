export type RaceResult<T> = { ok: false; reason: 'timeout' } | { ok: true; value: T };

export type RaceWithTimeoutInput<T> = {
  promise: Promise<T>;
  timeoutMs: number;
};
