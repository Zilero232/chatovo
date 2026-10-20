'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect, useEffectEvent, useRef } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings, VoiceGateProcessor } from '@/entities/app/settings';
import { readMicStreamEnabled, toggleMicStream } from '@/shared/lib';

import { getLocalMicTrack, subscribeToMicTrack } from '../../lib';

export const useVoiceGate = (enabled: boolean, setIsSpeaking: (speaking: boolean) => void) => {
  const { settings } = useAppSettings();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const { autoSensitivity, micThreshold } = settings.audio;

  const setSpeaking = useEffectEvent(setIsSpeaking);

  const processorRef = useRef<VoiceGateProcessor | null>(null);
  const streamEnabledBeforeAttachRef = useRef<boolean | null>(null);
  const paramsRef = useRef({ autoSensitivity, threshold: micThreshold });

  useEffect(() => {
    const params = { autoSensitivity, threshold: micThreshold };

    paramsRef.current = params;
    processorRef.current?.update(params);
  }, [autoSensitivity, micThreshold]);

  useEffect(() => {
    if (isNullish(localParticipant) || !enabled || !isMicrophoneEnabled) {
      setSpeaking(false);

      return;
    }

    let pending = Promise.resolve();

    const enqueue = (task: () => Promise<void>) => {
      pending = pending.then(task).catch((err) => {
        console.error('voice gate task failed', err);
      });

      return pending;
    };

    const attach = () =>
      enqueue(async () => {
        const track = getLocalMicTrack(localParticipant);

        if (isNullish(track) || processorRef.current) {
          return;
        }

        streamEnabledBeforeAttachRef.current = readMicStreamEnabled(localParticipant);

        toggleMicStream(localParticipant, true);

        const processor = new VoiceGateProcessor(paramsRef.current, (_level, isOpen) => {
          setSpeaking(isOpen);
        });

        await track.setProcessor(processor);
        processorRef.current = processor;
      });

    const detach = () =>
      enqueue(async () => {
        if (isNullish(processorRef.current)) {
          return;
        }

        processorRef.current = null;

        await getLocalMicTrack(localParticipant)?.stopProcessor();

        const previous = streamEnabledBeforeAttachRef.current;

        streamEnabledBeforeAttachRef.current = null;

        if (previous !== null) {
          toggleMicStream(localParticipant, previous);
        }
      });

    attach();

    const unsubscribe = subscribeToMicTrack(localParticipant, {
      onPublished: attach,
      onUnpublished: detach
    });

    return () => {
      unsubscribe();
      detach();
      setSpeaking(false);
    };
  }, [enabled, isMicrophoneEnabled, localParticipant]);
};
