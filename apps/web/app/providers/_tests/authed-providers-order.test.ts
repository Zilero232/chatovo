import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(import.meta.dirname, '..', '(authed)', 'providers.tsx'), 'utf8');

const positionOf = (provider: string) => source.indexOf(`<${provider}`);

const isMountedAbove = (outer: string, inner: string) => {
  const outerAt = positionOf(outer);
  const innerAt = positionOf(inner);

  expect(outerAt, `${outer} is missing from AuthedProviders`).toBeGreaterThan(-1);
  expect(innerAt, `${inner} is missing from AuthedProviders`).toBeGreaterThan(-1);

  return outerAt < innerAt;
};

describe('AuthedProviders order', () => {
  it('mounts RoomSessionProvider above FriendChatProvider, which reads the active room', () => {
    expect(isMountedAbove('RoomSessionProvider', 'FriendChatProvider')).toBe(true);
  });

  it('mounts RealtimeProvider above RoomSessionProvider, which publishes presence patches', () => {
    expect(isMountedAbove('RealtimeProvider', 'RoomSessionProvider')).toBe(true);
  });

  it('keeps the room session inside the authed tree, so signing out tears the call down', () => {
    expect(source).toContain('RoomSessionProvider');
    expect(positionOf('RoomSessionProvider')).toBeGreaterThan(positionOf('ShortcutsProvider'));
  });
});
