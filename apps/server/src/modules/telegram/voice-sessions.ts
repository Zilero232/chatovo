import type {
  DeliverVoiceInput,
  DeliverVoiceResult,
  UpdateVoiceSessionInput,
  VoiceEmptyNotification,
  VoiceEntry,
  VoiceJoinNotification,
  VoiceLeaveNotification,
  VoiceTarget
} from './telegram.types';

import { editMessage, isTelegramEnabled, postMessage } from './bot';
import {
  VOICE_ABANDON_AFTER_MS,
  VOICE_FLUSH_DELAY_MS,
  VOICE_MAX_DELIVERY_ATTEMPTS,
  VOICE_MIN_EDIT_GAP_MS,
  VOICE_REFRESH_INTERVAL_MS,
  VOICE_RETRY_DELAY_MS
} from './config';
import { applyVoiceEvent, formatVoiceSession } from './lib';
import { roomUrl } from './links';
import { readVoiceRoom } from './voice-room-state';

const entries = new Map<string, VoiceEntry>();

const deliver = async ({
  roomId,
  entry,
  isOver
}: DeliverVoiceInput): Promise<DeliverVoiceResult> => {
  const { session } = entry;

  const message = formatVoiceSession({
    session,
    snapshot: readVoiceRoom({ roomId, participantIds: session.presentIds }),
    url: roomUrl(roomId),
    now: Date.now(),
    isOver
  });

  if (message.text === entry.lastText) {
    return { ok: true };
  }

  const hadMessage = entry.messageId !== null;

  if (entry.messageId !== null) {
    const outcome = await editMessage({ messageId: entry.messageId, message });

    if (outcome.kind === 'edited' || outcome.kind === 'unchanged') {
      entry.lastText = message.text;
      entry.lastEditAt = Date.now();

      return { ok: true };
    }

    if (outcome.kind === 'failed') {
      return { ok: false, retryAfterMs: outcome.retryAfterMs };
    }
  }

  const messageId = await postMessage({ message, silent: hadMessage || isOver });

  if (messageId === null) {
    return { ok: false, retryAfterMs: null };
  }

  entry.messageId = messageId;
  entry.lastText = message.text;
  entry.lastEditAt = Date.now();

  return { ok: true };
};

const isLive = ({ roomId, entry }: VoiceTarget): boolean => entries.get(roomId) === entry;

const flush = ({ roomId, entry, isOver }: DeliverVoiceInput): Promise<void> => {
  entry.queue = entry.queue
    .then(async () => {
      if (!isOver && !isLive({ roomId, entry })) {
        return;
      }

      const result = await deliver({ roomId, entry, isOver });

      if (result.ok) {
        entry.attempts = 0;

        return;
      }

      entry.attempts += 1;

      if (entry.attempts >= VOICE_MAX_DELIVERY_ATTEMPTS) {
        entry.attempts = 0;

        return;
      }

      entry.timer = setTimeout(() => {
        entry.timer = null;
        void flush({ roomId, entry, isOver });
      }, result.retryAfterMs ?? VOICE_RETRY_DELAY_MS);
    })
    .catch((error: unknown) => {
      console.error(`Telegram voice session update failed: ${String(error)}`);
    });

  return entry.queue;
};

const scheduleFlush = ({ roomId, entry }: VoiceTarget) => {
  if (entry.timer) {
    return;
  }

  const gapLeft =
    entry.lastEditAt === null ? 0 : entry.lastEditAt + VOICE_MIN_EDIT_GAP_MS - Date.now();

  entry.timer = setTimeout(
    () => {
      entry.timer = null;
      void flush({ roomId, entry, isOver: false });
    },
    Math.max(VOICE_FLUSH_DELAY_MS, gapLeft)
  );
};

const finish = ({ roomId, entry }: VoiceTarget): Promise<void> => {
  entries.delete(roomId);

  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = null;
  }

  if (entry.refreshTimer) {
    clearInterval(entry.refreshTimer);
    entry.refreshTimer = null;
  }

  entry.attempts = 0;
  entry.session =
    applyVoiceEvent({ session: entry.session, event: { type: 'end' }, now: Date.now() }) ??
    entry.session;

  return flush({ roomId, entry, isOver: true });
};

const refresh = ({ roomId, entry }: VoiceTarget) => {
  const { emptySince } = entry;

  if (emptySince !== null && Date.now() - emptySince >= VOICE_ABANDON_AFTER_MS) {
    void finish({ roomId, entry });

    return;
  }

  scheduleFlush({ roomId, entry });
};

const updateSession = ({ roomId, event }: UpdateVoiceSessionInput) => {
  if (!isTelegramEnabled()) {
    return;
  }

  const existing = entries.get(roomId);
  const session = applyVoiceEvent({ session: existing?.session ?? null, event, now: Date.now() });

  if (!session) {
    return;
  }

  const entry: VoiceEntry = existing ?? {
    attempts: 0,
    emptySince: null,
    lastEditAt: null,
    lastText: null,
    messageId: null,
    queue: Promise.resolve(),
    refreshTimer: null,
    session,
    timer: null
  };

  entry.session = session;
  entry.emptySince = session.presentIds.length === 0 ? (entry.emptySince ?? Date.now()) : null;

  if (!existing) {
    entries.set(roomId, entry);
    entry.refreshTimer = setInterval(refresh, VOICE_REFRESH_INTERVAL_MS, { roomId, entry });
  }

  scheduleFlush({ roomId, entry });
};

export const notifyVoiceJoin = async ({
  roomId,
  roomName,
  isDm,
  participantId,
  participantName
}: VoiceJoinNotification): Promise<void> => {
  if (isDm) {
    return;
  }

  updateSession({ roomId, event: { type: 'join', participantId, participantName, roomName } });
};

export const notifyVoiceLeave = async ({
  roomId,
  participantId
}: VoiceLeaveNotification): Promise<void> => {
  updateSession({ roomId, event: { type: 'leave', participantId } });
};

export const notifyVoiceEmpty = async ({
  roomId,
  roomName
}: VoiceEmptyNotification): Promise<void> => {
  const entry = entries.get(roomId);

  if (!entry) {
    return;
  }

  entry.session = { ...entry.session, roomName };

  await finish({ roomId, entry });
};
