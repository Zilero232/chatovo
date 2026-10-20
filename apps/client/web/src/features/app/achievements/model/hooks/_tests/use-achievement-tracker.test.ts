import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MUTE_MASTER_TOGGLES, QUIET_ONE_MINUTES } from '../../../config';

const unlock = vi.fn();

vi.mock('../use-achievements', () => ({
  useAchievements: () => ({ unlock })
}));

const { useAchievementTracker } = await import('../use-achievement-tracker');

const QUIET_MS = QUIET_ONE_MINUTES * 60_000;

const inRoom = (patch: { isMicEnabled?: boolean; participantCount?: number } = {}) => ({
  isInRoom: true,
  isMicEnabled: false,
  participantCount: 2,
  ...patch
});

describe('useAchievementTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    unlock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('quietOne', () => {
    it('unlocks after staying muted for the full streak', () => {
      renderHook(() => useAchievementTracker(inRoom({ isMicEnabled: false })));

      vi.advanceTimersByTime(QUIET_MS);

      expect(unlock).toHaveBeenCalledWith('quietOne');
    });

    it('never unlocks while the microphone is live', () => {
      renderHook(() => useAchievementTracker(inRoom({ isMicEnabled: true })));

      vi.advanceTimersByTime(QUIET_MS * 3);

      expect(unlock).not.toHaveBeenCalledWith('quietOne');
    });

    it('restarts the streak when the user unmutes midway', () => {
      const { rerender } = renderHook((props) => useAchievementTracker(props), {
        initialProps: inRoom({ isMicEnabled: false })
      });

      vi.advanceTimersByTime(QUIET_MS * 0.6);
      rerender(inRoom({ isMicEnabled: true }));
      vi.advanceTimersByTime(QUIET_MS);

      expect(unlock).not.toHaveBeenCalledWith('quietOne');
    });

    it('does not run outside a room', () => {
      renderHook(() =>
        useAchievementTracker({ isInRoom: false, isMicEnabled: false, participantCount: 0 })
      );

      vi.advanceTimersByTime(QUIET_MS * 2);

      expect(unlock).not.toHaveBeenCalledWith('quietOne');
    });
  });

  describe('muteMaster', () => {
    it('does not count the initial mic state as a toggle', () => {
      renderHook(() => useAchievementTracker(inRoom()));

      expect(unlock).not.toHaveBeenCalledWith('muteMaster');
    });

    it('unlocks only after passing the toggle threshold', () => {
      const { rerender } = renderHook((props) => useAchievementTracker(props), {
        initialProps: inRoom({ isMicEnabled: false })
      });

      for (let flip = 0; flip <= MUTE_MASTER_TOGGLES; flip += 1) {
        rerender(inRoom({ isMicEnabled: flip % 2 === 0 }));
      }

      expect(unlock).toHaveBeenCalledWith('muteMaster');
    });

    it('stays locked below the threshold', () => {
      const { rerender } = renderHook((props) => useAchievementTracker(props), {
        initialProps: inRoom({ isMicEnabled: false })
      });

      rerender(inRoom({ isMicEnabled: true }));

      expect(unlock).not.toHaveBeenCalledWith('muteMaster');
    });
  });
});
