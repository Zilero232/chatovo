import type { PushLocale } from './config';

export type PushNotificationText = { title: string; body: string };

export type PushDelivery = {
  channelId: string;
  data: Record<string, string>;
  tag?: string;
  ttlMs?: number;
};

export type PushTokensPayload = PushDelivery & {
  notification: PushNotificationText;
  tokens: string[];
};

export type SendPushToUserInput = PushDelivery & {
  force?: boolean;
  notification: ((locale: PushLocale) => PushNotificationText) | PushNotificationText;
  userId: string;
};

export type IncomingCallPushInput = {
  callId: string;
  calleeId: string;
  caller: { id: string; name: string };
  roomId: string;
};

export type MissedCallPushInput = IncomingCallPushInput;
