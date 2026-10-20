'use client';

import { useRef, useState } from 'react';

import type { AudioSettings } from '@/entities/app/settings';

import { useMicAnalyser } from './use-mic-analyser';

type UseMicTest = {
  error: boolean;
  isLoopback: boolean;
  level: number;
  toggleLoopback: () => void;
};

type MicTestArgs = {
  audio: AudioSettings;
  deviceId: string;
};

export const useMicTest = ({ deviceId, audio }: MicTestArgs): UseMicTest => {
  const [isLoopback, setIsLoopback] = useState(false);
  const [error, setError] = useState(false);

  const sinkRef = useRef<HTMLAudioElement | null>(null);

  const ensureSink = () => {
    if (sinkRef.current === null && typeof Audio !== 'undefined') {
      sinkRef.current = new Audio();
    }

    return sinkRef.current;
  };

  const stopSink = () => {
    const sink = sinkRef.current;

    if (sink) {
      sink.pause();
      sink.srcObject = null;
    }
  };

  const level = useMicAnalyser({
    deviceId,
    audio,
    active: isLoopback,
    onReady: (stream) => {
      setError(false);

      const sink = ensureSink();

      if (sink) {
        sink.srcObject = stream;
        sink.play().catch(() => {});
      }
    },
    onError: () => setError(true),
    onStop: () => {
      stopSink();
      setIsLoopback(false);
    }
  });

  const toggleLoopback = () => {
    setIsLoopback((on) => !on);
  };

  return { level, isLoopback, toggleLoopback, error };
};
