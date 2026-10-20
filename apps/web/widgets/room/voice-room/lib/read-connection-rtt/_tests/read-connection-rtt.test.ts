import { describe, expect, it } from 'vitest';

import { readConnectionRtt } from '../read-connection-rtt';

const statsOf = (reports: unknown[]) => ({
  getStats: () => Promise.resolve(new Map(reports.map((r, i) => [String(i), r])) as RTCStatsReport)
});

describe('readConnectionRtt', () => {
  it('prefers the nominated succeeded pair over any other candidate', async () => {
    const source = statsOf([
      { type: 'candidate-pair', state: 'succeeded', currentRoundTripTime: 0.2 },
      { type: 'candidate-pair', state: 'succeeded', nominated: true, currentRoundTripTime: 0.05 }
    ]);

    await expect(readConnectionRtt(source)).resolves.toBe(50);
  });

  it('falls back to a non-nominated pair while ICE is renegotiating', async () => {
    const source = statsOf([
      { type: 'candidate-pair', state: 'in-progress', currentRoundTripTime: 0.18 }
    ]);

    await expect(readConnectionRtt(source)).resolves.toBe(180);
  });

  it('returns null when no candidate pair carries a round-trip time', async () => {
    const source = statsOf([
      { type: 'inbound-rtp', bytesReceived: 10 },
      { type: 'candidate-pair', state: 'succeeded' }
    ]);

    await expect(readConnectionRtt(source)).resolves.toBeNull();
  });

  it('returns null when the peer connection reports no stats at all', async () => {
    await expect(readConnectionRtt({ getStats: () => undefined })).resolves.toBeNull();
  });

  it('rounds seconds to whole milliseconds', async () => {
    const source = statsOf([
      { type: 'candidate-pair', state: 'succeeded', nominated: true, currentRoundTripTime: 0.0217 }
    ]);

    await expect(readConnectionRtt(source)).resolves.toBe(22);
  });
});
