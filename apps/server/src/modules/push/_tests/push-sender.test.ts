import { beforeEach, describe, expect, it, vi } from 'vitest';

const findDevices = vi.fn();
const deleteDevices = vi.fn();
const sendPushToTokens = vi.fn();

vi.mock('../../../core', () => ({
  basePrisma: {
    pushDevice: {
      findMany: (...args: unknown[]) => findDevices(...args),
      deleteMany: (...args: unknown[]) => deleteDevices(...args)
    }
  }
}));

vi.mock('../../realtime', () => ({
  hasActiveUserConnection: () => true
}));

vi.mock('../firebase-client', () => ({
  sendPushToTokens: (payload: unknown) => sendPushToTokens(payload)
}));

const { sendIncomingCallPush, sendMissedCallPush } = await import('../push-sender');

const CALL = {
  callId: 'call-1',
  calleeId: 'bob',
  caller: { id: 'ann', name: 'Ann' },
  roomId: 'room-1'
};

describe('call pushes', () => {
  beforeEach(() => {
    findDevices.mockReset().mockResolvedValue([
      { token: 'phone-ru', locale: 'ru' },
      { token: 'tablet', locale: null }
    ]);
    deleteDevices.mockReset();
    sendPushToTokens.mockReset().mockResolvedValue([]);
  });

  it('rings every device in its own language, even while the app is open elsewhere', async () => {
    await sendIncomingCallPush(CALL);

    expect(sendPushToTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        tokens: ['phone-ru'],
        notification: { title: 'Ann', body: 'Входящий звонок' }
      })
    );
    expect(sendPushToTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        tokens: ['tablet'],
        notification: { title: 'Ann', body: 'Incoming call' }
      })
    );
  });

  it('tags the ring with the call and lets it lapse once the ring is over', async () => {
    await sendIncomingCallPush(CALL);

    expect(sendPushToTokens).toHaveBeenCalledWith(
      expect.objectContaining({ tag: 'call-1', ttlMs: 45_000, channelId: 'calls' })
    );
  });

  it('replaces the ringing notification with a missed call under the same tag', async () => {
    await sendMissedCallPush(CALL);

    expect(sendPushToTokens).toHaveBeenCalledWith(
      expect.objectContaining({
        tag: 'call-1',
        notification: { title: 'Ann', body: 'Пропущенный звонок' },
        data: expect.objectContaining({ type: 'missed_call', callerId: 'ann' })
      })
    );
  });
});
