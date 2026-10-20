import { ConnectionQuality } from 'livekit-client';
import { match } from 'ts-pattern';

import { MIN_CONNECTION_BARS, RTT_BAR_THRESHOLDS_MS } from '../../config';

export const barsFromRtt = (rtt: number): number =>
  RTT_BAR_THRESHOLDS_MS.find(({ maxRtt }) => rtt < maxRtt)?.bars ?? MIN_CONNECTION_BARS;

export const barsFromQuality = (quality: ConnectionQuality): number =>
  match(quality)
    .with(ConnectionQuality.Excellent, () => 5)
    .with(ConnectionQuality.Good, () => 3)
    .with(ConnectionQuality.Poor, () => 1)
    .otherwise(() => 0);
