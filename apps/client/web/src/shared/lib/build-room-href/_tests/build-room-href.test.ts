import { describe, expect, it } from 'vitest';

import { buildRoomHref } from '../build-room-href';

describe('buildRoomHref', () => {
  it('puts the room id in a query param', () => {
    expect(buildRoomHref('room-1')).toBe('/room?id=room-1');
  });

  it('adds the chat view when asked', () => {
    expect(buildRoomHref('room-1', { view: 'chat' })).toBe('/room?id=room-1&view=chat');
  });

  it('carries a title override', () => {
    expect(buildRoomHref('room-1', { title: 'Team sync' })).toBe('/room?id=room-1&title=Team+sync');
  });

  it('escapes a title with special characters', () => {
    expect(buildRoomHref('room-1', { title: 'a&b=c' })).toBe('/room?id=room-1&title=a%26b%3Dc');
  });

  it('ignores an empty options object', () => {
    expect(buildRoomHref('room-1', {})).toBe('/room?id=room-1');
  });
});
