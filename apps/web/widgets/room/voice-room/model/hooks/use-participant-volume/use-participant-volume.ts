'use client';

import type { Participant } from 'livekit-client';

import { useDebounceCallback } from '@siberiacancode/reactuse';
import { RemoteParticipant, Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { omit } from 'remeda';

import { STORAGE_KEYS } from '@/shared/constants';
import { readStoredJson, writeStoredJson } from '@/shared/lib';

import type { MuteMap, VolumeMap, VolumeSource } from '../../../lib';
import type { ParticipantVolume } from './use-participant-volume.types';

import { DEFAULT_VOLUME, VOLUME_PERSIST_DELAY_MS } from '../../../config';
import { buildVolumeStorageKey, capMutes, capVolumes, clampVolume } from '../../../lib';

const readVolumes = (): VolumeMap => readStoredJson<VolumeMap>(STORAGE_KEYS.participantVolumes, {});

const readMutes = (): MuteMap => readStoredJson<MuteMap>(STORAGE_KEYS.participantMutes, {});

export const useParticipantVolume = (
  participant: Participant,
  source: VolumeSource = Track.Source.Microphone
): ParticipantVolume => {
  const storageKey = buildVolumeStorageKey(participant.identity, source);
  const isControllable = participant instanceof RemoteParticipant;

  const [volume, setVolume] = useState(() => readVolumes()[storageKey] ?? DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(() => readMutes()[storageKey] === true);

  const persistVolume = useDebounceCallback((next: number) => {
    const stored = omit(readVolumes(), [storageKey]);

    writeStoredJson(
      STORAGE_KEYS.participantVolumes,
      next === DEFAULT_VOLUME ? stored : capVolumes({ ...stored, [storageKey]: next })
    );
  }, VOLUME_PERSIST_DELAY_MS);

  const persistMute = (next: boolean) => {
    const stored = omit(readMutes(), [storageKey]);

    writeStoredJson(
      STORAGE_KEYS.participantMutes,
      next ? capMutes({ ...stored, [storageKey]: true }) : stored
    );
  };

  const changeVolume = (next: number) => {
    const clamped = clampVolume(next);

    setVolume(clamped);
    persistVolume(clamped);
  };

  const toggleMute = () => {
    const next = !isMuted;

    setIsMuted(next);
    persistMute(next);
  };

  useEffect(() => {
    if (participant instanceof RemoteParticipant) {
      participant.setVolume(isMuted ? 0 : clampVolume(volume), source);
    }
  }, [participant, source, volume, isMuted]);

  return {
    volume,
    isControllable,
    isMuted,
    setVolume: changeVolume,
    toggleMute
  };
};
