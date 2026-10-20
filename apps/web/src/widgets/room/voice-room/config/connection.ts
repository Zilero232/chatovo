export const RTT_POLL_INTERVAL_MS = 2_000;

export const RTT_BAR_THRESHOLDS_MS = [
  { maxRtt: 50, bars: 5 },
  { maxRtt: 100, bars: 4 },
  { maxRtt: 150, bars: 3 },
  { maxRtt: 250, bars: 2 }
] as const;

export const MIN_CONNECTION_BARS = 1;
