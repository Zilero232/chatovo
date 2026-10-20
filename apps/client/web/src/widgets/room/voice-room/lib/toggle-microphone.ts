import type { LocalParticipant } from 'livekit-client';

import { appEvents, armPttStream } from '@/shared/lib';

type ToggleMicrophoneInput = {
  localParticipant: LocalParticipant;
  isPtt: boolean;
  source: string;
};

export const toggleMicrophone = async ({
  localParticipant,
  isPtt,
  source
}: ToggleMicrophoneInput) => {
  try {
    const next = !localParticipant.isMicrophoneEnabled;

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
