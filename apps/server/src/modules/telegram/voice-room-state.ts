import type { ReadVoiceRoomInput, VoicePresence, VoiceRoomSnapshot } from './telegram.types';

import { findRoomParticipant } from '../livekit';
import { readRoomMusic } from '../music';

export const readVoiceRoom = ({
  roomId,
  participantIds
}: ReadVoiceRoomInput): VoiceRoomSnapshot => {
  const presence: Record<string, VoicePresence> = {};

  for (const identity of participantIds) {
    const participant = findRoomParticipant({ roomId, identity });

    if (participant) {
      const { activity, deafened, micMuted } = participant;

      presence[identity] = { activity, deafened, micMuted };
    }
  }

  const { current, playback } = readRoomMusic(roomId);
  const isPlaying = current !== null && playback?.status === 'playing';

  return {
    presence,
    track: isPlaying ? { artist: current.artist, title: current.title } : null
  };
};
