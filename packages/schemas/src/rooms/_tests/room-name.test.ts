import { describe, expect, it } from 'vitest';

import { createRoomInputSchema } from '../inputs';

const isValidName = (name: string) =>
  createRoomInputSchema.safeParse({ name, isPrivate: false }).success;

describe('room name', () => {
  it.each(['Evening call', 'Вечерний созвон', 'Ёлка 2026', 'Lo-fi_room', 'Café'])(
    'accepts letters in any script: %s',
    (name) => {
      expect(isValidName(name)).toBe(true);
    }
  );

  it.each(['<script>', 'room!', 'a/b', '   '])('refuses %s', (name) => {
    expect(isValidName(name)).toBe(false);
  });
});
