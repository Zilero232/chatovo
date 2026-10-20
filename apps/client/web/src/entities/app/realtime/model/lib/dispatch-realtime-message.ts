import type { RealtimeServerMessage, RoomsParticipantsSnapshot } from '@chatovo/schemas';

import { realtimeServerMessageSchema, safeJsonParse } from '@chatovo/schemas';
import { match } from 'ts-pattern';

import { decodeRealtimePayload } from './decode-realtime-payload';
import { publishRealtimeMessage } from './message-listeners';

export const parseRealtimeServerMessage = async (
  raw: unknown
): Promise<RealtimeServerMessage | null> => {
  const text = await decodeRealtimePayload(raw);

  if (!text) {
    return null;
  }

  const parsed = realtimeServerMessageSchema.safeParse(safeJsonParse(text));

  return parsed.success ? parsed.data : null;
};

export const dispatchRealtimeMessage = (
  message: RealtimeServerMessage,
  deps: {
    setPresence: (snapshot: RoomsParticipantsSnapshot) => void;
  }
): void => {
  const { setPresence } = deps;

  match(message)
    .with({ type: 'presence.snapshot' }, ({ snapshot }) => {
      setPresence(snapshot);
    })
    .otherwise(() => {});

  if (message.type !== 'presence.snapshot') {
    publishRealtimeMessage(message);
  }
};

export const emptyPresence = (): RoomsParticipantsSnapshot => ({ rooms: {}, lobbyOnline: 0 });
