import { describe, expect, it } from 'vitest';

import type { ChatLine } from '../../types';

import {
  appendChatLine,
  applyChatDeleteToLines,
  applyChatEditToLines,
  applyChatStatusToLines,
  mergeChatLines,
  prependChatLines,
  removeChatLine
} from '../merge-chat-lines';

const lineOf = (id: string, timestamp: number, over: Partial<ChatLine> = {}): ChatLine => ({
  id,
  message: id,
  timestamp,
  ...over
});

describe('mergeChatLines', () => {
  it('lets the fetched copy win over a stale cached one', () => {
    const merged = mergeChatLines(
      [lineOf('a', 1, { message: 'old' })],
      [lineOf('a', 1, { message: 'new' })]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].message).toBe('new');
  });

  it('keeps a cached message the server has not returned yet', () => {
    const merged = mergeChatLines([lineOf('pending', 5)], [lineOf('a', 1)]);

    expect(merged.map((line) => line.id)).toEqual(['a', 'pending']);
  });

  it('orders the result by timestamp', () => {
    const merged = mergeChatLines([lineOf('c', 30)], [lineOf('b', 20), lineOf('a', 10)]);

    expect(merged.map((line) => line.id)).toEqual(['a', 'b', 'c']);
  });
});

describe('appendChatLine', () => {
  it('starts a list when the cache is empty', () => {
    expect(appendChatLine(undefined, lineOf('a', 1))).toEqual([lineOf('a', 1)]);
  });

  it('appends a new message', () => {
    expect(appendChatLine([lineOf('a', 1)], lineOf('b', 2)).map((line) => line.id)).toEqual([
      'a',
      'b'
    ]);
  });

  it('merges into the existing entry instead of duplicating it', () => {
    const result = appendChatLine([lineOf('a', 1, { status: 'sending' })], lineOf('a', 1));

    expect(result).toHaveLength(1);
    expect(result[0].message).toBe('a');
  });
});

describe('applyChatStatusToLines', () => {
  it('marks only the addressed message', () => {
    const result = applyChatStatusToLines([lineOf('a', 1), lineOf('b', 2)], 'b', 'failed');

    expect(result[0].status).toBeUndefined();
    expect(result[1].status).toBe('failed');
  });
});

describe('removeChatLine', () => {
  it('drops the addressed message and leaves the rest', () => {
    expect(removeChatLine([lineOf('a', 1), lineOf('b', 2)], 'a').map((l) => l.id)).toEqual(['b']);
  });
});

describe('applyChatEditToLines', () => {
  it('replaces the body and stamps the edit time', () => {
    const [line] = applyChatEditToLines([lineOf('a', 1)], 'a', 'edited', 99);

    expect(line.message).toBe('edited');
    expect(line.editedAt).toBe(99);
  });
});

describe('applyChatDeleteToLines', () => {
  it('blanks the body so the deleted placeholder renders', () => {
    const [line] = applyChatDeleteToLines([lineOf('a', 1)], 'a', 77);

    expect(line.message).toBe('');
    expect(line.deletedAt).toBe(77);
  });
});

describe('prependChatLines', () => {
  it('puts the older page in front of what is already loaded', () => {
    const lines = prependChatLines([lineOf('c', 3)], [lineOf('a', 1), lineOf('b', 2)]);

    expect(lines.map((line) => line.id)).toEqual(['a', 'b', 'c']);
  });

  it('drops older entries already present in the list', () => {
    const lines = prependChatLines(
      [lineOf('b', 2), lineOf('c', 3)],
      [lineOf('a', 1), lineOf('b', 2)]
    );

    expect(lines.map((line) => line.id)).toEqual(['a', 'b', 'c']);
  });

  it('returns the older page as-is when nothing is loaded yet', () => {
    expect(prependChatLines(undefined, [lineOf('a', 1)]).map((line) => line.id)).toEqual(['a']);
  });
});
