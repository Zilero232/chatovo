import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCallClock } from '../use-call-clock';

describe('useCallClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-29T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('jumps to the current time and ticks once it starts running after mount', () => {
    const { result, rerender } = renderHook(({ isRunning }) => useCallClock(isRunning), {
      initialProps: { isRunning: false }
    });

    const mountedAt = result.current.now;

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current.now).toBe(mountedAt);

    rerender({ isRunning: true });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.now).toBe(mountedAt + 30_000);

    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(result.current.now).toBeGreaterThanOrEqual(mountedAt + 32_000);
  });
});
