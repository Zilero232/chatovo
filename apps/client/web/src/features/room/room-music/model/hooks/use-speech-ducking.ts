import type { RemoteAudioTrack } from 'livekit-client';

import { useRoomContext } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { isNonNullish } from 'remeda';

import type { SpeechProbe } from '../../lib/index';

import { DUCKING } from '../../config/music';
import { createSpeechProbe, isProbeSpeaking, readLiveMicTrack } from '../../lib/index';

export const useSpeechDucking = (enabled: boolean) => {
  const room = useRoomContext();

  const [isSpeechActive, setIsSpeechActive] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const context = new AudioContext();
    const probes = new Map<RemoteAudioTrack, SpeechProbe>();
    let lastSpeechAt = Number.NEGATIVE_INFINITY;

    const syncProbes = (tracks: RemoteAudioTrack[]) => {
      for (const [track, probe] of probes) {
        if (!tracks.includes(track)) {
          probes.delete(track);
          probe.dispose();
        }
      }

      for (const track of tracks) {
        if (!probes.has(track)) {
          probes.set(track, createSpeechProbe({ context, track }));
        }
      }
    };

    void context.resume();

    const intervalId = setInterval(() => {
      syncProbes([...room.remoteParticipants.values()].map(readLiveMicTrack).filter(isNonNullish));

      const now = performance.now();

      if ([...probes.values()].some(isProbeSpeaking)) {
        lastSpeechAt = now;
      }

      setIsSpeechActive(now - lastSpeechAt < DUCKING.holdMs);
    }, DUCKING.pollMs);

    return () => {
      clearInterval(intervalId);
      setIsSpeechActive(false);
      probes.forEach((probe) => probe.dispose());
      void context.close();
    };
  }, [room, enabled]);

  return enabled && isSpeechActive;
};
