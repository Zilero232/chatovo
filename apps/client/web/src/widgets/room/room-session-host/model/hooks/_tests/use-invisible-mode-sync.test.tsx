import type { ReactNode } from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomSession } from '@/entities/room/session';

import { RoomSessionProvider, useRoomSession } from '@/entities/room/session';
import { ApiError } from '@/shared/api';

let invisibleMode = false;
let canBeInvisible = true;
let issuedToken: string | undefined = 'token-invisible';
let tokenError: ApiError | null = null;

const roomTokenCalls: { roomId: string | null; password?: string }[] = [];
const setGroup = vi.fn();
const toastError = vi.fn();

vi.mock('@/entities/app/settings', () => ({
  useAppSettings: () => ({ setGroup: (...args: unknown[]) => setGroup(...args) })
}));

vi.mock('@/entities/app/locale', () => ({
  useToastError: () => (id: string) => (error: unknown) => toastError(id, error)
}));

vi.mock('@/entities/room/room', () => ({
  useIsInvisible: () => canBeInvisible && invisibleMode,
  useRoomToken: (roomId: string | null, options: { password?: string }) => {
    roomTokenCalls.push({ roomId, ...options });

    const isRefused = roomId !== null && tokenError !== null && options.password !== 'right';

    return {
      data: roomId && !isRefused ? issuedToken : undefined,
      error: isRefused ? tokenError : null,
      isFetching: false,
      refetch: vi.fn()
    };
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
      const { passwordPrompt } = useInvisibleModeSync();

      return { ...useRoomSession(), passwordPrompt };
    },
    { wrapper }
  );

describe('useInvisibleModeSync', () => {
  beforeEach(() => {
    invisibleMode = false;
    canBeInvisible = true;
    issuedToken = 'token-invisible';
    tokenError = null;
    roomTokenCalls.length = 0;
    setGroup.mockReset();
    toastError.mockReset();
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
    canBeInvisible = false;
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

  it('asks for the password before showing someone who slipped into a private room invisibly', async () => {
    tokenError = new ApiError('ROOM_PASSWORD_REQUIRED', 'Password required', 403);
    invisibleMode = true;

    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf({ isPrivate: true, isInvisible: true })));

    invisibleMode = false;
    rerender();

    await waitFor(() => {
      expect(result.current.passwordPrompt).not.toBeNull();
    });

    expect(result.current.passwordPrompt?.isWrong).toBe(false);
    expect(result.current.session?.isInvisible).toBe(true);
  });

  it('reopens the session visibly once the right password is entered', async () => {
    tokenError = new ApiError('ROOM_PASSWORD_REQUIRED', 'Password required', 403);
    issuedToken = 'token-visible-new';
    invisibleMode = true;

    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf({ isPrivate: true, isInvisible: true })));

    invisibleMode = false;
    rerender();

    await waitFor(() => {
      expect(result.current.passwordPrompt).not.toBeNull();
    });

    act(() => result.current.passwordPrompt?.submit('right'));

    await waitFor(() => {
      expect(result.current.session?.isInvisible).toBe(false);
    });

    expect(result.current.session?.password).toBe('right');
    expect(result.current.passwordPrompt).toBeNull();
  });

  it('keeps the person invisible when they back out of the password prompt', async () => {
    tokenError = new ApiError('ROOM_PASSWORD_REQUIRED', 'Password required', 403);
    invisibleMode = true;

    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf({ isPrivate: true, isInvisible: true })));

    invisibleMode = false;
    rerender();

    await waitFor(() => {
      expect(result.current.passwordPrompt).not.toBeNull();
    });

    act(() => result.current.passwordPrompt?.cancel());

    expect(setGroup).toHaveBeenCalledWith('system', { invisibleMode: true });
  });

  it('explains any other refusal and puts the mode back as the session has it', async () => {
    tokenError = new ApiError('ROOM_BANNED', 'Banned', 403);

    const { result, rerender } = renderSync();

    act(() => result.current.open(sessionOf()));

    invisibleMode = true;
    rerender();

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('invisible-mode-switch', tokenError);
    });

    expect(setGroup).toHaveBeenCalledWith('system', { invisibleMode: false });
    expect(result.current.passwordPrompt).toBeNull();
  });
});
