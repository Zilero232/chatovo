'use client';

import type { Participant } from 'livekit-client';

import { useIsSpeaking } from '@livekit/components-react';

import { useLocalSpeaking } from '../contexts';

export const useParticipantIsSpeaking = (participant: Participant) => {
  const livekitSpeaking = useIsSpeaking(participant);
  const { isSpeaking: localSpeaking } = useLocalSpeaking();

  return participant.isLocal ? localSpeaking : livekitSpeaking;
};
