import { hoursToMilliseconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { ChatLine } from '../../../types';

import { groupChatLines } from '../group-chat-lines';

const DAY = hoursToMilliseconds(24);
const NOON = new Date('2026-09-03T12:00:00.000Z').getTime();

const lineOf = (id: string, identity: string, timestamp: number): ChatLine => ({
  id,
  message: id,
  timestamp,
  from: { identity }
});

describe('groupChatLines', () => {
  it('marks the viewer own messages', () => {
    const grouped = groupChatLines({
      lines: [lineOf('a', 'me', NOON), lineOf('b', 'other', NOON)],
      ownIdentity: 'me'
    });

    expect(grouped.map((line) => line.isOwn)).toEqual([true, false]);
  });

  it('groups a run from the same author on the same day', () => {
    const grouped = groupChatLines({
      lines: [lineOf('a', 'me', NOON), lineOf('b', 'me', NOON + 1_000)],
      ownIdentity: 'me'
    });

    expect(grouped.map((line) => line.isGrouped)).toEqual([false, true]);
  });

  it('breaks the group when the author changes', () => {
    const grouped = groupChatLines({
      lines: [lineOf('a', 'me', NOON), lineOf('b', 'other', NOON + 1_000)],
      ownIdentity: 'me'
    });

    expect(grouped[1].isGrouped).toBe(false);
  });

  it('breaks the group across a day boundary even for the same author', () => {
    const grouped = groupChatLines({
      lines: [lineOf('a', 'me', NOON), lineOf('b', 'me', NOON + DAY)],
      ownIdentity: 'me'
    });

    expect(grouped[1].isGrouped).toBe(false);
    expect(grouped[1].showDivider).toBe(true);
  });

  it('tails the last message of every run', () => {
    const grouped = groupChatLines({
      lines: [
        lineOf('a', 'me', NOON),
        lineOf('b', 'me', NOON + 1_000),
        lineOf('c', 'other', NOON + 2_000)
      ],
      ownIdentity: 'me'
    });

    expect(grouped.map((line) => line.isTail)).toEqual([false, true, true]);
  });

  it('always shows a divider above the first message', () => {
    const grouped = groupChatLines({ lines: [lineOf('a', 'me', NOON)], ownIdentity: 'me' });

    expect(grouped[0].showDivider).toBe(true);
  });

  it('returns nothing for an empty conversation', () => {
    expect(groupChatLines({ lines: [], ownIdentity: 'me' })).toEqual([]);
  });
});
