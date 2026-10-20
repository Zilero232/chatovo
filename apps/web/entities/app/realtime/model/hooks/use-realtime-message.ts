'use client';

import type { RealtimeServerMessage } from '@chatovo/schemas';

import { useEffect, useEffectEvent } from 'react';

import { subscribeRealtimeMessage } from '../lib/message-listeners';

export const useRealtimeMessage = (handler: (message: RealtimeServerMessage) => void) => {
  const onMessage = useEffectEvent((message: RealtimeServerMessage) => {
    handler(message);
  });

  useEffect(() => subscribeRealtimeMessage((message) => onMessage(message)), []);
};
