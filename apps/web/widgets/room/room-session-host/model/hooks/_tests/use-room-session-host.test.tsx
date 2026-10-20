import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomSession } from '@/entities/room/session';

import { RoomSessionProvider, useRoomSession } from '@/entities/room/session';

const replace = vi.fn();
const push = vi.fn();

let pathname = '/room';
let searchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push }),
  usePathname: () => pathname,
  useSearchParams: () => searchParams
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}));

const { useRoomSessionHost } = await import('../use-room-session-host');

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

const renderHost = () =>
  renderHook(() => ({ host: useRoomSessionHost(), session: useRoomSession() }), { wrapper });

describe('useRoomSessionHost', () => {
  beforeEach(() => {
    replace.mockReset();
    push.mockReset();
    pathname = '/room';
    searchParams = new URLSearchParams();
  });

  it('stays collapsed while no session is open', () => {
    const { result } = renderHost();

    expect(result.current.host.session).toBeNull();
    expect(result.current.host.isExpanded).toBe(false);
  });

  it('expands the room the url points at', () => {
    searchParams = new URLSearchParams({ id: 'room-1' });

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.host.isExpanded).toBe(true);
  });

  it('keeps the call collapsed when the url points at a different room', () => {
    searchParams = new URLSearchParams({ id: 'room-2' });

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.host.isExpanded).toBe(false);
  });

  it('keeps the call collapsed away from the room route', () => {
    pathname = '/lobby';
    searchParams = new URLSearchParams({ id: 'room-1' });

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.host.isExpanded).toBe(false);
  });

  it('clears the session and returns to the lobby when leaving from the room route', () => {
    searchParams = new URLSearchParams({ id: 'room-1' });

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();

    expect(result.current.session.session).toBeNull();
    expect(replace).toHaveBeenCalledWith('/lobby');
  });

  it('leaves without navigating when the user is already elsewhere', () => {
    pathname = '/lobby';

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();

    expect(result.current.session.session).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  it('ignores a leave from a room the user already switched away from', () => {
    searchParams = new URLSearchParams({ id: 'room-2' });

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-2')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();

    expect(result.current.session.session?.roomId).toBe('room-2');
    expect(replace).not.toHaveBeenCalled();
  });

  it('navigates back to the room when expanding', () => {
    pathname = '/lobby';

    const { result } = renderHost();

    act(() => result.current.host.expand('room-1'));

    expect(push).toHaveBeenCalledWith('/room?id=room-1');
  });
});
