import type { FormattedString } from '@grammyjs/parse-mode';

import { Bot } from 'grammy';

import type { EditMessageInput, EditOutcome, PostMessageInput } from './telegram.types';

import { env } from '../../core';
import { readEditFailure } from './lib';

const baseFetchConfig = env.TELEGRAM_PROXY_URL
  ? ({ proxy: env.TELEGRAM_PROXY_URL } as RequestInit)
  : undefined;

const bot = env.TELEGRAM_BOT_TOKEN
  ? new Bot(env.TELEGRAM_BOT_TOKEN, { client: { baseFetchConfig } })
  : null;

const isDev = env.NODE_ENV === 'development';

let devMessageId = 0;

const describeError = (error: unknown): string =>
  error instanceof Error ? error.message : 'unknown error';

export const isTelegramEnabled = (): boolean =>
  isDev || (bot !== null && Boolean(env.TELEGRAM_CHAT_ID));

export const postMessage = async ({
  message,
  silent = false
}: PostMessageInput): Promise<number | null> => {
  if (isDev) {
    devMessageId += 1;

    // eslint-disable-next-line no-console -- dev-only notification stub
    console.info(`[telegram:dev #${devMessageId}] ${message.text}`);

    return devMessageId;
  }

  const chatId = env.TELEGRAM_CHAT_ID;

  if (!bot || !chatId) {
    return null;
  }

  try {
    const sent = await bot.api.sendMessage(chatId, message.text, {
      entities: message.entities,
      link_preview_options: { is_disabled: true },
      disable_notification: silent
    });

    return sent.message_id;
  } catch (error) {
    console.error(`Telegram sendMessage error: ${describeError(error)}`);

    return null;
  }
};

export const editMessage = async ({
  messageId,
  message
}: EditMessageInput): Promise<EditOutcome> => {
  if (isDev) {
    // eslint-disable-next-line no-console -- dev-only notification stub
    console.info(`[telegram:dev #${messageId} edited] ${message.text}`);

    return { kind: 'edited' };
  }

  const chatId = env.TELEGRAM_CHAT_ID;

  if (!bot || !chatId) {
    return { kind: 'failed', retryAfterMs: null };
  }

  try {
    await bot.api.editMessageText(chatId, messageId, message.text, {
      entities: message.entities,
      link_preview_options: { is_disabled: true }
    });

    return { kind: 'edited' };
  } catch (error) {
    const failure = readEditFailure(error);

    if (failure.kind === 'failed') {
      console.error(`Telegram editMessageText error: ${describeError(error)}`);
    }

    return failure;
  }
};

export const send = async (message: FormattedString): Promise<void> => {
  await postMessage({ message });
};
