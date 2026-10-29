import { describe, expect, it } from 'vitest';

import { describeCallLog } from '../describe-call-log';

describe('describeCallLog', () => {
  it('shows the length of an answered call as minutes and seconds', () => {
    expect(describeCallLog({ outcome: 'completed', durationSec: 754 })).toBe('Call · 12:34');
  });

  it('adds hours once a call passes the hour', () => {
    expect(describeCallLog({ outcome: 'completed', durationSec: 3725 })).toBe('Call · 1:02:05');
  });

  it('pads a call shorter than a minute', () => {
    expect(describeCallLog({ outcome: 'completed', durationSec: 7 })).toBe('Call · 0:07');
  });

  it('names a call nobody answered', () => {
    expect(describeCallLog({ outcome: 'missed', durationSec: null })).toBe('Missed call');
  });
});
