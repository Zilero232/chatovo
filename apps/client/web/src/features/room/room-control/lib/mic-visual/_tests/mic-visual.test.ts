import { describe, expect, it } from 'vitest';

import { resolveMicVisual } from '../mic-visual';

describe('resolveMicVisual', () => {
  it('reports a muted mic as danger whatever the push-to-talk state is', () => {
    expect(resolveMicVisual({ pttState: 'active', isMicrophoneEnabled: false })).toEqual({
      tone: 'danger',
      labelKey: 'unmute',
      isMuted: true
    });
  });

  it('lights up while push-to-talk is held', () => {
    expect(resolveMicVisual({ pttState: 'active', isMicrophoneEnabled: true })).toEqual({
      tone: 'active',
      labelKey: 'pttHint',
      isMuted: false
    });
  });

  it('dims an idle push-to-talk mic without calling it muted', () => {
    expect(resolveMicVisual({ pttState: 'idle', isMicrophoneEnabled: true })).toEqual({
      tone: 'off',
      labelKey: 'pttHint',
      isMuted: false
    });
  });

  it('reports a mic the room owner muted as muted by the owner, even while push-to-talk is held', () => {
    expect(
      resolveMicVisual({ pttState: 'active', isMicrophoneEnabled: true, isLocked: true })
    ).toEqual({
      tone: 'danger',
      labelKey: 'mutedByOwner',
      isMuted: true
    });
  });

  it('shows a plain live mic when push-to-talk is disabled', () => {
    expect(resolveMicVisual({ pttState: 'disabled', isMicrophoneEnabled: true })).toEqual({
      tone: 'on',
      labelKey: 'mute',
      isMuted: false
    });
  });
});
