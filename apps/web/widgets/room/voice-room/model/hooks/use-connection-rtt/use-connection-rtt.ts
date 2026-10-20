'use client';

import { useRoomContext } from '@livekit/components-react';
import { useInterval } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent, useState } from 'react';

import type { ConnectionRtt } from './use-connection-rtt.types';

import { RTT_POLL_INTERVAL_MS } from '../../../config';
import { readConnectionRtt } from '../../../lib';

export const useConnectionRtt = (): ConnectionRtt => {
  const [rtt, setRtt] = useState<number | null>(null);

  const room = useRoomContext();

  const sample = async () => {
    const publisher = room.engine?.pcManager?.publisher;

    if (!publisher) {
      setRtt(null);

      return;
    }

    const next = await readConnectionRtt(publisher).catch(() => null);

    if (next !== null) {
      setRtt(next);
    }
  };

  const sampleOnRoomChange = useEffectEvent(() => {
    void sample();
  });

  useEffect(() => {
    sampleOnRoomChange();
  }, [room]);

  useInterval(() => {
    void sample();
  }, RTT_POLL_INTERVAL_MS);

  return { rtt };
};
