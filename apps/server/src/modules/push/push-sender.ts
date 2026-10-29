import type { ChatMessage } from '@chatovo/schemas';

import { PUSH_LINKS } from '@chatovo/schemas';

import type { PushLocale } from './config';
import type {
  IncomingCallPushInput,
  MissedCallPushInput,
  PushNotificationText,
  SendPushToUserInput
} from './push.types';

import { basePrisma as prisma } from '../../core';
import { hasActiveUserConnection } from '../realtime';
import { CALL_PUSH_TEXT, CALL_PUSH_TTL_MS } from './config';
import { sendPushToTokens } from './firebase-client';
import { resolvePushLocale } from './lib';

const PREVIEW_MAX = 120;

const truncate = (value: string, max: number): string => {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}…`;
};

const pruneInvalidTokens = async (tokens: string[]): Promise<void> => {
  if (tokens.length === 0) {
    return;
  }

  await prisma.pushDevice.deleteMany({ where: { token: { in: tokens } } });
};

const groupTokensByLocale = (devices: { token: string; locale: string | null }[]) => {
  const groups = new Map<PushLocale, string[]>();

  for (const { token, locale } of devices) {
    const key = resolvePushLocale(locale);

    groups.set(key, [...(groups.get(key) ?? []), token]);
  }

  return groups;
};

const sendToUser = async ({
  userId,
  notification,
  force,
  ...delivery
}: SendPushToUserInput): Promise<void> => {
  if (!force && hasActiveUserConnection(userId)) {
    return;
  }

  const devices = await prisma.pushDevice.findMany({
    where: { userId },
    select: { token: true, locale: true }
  });

  if (devices.length === 0) {
    return;
  }

  const sent = await Promise.all(
    [...groupTokensByLocale(devices)].map(([locale, tokens]) =>
      sendPushToTokens({
        ...delivery,
        tokens,
        notification: typeof notification === 'function' ? notification(locale) : notification
      })
    )
  );

  await pruneInvalidTokens(sent.flat());
};

const callText =
  (title: string, pick: (text: (typeof CALL_PUSH_TEXT)[PushLocale]) => string) =>
  (locale: PushLocale): PushNotificationText => ({ title, body: pick(CALL_PUSH_TEXT[locale]) });

export const sendDmMessagePush = async (input: {
  recipientId: string;
  message: ChatMessage;
}): Promise<void> => {
  const { recipientId, message } = input;

  if (!message.senderId || message.senderId === recipientId) {
    return;
  }

  const preview = message.body.trim() || 'New message';

  await sendToUser({
    userId: recipientId,
    notification: { title: message.senderName, body: truncate(preview, PREVIEW_MAX) },
    data: {
      type: 'dm_message',
      roomId: message.roomId,
      senderId: message.senderId,
      messageId: message.id,
      link: PUSH_LINKS.friendChat(message.senderId)
    },
    channelId: 'messages'
  });
};

export const sendIncomingCallPush = async ({
  callId,
  calleeId,
  caller,
  roomId
}: IncomingCallPushInput): Promise<void> => {
  await sendToUser({
    userId: calleeId,
    notification: callText(caller.name, (text) => text.incoming),
    data: {
      type: 'incoming_call',
      callId,
      roomId,
      callerId: caller.id,
      link: PUSH_LINKS.friendChat(caller.id)
    },
    channelId: 'calls',
    tag: callId,
    ttlMs: CALL_PUSH_TTL_MS,
    force: true
  });
};

export const sendMissedCallPush = async ({
  callId,
  calleeId,
  caller,
  roomId
}: MissedCallPushInput): Promise<void> => {
  await sendToUser({
    userId: calleeId,
    notification: callText(caller.name, (text) => text.missed),
    data: {
      type: 'missed_call',
      callId,
      roomId,
      callerId: caller.id,
      link: PUSH_LINKS.friendChat(caller.id)
    },
    channelId: 'messages',
    tag: callId,
    force: true
  });
};
