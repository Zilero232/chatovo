import type { ChatCallLog } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { resolveCallLogLabel } from '../resolve-call-log-label';

const CALLER = 'caller-1';
const CALLEE = 'callee-1';

const log = (overrides: Partial<ChatCallLog>): ChatCallLog => ({
  outcome: 'completed',
  durationSec: 754,
  callerId: CALLER,
  ...overrides
});

describe('resolveCallLogLabel', () => {
  it('shows a finished call as outgoing to the caller and incoming to the callee, with its duration', () => {
    expect(resolveCallLogLabel({ log: log({}), viewerId: CALLER })).toEqual({
      key: 'outgoing',
      isOutgoing: true,
      isMissed: false,
      durationSec: 754
    });
    expect(resolveCallLogLabel({ log: log({}), viewerId: CALLEE }).key).toBe('incoming');
  });

  it('marks an unanswered call as missed for the callee and as no answer for the caller', () => {
    const missed = log({ outcome: 'missed', durationSec: null });

    expect(resolveCallLogLabel({ log: missed, viewerId: CALLEE })).toMatchObject({
      key: 'missed',
      isMissed: true
    });
    expect(resolveCallLogLabel({ log: missed, viewerId: CALLER }).key).toBe('noAnswer');
  });

  it('reads a call cancelled by the caller as missed on the other side', () => {
    const cancelled = log({ outcome: 'cancelled', durationSec: null });

    expect(resolveCallLogLabel({ log: cancelled, viewerId: CALLER }).key).toBe('cancelled');
    expect(resolveCallLogLabel({ log: cancelled, viewerId: CALLEE }).key).toBe('missed');
  });

  it('words a declined call from each side', () => {
    const declined = log({ outcome: 'declined', durationSec: null });

    expect(resolveCallLogLabel({ log: declined, viewerId: CALLER }).key).toBe('declinedByPeer');
    expect(resolveCallLogLabel({ log: declined, viewerId: CALLEE }).key).toBe('declinedBySelf');
  });

  it('shows no duration for a call that never connected, whatever the server sent', () => {
    expect(
      resolveCallLogLabel({ log: log({ outcome: 'failed', durationSec: 3 }), viewerId: CALLER })
    ).toMatchObject({ key: 'failed', durationSec: null });
  });
});
