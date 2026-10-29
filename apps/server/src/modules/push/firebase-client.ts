import type { ServiceAccount } from 'firebase-admin/app';
import type { Message, Messaging, SendResponse } from 'firebase-admin/messaging';

import { Logger } from '@nestjs/common';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

import type { PushTokensPayload } from './push.types';

import { env } from '../../core';

const logger = new Logger('FirebaseClient');

let messaging: Messaging | null | undefined;

const getMessagingClient = (): Messaging | null => {
  if (messaging !== undefined) {
    return messaging;
  }

  const raw = env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    logger.warn('FIREBASE_SERVICE_ACCOUNT is not set — push notifications are disabled');
    messaging = null;

    return null;
  }

  try {
    const serviceAccount = JSON.parse(raw) as ServiceAccount;

    if (!getApps().length) {
      initializeApp({ credential: cert(serviceAccount) });
    }

    messaging = getMessaging();
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    logger.error(`Firebase init error: ${reason}`);
    messaging = null;
  }

  return messaging;
};

const pickInvalidTokens = (tokens: string[], responses: SendResponse[]): string[] =>
  tokens.filter((_, index) => {
    const code = responses[index]?.error?.code;

    return (
      code === 'messaging/invalid-registration-token' ||
      code === 'messaging/registration-token-not-registered'
    );
  });

export const sendPushToTokens = async ({
  tokens,
  notification,
  data,
  channelId,
  tag,
  ttlMs
}: PushTokensPayload): Promise<string[]> => {
  const client = getMessagingClient();

  if (!client || tokens.length === 0) {
    return [];
  }

  const messages: Message[] = tokens.map((token) => ({
    token,
    notification,
    data,
    android: {
      priority: 'high',
      ...(ttlMs === undefined ? {} : { ttl: ttlMs }),
      notification: { channelId, ...(tag === undefined ? {} : { tag }) }
    },
    apns: { payload: { aps: { sound: 'default' } } }
  }));

  try {
    const result = await client.sendEach(messages);

    return pickInvalidTokens(tokens, result.responses);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    logger.error(`FCM send error: ${reason}`);

    return [];
  }
};
