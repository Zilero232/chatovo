import type { ReactNode } from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomSession } from '@/entities/room/session';

import { RoomSessionProvider, useRoomSession } from '@/entities/room/session';

let invisibleMode = false;
let isAdmin = true;
let issuedToken: string | undefined = 'token-invisible';

const roomTokenCalls: { roomId: string | null; password?: string }[] = [];

vi.mock('@/entities/app/settings', () => ({
  useAppSettings: () => ({ settings: { system: { invisibleMode } } })
}));

vi.mock('@/entities/auth/user', () => ({
  useCurrentUser: () => ({ isAdmin })
}));

vi.mock('@/entities/room/room', () => ({
  useRoomToken: (roomId: string | null, options: { password?: string }) => {
    roomTokenCalls.push({ roomId, ...options });

    return { data: roomId ? issuedToken : undefined };
  }
}));

const { useInvisibleModeSync } = await import('../use-invisible-mode-sync');

const wrapper = ({ children }: { children: ReactNode }) => (
  <RoomSessionProvider>{children}</RoomSessionProvider>
);

const sessionOf = (overrides: Partial<RoomSession> = {}): RoomSession => ({
  roomId: 'room-1',
  roomName: 'Room 1',
  token: 'token-visible',
  isChatOpen: false,
  isDm: false,
  isPrivate: false,
  isInvisible: false,
  ...overrides
});

const renderSync = () =>
  renderHook(
    () => {
      useInvisibleModeSync();

      return useRoomSession();
    },
    { wrapper }
  );

describe('useInvisibleModeSync', () => {
  beforeEach(() => {
    invisibleMode = false;
    isAdmin = true;
    issuedToken = 'token-invisible';
    roomTokenCalls.length = 0;
  });

  it('asks for no token while the mode matches the open session', () => {
    const { result } = renderSync();

    act(() => result.current.open(sessionOf()));

    expect(roomTokenCalls.every((call) => call.roomId === null)).toBe(true);
  });

  it('reissues the token and reopens the session when invisible mode turns on', async () => {
    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf()));

    invisibleMode = true;
    rerender();

    await waitFor(() => {
      expect(result.current.session?.isInvisible).toBe(true);
    });

    expect(result.current.session?.token).toBe('token-invisible');
  });

  it('carries the room password so a private room can reconnect', async () => {
    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf({ isPrivate: true, password: 'hunter2' })));

    invisibleMode = true;
    rerender();

    await waitFor(() => {
      expect(roomTokenCalls.some((call) => call.password === 'hunter2')).toBe(true);
    });
  });

  it('leaves the session alone for a non-admin, who has no invisible mode', () => {
    isAdmin = false;
    invisibleMode = true;

    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf()));
    rerender();

    expect(result.current.session?.isInvisible).toBe(false);
    expect(roomTokenCalls.every((call) => call.roomId === null)).toBe(true);
  });

  it('keeps the old session until a fresh token arrives', () => {
    issuedToken = undefined;

    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf()));

    invisibleMode = true;
    rerender();

    expect(result.current.session?.isInvisible).toBe(false);
    expect(result.current.session?.token).toBe('token-visible');
  });
});
