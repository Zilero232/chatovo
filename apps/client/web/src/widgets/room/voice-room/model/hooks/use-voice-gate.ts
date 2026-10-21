import { useLocalParticipant } from '@livekit/components-react';
import { useEffect, useEffectEvent, useRef } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings, VoiceGateProcessor } from '@/entities/app/settings';
import { toggleMicStream } from '@/shared/lib';

import { getLocalMicTrack, subscribeToMicTrack } from '../../lib';

export const useVoiceGate = (enabled: boolean, setIsSpeaking: (speaking: boolean) => void) => {
  const { settings } = useAppSettings();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const { autoSensitivity, micThreshold } = settings.audio;

  const setSpeaking = useEffectEvent(setIsSpeaking);

  const processorRef = useRef<VoiceGateProcessor | null>(null);
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

    let isActive = true;
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

        toggleMicStream(localParticipant, true);

        const processor = new VoiceGateProcessor(paramsRef.current, (_level, isOpen) => {
          if (isActive && processorRef.current === processor) {
            setSpeaking(isOpen);
          }
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
      });

    attach();

    const unsubscribe = subscribeToMicTrack(localParticipant, {
      onPublished: attach,
      onUnpublished: detach
    });

    return () => {
      isActive = false;
      unsubscribe();
      detach();
      setSpeaking(false);
    };
  }, [enabled, isMicrophoneEnabled, localParticipant]);
};
