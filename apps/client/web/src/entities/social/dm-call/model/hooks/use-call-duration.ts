import type { DmCallView } from '@chatovo/schemas';

import { formatCallDuration, secondsBetween } from '../../lib';
import { useCallClock } from './use-call-clock';

export const useCallDuration = (call: DmCallView | null) => {
  const isActive = call?.state === 'active';

  const { now } = useCallClock(isActive);

  const seconds = isActive ? secondsBetween({ from: call.answeredAt, to: now }) : null;

  return seconds === null ? null : formatCallDuration(seconds);
};
