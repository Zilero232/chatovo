'use client';

import { useLocalParticipant, useParticipants } from '@livekit/components-react';

import { useAppSettings } from '@/entities/app/settings';
import { useAchievementTracker } from '@/features/app/achievements';
import { useAloneAmbience } from '@/features/app/alone-ambience';

import { ROSTER_EVENTS } from '../../../config';

export const RoomEasterEggsController = () => {
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });
  const { isMicrophoneEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();

  const isAlone = participants.length === 1;

  useAchievementTracker({
    isInRoom: true,
    isMicEnabled: isMicrophoneEnabled,
    participantCount: participants.length
  });
  useAloneAmbience({ isAlone, isEnabled: settings.sounds.enabled.ambience });

  return null;
};
