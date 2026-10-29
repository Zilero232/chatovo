import { useInterval } from '@siberiacancode/reactuse';
import { useEffect, useState } from 'react';

import { DM_CALL_TIMING } from '../../config';

export const useCallClock = (isRunning: boolean) => {
  const [now, setNow] = useState(() => Date.now());

  const { pause, resume } = useInterval(() => setNow(Date.now()), {
    interval: DM_CALL_TIMING.tickMs,
    immediately: isRunning
  });

  useEffect(() => {
    if (!isRunning) {
      pause();

      return;
    }

    const catchUp = setTimeout(() => setNow(Date.now()), 0);

    resume();

    return () => clearTimeout(catchUp);
    // eslint-disable-next-line react/exhaustive-deps -- pause and resume are stable controls of one interval
  }, [isRunning]);

  return { now, pause, resume };
};
