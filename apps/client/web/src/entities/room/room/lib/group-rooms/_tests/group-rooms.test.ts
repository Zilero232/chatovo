import type { Room } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { countRoomsByFilter, groupRooms } from '../group-rooms';

const roomOf = (over: Partial<Room> & Pick<Room, 'id' | 'name'>): Room =>
  ({ isPrivate: false, ownerId: 'owner-1', kind: 'group', ...over }) as Room;

const ROOMS = [
  roomOf({ id: 'a', name: 'Alpha' }),
  roomOf({ id: 'b', name: 'Bravo', isPrivate: true }),
  roomOf({ id: 'c', name: 'Charlie', ownerId: 'me' })
];

const PRESENCE = { a: [{ identity: 'x' }] } as never;

describe('groupRooms', () => {
  it('splits rooms into a private and a public section', () => {
    const sections = groupRooms({ rooms: ROOMS, presence: PRESENCE, query: '' });

    expect(sections.map((section) => section.key)).toEqual(['private', 'public']);
  });

  it('drops a section that would render empty', () => {
    const sections = groupRooms({
      rooms: [roomOf({ id: 'a', name: 'Alpha' })],
      presence: PRESENCE,
      query: ''
    });

    expect(sections).toHaveLength(1);
    expect(sections[0].key).toBe('public');
  });

  it('orders busy rooms above quiet ones', () => {
    const sections = groupRooms({
      rooms: [roomOf({ id: 'z', name: 'Zulu' }), roomOf({ id: 'a', name: 'Alpha' })],
      presence: PRESENCE,
      query: ''
    });

    expect(sections[0].rooms.map((room) => room.id)).toEqual(['a', 'z']);
  });

  it('matches the search query case-insensitively', () => {
    const sections = groupRooms({ rooms: ROOMS, presence: PRESENCE, query: 'ALPH' });

    expect(sections.flatMap((section) => section.rooms).map((room) => room.id)).toEqual(['a']);
  });

  it('keeps only rooms with someone inside under the live filter', () => {
    const sections = groupRooms({
      rooms: ROOMS,
      presence: PRESENCE,
      query: '',
      filter: 'live'
    });

    expect(sections.flatMap((section) => section.rooms).map((room) => room.id)).toEqual(['a']);
  });

  it('keeps only my rooms under the mine filter', () => {
    const sections = groupRooms({
      rooms: ROOMS,
      presence: PRESENCE,
      query: '',
      filter: 'mine',
      currentUserId: 'me'
    });

    expect(sections.flatMap((section) => section.rooms).map((room) => room.id)).toEqual(['c']);
  });
});

describe('countRoomsByFilter', () => {
  it('counts every filter tab from one pass over the rooms', () => {
    expect(countRoomsByFilter({ rooms: ROOMS, presence: PRESENCE, currentUserId: 'me' })).toEqual({
      all: 3,
      live: 1,
      mine: 1
    });
  });

  it('reports zeroes for an empty room list', () => {
    expect(countRoomsByFilter({ rooms: [], presence: {} as never })).toEqual({
      all: 0,
      live: 0,
      mine: 0
    });
  });
});
