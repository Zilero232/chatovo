import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { RoomSession } from '../room-session-context.types';

import { RoomSessionProvider, useRoomSession } from '../room-session-context';

const wrapper = ({ children }: { children: ReactNode }) => (
  <RoomSessionProvider>{children}</RoomSessionProvider>
);

const sessionOf = (roomId: string): RoomSession => ({
  roomId,
  roomName: `Room ${roomId}`,
  token: `token-${roomId}`,
  isChatOpen: false,
  isDm: false,
  isPrivate: false,
  isInvisible: false
});

describe('useRoomSession', () => {
  it('starts with no session', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    expect(result.current.session).toBeNull();
  });

  it('holds the session it was opened with', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));

    expect(result.current.session?.roomId).toBe('room-1');
    expect(result.current.session?.token).toBe('token-room-1');
  });

  it('replaces the session when another room is opened', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));
    act(() => result.current.open(sessionOf('room-2')));

    expect(result.current.session?.roomId).toBe('room-2');
  });

  it('clears the session on close', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));
    act(() => result.current.close());

    expect(result.current.session).toBeNull();
  });

  it('survives a rerender, so navigation does not drop the call', () => {
    const { result, rerender } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));
    rerender();

    expect(result.current.session?.roomId).toBe('room-1');
  });

  it('carries the chat intent from the link into the session', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open({ ...sessionOf('room-1'), isChatOpen: true }));

    expect(result.current.session?.isChatOpen).toBe(true);
  });

  it('refuses to reopen a room that was just left', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));
    act(() => result.current.close('room-1'));
    act(() => result.current.open(sessionOf('room-1')));

    expect(result.current.session).toBeNull();
    expect(result.current.isRecentlyLeft('room-1')).toBe(true);
  });

  it('still allows opening a different room after leaving one', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));
    act(() => result.current.close('room-1'));
    act(() => result.current.open(sessionOf('room-2')));

    expect(result.current.session?.roomId).toBe('room-2');
  });

  it('lets the room be reopened once rejoin lifts the guard', () => {
    const { result } = renderHook(() => useRoomSession(), { wrapper });

    act(() => result.current.open(sessionOf('room-1')));
    act(() => result.current.close('room-1'));
    act(() => result.current.rejoin());
    act(() => result.current.open(sessionOf('room-1')));

    expect(result.current.session?.roomId).toBe('room-1');
  });

  it('throws outside a provider', () => {
    expect(() => renderHook(() => useRoomSession())).toThrow(
      'useRoomSession must be used within RoomSessionProvider'
    );
  });
});
