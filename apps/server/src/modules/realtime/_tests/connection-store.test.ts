import type { WebSocket } from 'ws';

import { describe, expect, it, vi } from 'vitest';

import {
  hasActiveUserConnection,
  registerConnection,
  sendToRoom,
  setConnectionRooms,
  unsubscribeUserFromRoom
} from '../connection-store';

const socket = () => ({}) as WebSocket;

const sendingSocket = () => ({ send: vi.fn() }) as unknown as WebSocket;

describe('hasActiveUserConnection', () => {
  it('is false for a user without connections', () => {
    expect(hasActiveUserConnection('nobody')).toBe(false);
  });

  it('is false when every connection is in the background', () => {
    const connection = registerConnection('user-background', socket(), false);

    connection.isActive = false;

    expect(hasActiveUserConnection('user-background')).toBe(false);
  });

  it('is true when any connection is in the foreground', () => {
    const phone = registerConnection('user-mixed', socket(), false);

    phone.isActive = false;
    registerConnection('user-mixed', socket(), false);

    expect(hasActiveUserConnection('user-mixed')).toBe(true);
  });
});

describe('unsubscribeUserFromRoom', () => {
  it('drops the room from every connection of the user and keeps their other rooms', () => {
    const tab = registerConnection('user-banned', socket(), false);
    const phone = registerConnection('user-banned', socket(), false);

    setConnectionRooms(tab.id, ['room-banned', 'room-other']);
    setConnectionRooms(phone.id, ['room-banned']);

    unsubscribeUserFromRoom({ userId: 'user-banned', roomId: 'room-banned' });

    expect([...tab.rooms]).toEqual(['room-other']);
    expect([...phone.rooms]).toEqual([]);
  });

  it('stops room broadcasts reaching the user while other members still get them', () => {
    const banned = registerConnection('user-cut', sendingSocket(), false);
    const member = registerConnection('user-stays', sendingSocket(), false);

    setConnectionRooms(banned.id, ['room-cut']);
    setConnectionRooms(member.id, ['room-cut']);

    unsubscribeUserFromRoom({ userId: 'user-cut', roomId: 'room-cut' });
    sendToRoom('room-cut', {
      type: 'room.reaction',
      roomId: 'room-cut',
      emoji: '🔥',
      senderId: 'x'
    });

    expect(banned.ws.send).not.toHaveBeenCalled();
    expect(member.ws.send).toHaveBeenCalledTimes(1);
  });

  it('does nothing for a user without connections', () => {
    expect(() => unsubscribeUserFromRoom({ userId: 'nobody', roomId: 'room-x' })).not.toThrow();
  });
});
