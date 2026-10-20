import { sortBy } from 'remeda';

import type { ChatLine, ChatLineStatus } from '../types';

export const mergeChatLines = (cached: ChatLine[], fetched: ChatLine[]): ChatLine[] => {
  const byId = new Map(fetched.map((line) => [line.id, line]));

  for (const line of cached) {
    if (!byId.has(line.id)) {
      byId.set(line.id, line);
    }
  }

  return sortBy([...byId.values()], (line) => line.timestamp);
};

export const prependChatLines = (lines: ChatLine[] | undefined, older: ChatLine[]): ChatLine[] => {
  if (!lines?.length) {
    return older;
  }

  const known = new Set(lines.map((line) => line.id));

  return [...older.filter((line) => !known.has(line.id)), ...lines];
};

export const appendChatLine = (lines: ChatLine[] | undefined, line: ChatLine): ChatLine[] => {
  if (!lines) {
    return [line];
  }

  if (lines.some((item) => item.id === line.id)) {
    return lines.map((item) => (item.id === line.id ? { ...item, ...line } : item));
  }

  return [...lines, line];
};

export const applyChatStatusToLines = (
  lines: ChatLine[],
  id: string,
  status: ChatLineStatus
): ChatLine[] => lines.map((line) => (line.id === id ? { ...line, status } : line));

export const removeChatLine = (lines: ChatLine[], id: string): ChatLine[] =>
  lines.filter((line) => line.id !== id);

export const applyChatEditToLines = (
  lines: ChatLine[],
  id: string,
  body: string,
  editedAt: number
): ChatLine[] =>
  lines.map((line) => (line.id === id ? { ...line, message: body, editedAt } : line));

export const applyChatDeleteToLines = (
  lines: ChatLine[],
  id: string,
  deletedAt: number
): ChatLine[] => lines.map((line) => (line.id === id ? { ...line, message: '', deletedAt } : line));
