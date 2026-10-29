import { describe, expect, it } from 'vitest';

import { resolveCallOutcome } from '../resolve-call-outcome';

describe('resolveCallOutcome', () => {
  it('tells the caller the callee declined, and the callee that the call ended', () => {
    expect(resolveCallOutcome({ endReason: 'declined', direction: 'outgoing' })).toBe('declined');
    expect(resolveCallOutcome({ endReason: 'declined', direction: 'incoming' })).toBe('ended');
  });

  it('tells the caller nobody answered', () => {
    expect(resolveCallOutcome({ endReason: 'missed', direction: 'outgoing' })).toBe('noAnswer');
  });

  it('reports a busy peer, a cancelled and a failed call as such', () => {
    expect(resolveCallOutcome({ endReason: 'busy', direction: 'outgoing' })).toBe('busy');
    expect(resolveCallOutcome({ endReason: 'cancelled', direction: 'incoming' })).toBe('cancelled');
    expect(resolveCallOutcome({ endReason: 'failed', direction: 'outgoing' })).toBe('failed');
  });

  it('shows a plain end for a finished call, a block or a missing reason', () => {
    expect(resolveCallOutcome({ endReason: 'completed', direction: 'outgoing' })).toBe('ended');
    expect(resolveCallOutcome({ endReason: 'blocked', direction: 'incoming' })).toBe('ended');
    expect(resolveCallOutcome({ endReason: null, direction: 'incoming' })).toBe('ended');
  });
});
