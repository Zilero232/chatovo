'use client';

import type { Participant } from 'livekit-client';

import { useParticipantTracks } from '@livekit/components-react';
import { createAudioAnalyser, LocalAudioTrack, RemoteAudioTrack, Track } from 'livekit-client';
import { useEffect, useState } from 'react';

import { AUDIO_LEVEL_ANALYSER, isTauriMobile, readAudioLevel } from '@/shared/lib';

import {
  FRAME_INTERVAL_MS,
  LEVEL_ATTACK,
  LEVEL_RELEASE,
  LITE_FRAME_INTERVAL_MS
} from '../../config';

export const useParticipantAudioLevel = <T extends HTMLElement>(participant: Participant) => {
  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const [node, setNode] = useState<T | null>(null);

  const track = micTrack?.publication.track;

  useEffect(() => {
    if (
      !node ||
      !(track instanceof LocalAudioTrack || track instanceof RemoteAudioTrack) ||
      !track.mediaStream
    ) {
      return;
    }

    const { analyser, cleanup } = createAudioAnalyser(track, AUDIO_LEVEL_ANALYSER);
    const bins = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    const interval = isTauriMobile() ? LITE_FRAME_INTERVAL_MS : FRAME_INTERVAL_MS;

    let frameId: number | null = null;
    let lastFrameAt = 0;
    let smoothed = 0;

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);

      if (now - lastFrameAt < interval) {
        return;
      }

      lastFrameAt = now;

      const level = readAudioLevel({ analyser, bins });

      smoothed += (level - smoothed) * (level > smoothed ? LEVEL_ATTACK : LEVEL_RELEASE);

      node.style.setProperty('--voice-level', smoothed.toFixed(3));
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      node.style.removeProperty('--voice-level');

      void cleanup();
    };
  }, [track, node]);

  return setNode;
};
