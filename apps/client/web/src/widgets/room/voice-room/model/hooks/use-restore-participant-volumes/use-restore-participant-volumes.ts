import { useParticipants } from '@livekit/components-react';
import { RemoteParticipant, Track } from 'livekit-client';
import { useEffect } from 'react';

import { useBlockedUserIds } from '@/entities/social/friend';
import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson } from '@/shared/lib';

import type { MuteMap, VolumeMap } from '../../../lib';

import { DEFAULT_VOLUME, ROSTER_EVENTS } from '../../../config';
import { buildVolumeStorageKey, resolveParticipantVolume } from '../../../lib';

const VOLUME_SOURCES = [Track.Source.Microphone, Track.Source.ScreenShareAudio] as const;

export const useRestoreParticipantVolumes = () => {
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  const blockedIds = useBlockedUserIds();

  const roster = participants
    .map((participant) => `${participant.identity}:${participant.sid}`)
    .join();
  const blockedKey = [...blockedIds].join();

  useEffect(() => {
    const volumes = readStoredJson<VolumeMap>(STORAGE_KEYS.participantVolumes, {});
    const mutes = readStoredJson<MuteMap>(STORAGE_KEYS.participantMutes, {});

    for (const participant of participants) {
      if (!(participant instanceof RemoteParticipant)) {
        continue;
      }

      const isBlocked = blockedIds.has(participant.identity);

      for (const source of VOLUME_SOURCES) {
        const key = buildVolumeStorageKey(participant.identity, source);

        participant.setVolume(
          resolveParticipantVolume({
            volume: volumes[key] ?? DEFAULT_VOLUME,
            isMuted: mutes[key] === true,
            isBlocked
          }),
          source
        );
      }
    }
    // eslint-disable-next-line react/exhaustive-deps -- volumes are re-applied when the roster or the block list changes; participants and blockedIds are fresh every render
  }, [roster, blockedKey]);
};
