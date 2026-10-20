'use client';

import { useParticipants } from '@livekit/components-react';
import { RemoteParticipant, Track } from 'livekit-client';
import { useEffect } from 'react';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

import type { MuteMap, VolumeMap } from '../../../lib';

import { ROSTER_EVENTS } from '../../../config';
import { buildVolumeStorageKey, clampVolume } from '../../../lib';

const VOLUME_SOURCES = [Track.Source.Microphone, Track.Source.ScreenShareAudio] as const;

export const useRestoreParticipantVolumes = () => {
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const identities = participants.map((participant) => participant.identity).join();

  useEffect(() => {
    const volumes = readStoredJson<VolumeMap>(STORAGE_KEYS.participantVolumes, {});
    const mutes = readStoredJson<MuteMap>(STORAGE_KEYS.participantMutes, {});

    for (const participant of participants) {
      if (!(participant instanceof RemoteParticipant)) {
        continue;
      }

      for (const source of VOLUME_SOURCES) {
        const key = buildVolumeStorageKey(participant.identity, source);
        const stored = volumes[key];

        if (mutes[key]) {
          participant.setVolume(0, source);

          continue;
        }

        if (stored !== undefined) {
          participant.setVolume(clampVolume(stored), source);
        }
      }
    }
    // eslint-disable-next-line react/exhaustive-deps -- volumes are re-applied when the roster changes; participants is a fresh array every render
  }, [identities]);
};
