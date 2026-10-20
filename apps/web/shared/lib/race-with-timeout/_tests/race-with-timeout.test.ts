import { describe, expect, it, vi } from 'vitest';

import { raceWithTimeout } from '../race-with-timeout';

const delay = <T>(value: T, ms: number) =>
  new Promise<T>((resolve) => {
    setTimeout(resolve, ms, value);
  });

describe('raceWithTimeout', () => {
  it('resolves with the value when the work wins', async () => {
    vi.useFakeTimers();

    const race = raceWithTimeout({ promise: delay('done', 10), timeoutMs: 1_000 });

    await vi.advanceTimersByTimeAsync(10);

    await expect(race).resolves.toEqual({ ok: true, value: 'done' });

    vi.useRealTimers();
  });

  it('reports a timeout when the work is too slow', async () => {
    vi.useFakeTimers();

    const race = raceWithTimeout({ promise: delay('done', 5_000), timeoutMs: 100 });

    await vi.advanceTimersByTimeAsync(100);

    await expect(race).resolves.toEqual({ ok: false, reason: 'timeout' });

    vi.useRealTimers();
  });

  it('rejects when the work itself rejects', async () => {
    await expect(
      raceWithTimeout({ promise: Promise.reject(new Error('boom')), timeoutMs: 1_000 })
    ).rejects.toThrow('boom');
  });

  it('resolves immediately for already-settled work', async () => {
    await expect(
      raceWithTimeout({ promise: Promise.resolve(42), timeoutMs: 1_000 })
    ).resolves.toEqual({
      ok: true,
      value: 42
    });
  });
});
