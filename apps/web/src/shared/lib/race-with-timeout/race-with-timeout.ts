import type { RaceResult, RaceWithTimeoutInput } from './race-with-timeout.types';

const wrapWork = async <T>(promise: Promise<T>): Promise<RaceResult<T>> => {
  const value = await promise;

  return { ok: true, value };
};

const wrapTimeout = <T>(timeoutMs: number) =>
  new Promise<RaceResult<T>>((resolve) => {
    setTimeout(resolve, timeoutMs, { ok: false, reason: 'timeout' });
  });

/** Resolves with the promise's value, or `{ ok: false, reason: 'timeout' }` once `timeoutMs` passes. */
export const raceWithTimeout = async <T>({
  promise,
  timeoutMs
}: RaceWithTimeoutInput<T>): Promise<RaceResult<T>> =>
  Promise.race([wrapWork(promise), wrapTimeout<T>(timeoutMs)]);
