import { match } from 'ts-pattern';

import type { DescribeCallLogInput } from './describe-call-log.types';

const formatDuration = (totalSec: number) => {
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = String(totalSec % 60).padStart(2, '0');

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}`
    : `${minutes}:${seconds}`;
};

/** The English body of a call record, read by clients that predate call rows. */
export const describeCallLog = ({ outcome, durationSec }: DescribeCallLogInput): string =>
  match(outcome)
    .with('completed', () =>
      durationSec === null ? 'Call ended' : `Call · ${formatDuration(durationSec)}`
    )
    .with('declined', () => 'Declined call')
    .with('cancelled', () => 'Cancelled call')
    .with('missed', () => 'Missed call')
    .with('busy', () => 'Call not connected: busy')
    .with('failed', () => 'Call failed')
    .with('blocked', () => 'Call ended')
    .exhaustive();
