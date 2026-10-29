import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomSession } from '@/entities/room/session';

import { RoomSessionProvider, useRoomSession } from '@/entities/room/session';

const navigate = vi.fn();

let pathname = '/room';
let search: { id?: string } = {};

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  useLocation: ({ select }: { select: (location: { pathname: string }) => string }) =>
    select({ pathname }),
  useSearch: ({ select }: { select: (value: typeof search) => unknown }) => select(search)
}));

vi.mock('use-intl', () => ({
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
    navigate.mockReset();
    pathname = '/room';
    search = {};
  });

  it('stays collapsed while no session is open', () => {
    const { result } = renderHost();

    expect(result.current.host.session).toBeNull();
    expect(result.current.host.isExpanded).toBe(false);
  });

  it('expands the room the url points at', () => {
    search = { id: 'room-1' };

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.host.isExpanded).toBe(true);
  });

  it('keeps the call collapsed when the url points at a different room', () => {
    search = { id: 'room-2' };

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.host.isExpanded).toBe(false);
  });

  it('keeps the call collapsed away from the room route', () => {
    pathname = '/lobby';
    search = { id: 'room-1' };

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.host.isExpanded).toBe(false);
  });

  it('clears the session and returns to the lobby when leaving from the room route', () => {
    search = { id: 'room-1' };

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();

    expect(result.current.session.session).toBeNull();
    expect(navigate).toHaveBeenCalledWith({ to: '/lobby', replace: true });
  });

  it('leaves without navigating when the user is already elsewhere', () => {
    pathname = '/lobby';

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();

    expect(result.current.session.session).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('lets a room left from the mini bar be joined again right away, as when calling back', () => {
    pathname = '/lobby';

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();
    act(() => result.current.session.open(sessionOf('room-1')));
    rerender();

    expect(result.current.session.session?.roomId).toBe('room-1');
  });

  it('ignores a leave from a room the user already switched away from', () => {
    search = { id: 'room-2' };

    const { result, rerender } = renderHost();

    act(() => result.current.session.open(sessionOf('room-2')));
    rerender();
    act(() => result.current.host.leave('room-1'));
    rerender();

    expect(result.current.session.session?.roomId).toBe('room-2');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('navigates back to the room when expanding', () => {
    pathname = '/lobby';

    const { result } = renderHost();

    act(() => result.current.host.expand('room-1'));

    expect(navigate).toHaveBeenCalledWith({ to: '/room', search: { id: 'room-1' } });
  });
});
