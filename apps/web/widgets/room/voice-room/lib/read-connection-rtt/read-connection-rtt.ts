import type { RttStatsSource } from './read-connection-rtt.types';

const toMilliseconds = (seconds: number) => Math.round(seconds * 1_000);

const isRttCandidatePair = (report: { type?: string; currentRoundTripTime?: unknown }) =>
  report.type === 'candidate-pair' && typeof report.currentRoundTripTime === 'number';

/**
 * Returns the round-trip time in milliseconds, or `null` when this sample carries no usable
 * candidate pair. A nominated pair wins over a merely succeeded one; while ICE is renegotiating
 * neither exists and the caller should keep its previous reading rather than blank the value.
 */
export const readConnectionRtt = async (source: RttStatsSource): Promise<number | null> => {
  const stats = await source.getStats();

  if (!stats) {
    return null;
  }

  let fallback: number | null = null;

  for (const report of stats.values()) {
    if (!isRttCandidatePair(report)) {
      continue;
    }

    if (report.nominated && report.state === 'succeeded') {
      return toMilliseconds(report.currentRoundTripTime);
    }

    if (fallback === null) {
      fallback = toMilliseconds(report.currentRoundTripTime);
    }
  }

  return fallback;
};
