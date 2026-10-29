import type { DmCallView } from '@chatovo/schemas';
import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RoomSession } from '@/entities/room/session';

import { RoomSessionProvider, useRoomSession } from '@/entities/room/session';

const ENDED_VISIBLE_MS = 4000;

let current: DmCallView | null = null;

const playTone = vi.fn();
const toastInfo = vi.fn();
const leave = vi.fn();

vi.mock('sonner', () => ({
  toast: { info: (...args: unknown[]) => toastInfo(...args) }
}));

vi.mock('@/entities/social/dm-call', () => ({
  DM_CALL_TIMING: { endedVisibleMs: ENDED_VISIBLE_MS },
  resolveCallOutcome: ({ endReason }: DmCallView) => (endReason === 'busy' ? 'busy' : 'ended'),
  useCallOutcomeText: () => (call: DmCallView) => `ended:${call.id}`,
  useCallTone: () => playTone,
  useDmCalls: () => ({ current, incoming: null })
}));

const { useDmCallSessionSync } = await import('../use-dm-call-session-sync');

const wrapper = ({ children }: { children: ReactNode }) => (
  <RoomSessionProvider>{children}</RoomSessionProvider>
);

const dmSession: RoomSession = {
  roomId: 'dm-room',
  roomName: 'Anna',
  token: 'token',
  isChatOpen: false,
  isDm: true,
  isPrivate: false,
  isInvisible: false
};

const callOf = (overrides: Partial<DmCallView> = {}): DmCallView => ({
  id: '11111111-1111-4111-8111-111111111111',
  roomId: 'dm-room',
  direction: 'outgoing',
  peer: { id: 'anna', name: 'Anna', avatarUrl: null } as DmCallView['peer'],
  state: 'active',
  startedAt: '2026-10-29T10:00:00.000Z',
  ringEndsAt: null,
  answeredAt: '2026-10-29T10:00:05.000Z',
  endedAt: null,
  endReason: null,
  calleeReachable: true,
  peerBusy: false,
  peerInCall: true,
  selfInCall: true,
  peerGraceEndsAt: null,
  ...overrides
});

const renderSync = () =>
  renderHook(
    () => {
      const { isCallEnding } = useDmCallSessionSync(leave);

      return { ...useRoomSession(), isCallEnding };
    },
    { wrapper }
  );

describe('useDmCallSessionSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    current = null;
    playTone.mockReset();
    toastInfo.mockReset();
    leave.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays the end tone, explains the outcome and closes the call a few seconds later', () => {
    current = callOf();

    const { result, rerender } = renderSync();

    act(() => result.current.open(dmSession));

    current = callOf({
      state: 'ended',
      endReason: 'completed',
      endedAt: '2026-10-29T10:01:05.000Z'
    });
    rerender();

    expect(playTone).toHaveBeenCalledWith('ended');
    expect(toastInfo).toHaveBeenCalledWith(`ended:${current.id}`, expect.anything());
    expect(leave).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(ENDED_VISIBLE_MS));

    expect(leave).toHaveBeenCalledWith('dm-room');
  });

  it('plays the busy tone when the peer was on another call', () => {
    current = callOf({ state: 'ringing', answeredAt: null });

    const { result, rerender } = renderSync();

    act(() => result.current.open(dmSession));

    current = callOf({ state: 'ended', endReason: 'busy' });
    rerender();

    expect(playTone).toHaveBeenCalledWith('busy');
  });

  it('still tells the outcome after the person already hung up themselves', () => {
    current = callOf();

    const { result, rerender } = renderSync();

    act(() => result.current.open(dmSession));
    act(() => result.current.close('dm-room', { guardRejoin: false }));

    current = callOf({ state: 'ended', endReason: 'completed' });
    rerender();

    expect(toastInfo).toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(ENDED_VISIBLE_MS));

    expect(leave).not.toHaveBeenCalled();
  });

  it('closes a DM session whose call vanished without an end state', () => {
    current = callOf();

    const { result, rerender } = renderSync();

    act(() => result.current.open(dmSession));
    rerender();

    current = null;
    rerender();

    expect(leave).toHaveBeenCalledWith('dm-room');
  });

  it('leaves a DM room joined without any call alone', () => {
    const { result, rerender } = renderSync();

    act(() => result.current.open(dmSession));
    rerender();

    expect(leave).not.toHaveBeenCalled();
    expect(toastInfo).not.toHaveBeenCalled();
  });

  it('treats the server closing the room of an ended call as the end, not a dropped connection', () => {
    current = callOf();

    const { result, rerender } = renderSync();

    act(() => result.current.open(dmSession));

    expect(result.current.isCallEnding('dm-room')).toBe(false);

    current = callOf({ state: 'ended', endReason: 'completed' });
    rerender();

    expect(result.current.isCallEnding('dm-room')).toBe(true);
    expect(result.current.isCallEnding('other-room')).toBe(false);
  });
});
