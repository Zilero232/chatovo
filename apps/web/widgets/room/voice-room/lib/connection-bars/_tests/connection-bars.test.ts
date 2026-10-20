import { ConnectionQuality } from 'livekit-client';
import { describe, expect, it } from 'vitest';

import { barsFromQuality, barsFromRtt } from '../connection-bars';

describe('barsFromRtt', () => {
  it('shows every bar on a fast link', () => {
    expect(barsFromRtt(10)).toBe(5);
  });

  it('drops a bar once the round-trip time reaches a threshold', () => {
    expect(barsFromRtt(49)).toBe(5);
    expect(barsFromRtt(50)).toBe(4);
    expect(barsFromRtt(100)).toBe(3);
    expect(barsFromRtt(150)).toBe(2);
    expect(barsFromRtt(250)).toBe(1);
  });

  it('never falls below one bar, however bad the link is', () => {
    expect(barsFromRtt(5_000)).toBe(1);
  });
});

describe('barsFromQuality', () => {
  it('maps LiveKit ratings onto the same bar scale', () => {
    expect(barsFromQuality(ConnectionQuality.Excellent)).toBe(5);
    expect(barsFromQuality(ConnectionQuality.Good)).toBe(3);
    expect(barsFromQuality(ConnectionQuality.Poor)).toBe(1);
  });

  it('shows no bars once the connection is lost or unknown', () => {
    expect(barsFromQuality(ConnectionQuality.Lost)).toBe(0);
    expect(barsFromQuality(ConnectionQuality.Unknown)).toBe(0);
  });
});
