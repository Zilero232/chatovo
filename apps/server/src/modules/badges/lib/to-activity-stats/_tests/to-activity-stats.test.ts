import { describe, expect, it } from 'vitest';

import { toActivityStats } from '../to-activity-stats';

describe('toActivityStats', () => {
  it('converts bigint counts to numbers', () => {
    expect(
      toActivityStats({
        messages: { dmChats: 3n, groupRooms: 5n, attachments: 12n, activeDays: 40n },
        calls: { seconds: 0n }
      })
    ).toEqual({ talker: 0, penPal: 3, wanderer: 5, sharer: 12, regular: 40 });
  });

  it('rounds call time down to whole minutes', () => {
    expect(toActivityStats({ messages: undefined, calls: { seconds: 179n } }).talker).toBe(2);
  });

  it('treats missing rows and null sums as zero', () => {
    expect(toActivityStats({ messages: undefined, calls: { seconds: null } })).toEqual({
      talker: 0,
      penPal: 0,
      wanderer: 0,
      sharer: 0,
      regular: 0
    });
  });
});
