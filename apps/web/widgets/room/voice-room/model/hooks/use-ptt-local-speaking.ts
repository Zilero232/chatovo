'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { createAudioAnalyser } from 'livekit-client';
import { useEffect, useEffectEvent } from 'react';
import { isNullish } from 'remeda';

import { PTT_SPEAKING_LEVEL } from '../../config';
import { getLocalMicTrack, subscribeToMicTrack } from '../../lib';

export const usePttLocalSpeaking = (
  enabled: boolean,
  setIsSpeaking: (speaking: boolean) => void
) => {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const setSpeaking = useEffectEvent(setIsSpeaking);

  useEffect(() => {
    if (!enabled || isNullish(localParticipant) || !isMicrophoneEnabled) {
      setSpeaking(false);

      return;
    }

    let rafId = 0;
    let analyser: ReturnType<typeof createAudioAnalyser> | null = null;

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      analyser?.cleanup();
      analyser = null;
    };

    const tick = () => {
      const isStreamOpen = getLocalMicTrack(localParticipant)?.mediaStreamTrack.enabled ?? false;
      const level = analyser?.calculateVolume() ?? 0;

      setSpeaking(isStreamOpen && level > PTT_SPEAKING_LEVEL);
      rafId = requestAnimationFrame(tick);
    };

    const attach = () => {
      stop();

      const track = getLocalMicTrack(localParticipant);

      if (isNullish(track)) {
        setSpeaking(false);

        return;
      }

      analyser = createAudioAnalyser(track);
      tick();
    };

    attach();

    const unsubscribe = subscribeToMicTrack(localParticipant, {
      onPublished: attach,
      onUnpublished: () => {
        stop();
        setSpeaking(false);
      }
    });

    return () => {
      unsubscribe();
      stop();
      setSpeaking(false);
    };
  }, [enabled, isMicrophoneEnabled, localParticipant]);
};
