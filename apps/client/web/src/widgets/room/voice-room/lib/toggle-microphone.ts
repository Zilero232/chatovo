import type { LocalParticipant } from 'livekit-client';

import { isMicLocked } from '@/entities/room/room';
import { appEvents, armPttStream } from '@/shared/lib';

type ToggleMicrophoneInput = {
  localParticipant: LocalParticipant;
  isPtt: boolean;
  source: string;
  onLocked: () => void;
};

export const toggleMicrophone = async ({
  localParticipant,
  isPtt,
  source,
  onLocked
}: ToggleMicrophoneInput) => {
  const next = !localParticipant.isMicrophoneEnabled;

  if (next && isMicLocked(localParticipant.permissions)) {
    onLocked();

    return;
  }

  try {
    await localParticipant.setMicrophoneEnabled(next);

    if (!next) {
      return;
    }

    appEvents.emit.micActivated();

    if (isPtt) {
      armPttStream(localParticipant);
    }
  } catch (err) {
    console.error(`${source} mic toggle failed`, err);
  }
};
