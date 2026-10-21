import type { Participant } from 'livekit-client';

import { decodeTokenPayload, Track } from 'livekit-client';
import { z } from 'zod';

const TOKEN_GRANT_SCHEMA = z.object({
  video: z
    .object({
      canPublish: z.boolean().optional(),
      canPublishSources: z.array(z.string()).optional()
    })
    .optional()
});

const lacksMicrophone = (sources: string[]) =>
  sources.length > 0 && !sources.includes(Track.Source.Microphone);

export const isMicLocked = (permissions: Participant['permissions']): boolean => {
  if (!permissions?.canPublish) {
    return false;
  }

  return lacksMicrophone(
    permissions.canPublishSources.map((source) => Track.sourceFromProto(source))
  );
};

export const isTokenMicLocked = (token: string): boolean => {
  try {
    const { data } = TOKEN_GRANT_SCHEMA.safeParse(decodeTokenPayload(token));

    if (!data?.video?.canPublish) {
      return false;
    }

    return lacksMicrophone(data.video.canPublishSources ?? []);
  } catch {
    return false;
  }
};
