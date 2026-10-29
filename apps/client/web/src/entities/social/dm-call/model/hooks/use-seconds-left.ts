import { secondsBetween } from '../../lib';
import { useCallClock } from './use-call-clock';

export const useSecondsLeft = (deadline: string | null) => {
  const { now } = useCallClock(deadline !== null);

  return deadline === null ? null : secondsBetween({ from: now, to: deadline });
};
