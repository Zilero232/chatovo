import { beforeEach, describe, expect, it, vi } from 'vitest';

const receive = vi.fn();
const isBarredFromRoom = vi.fn();
const isMicLocked = vi.fn();
const clearRoomMicLocks = vi.fn();
const addParticipant = vi.fn();
const clearRoom = vi.fn();
const removeParticipant = vi.fn();
const removeRoomParticipant = vi.fn();
const setParticipantMicLock = vi.fn();
const emit = vi.fn();
const markDmRoom = vi.fn();
const getRoomLabel = vi.fn(async (_roomId: string) => ({
  name: 'evening',
  isDm: false,
  dmMemberIds: [] as string[]
}));

vi.mock('livekit-server-sdk', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  WebhookReceiver: class {
    receive(...args: unknown[]) {
      return receive(...args);
    }
  }
}));

vi.mock('../../../lib', () => ({
  isBarredFromRoom: (input: unknown) => isBarredFromRoom(input),
  isInvisibleParticipant: (metadata: string) => metadata === 'invisible'
}));

vi.mock('../../../mappers', () => ({
  toRoomParticipant: ({ participant }: { participant: { identity: string } }) => ({
    identity: participant.identity
  })
}));

vi.mock('../../../mic-lock-store', () => ({
  clearRoomMicLocks: (roomId: string) => clearRoomMicLocks(roomId),
  isMicLocked: (input: unknown) => isMicLocked(input)
}));

vi.mock('../../../presence', () => ({
  addParticipant: (...args: unknown[]) => addParticipant(...args),
  clearRoom: (roomId: string) => clearRoom(roomId),
  markDmRoom: (input: unknown) => markDmRoom(input),
  patchParticipant: vi.fn(),
  removeParticipant: (...args: unknown[]) => removeParticipant(...args),
  removeRoomParticipant: (input: unknown) => removeRoomParticipant(input),
  setParticipantMicLock: (input: unknown) => setParticipantMicLock(input),
  syncRoom: vi.fn()
}));

vi.mock('../../../../../lib', () => ({
  getRoomLabel: (roomId: string) => getRoomLabel(roomId)
}));

const { DomainEvent } = await import('../../../../../common/events/domain-events');
const { WebhookService } = await import('../webhook.service');

const ROOM_ID = 'room-1';

const config = { get: () => 'secret' };

const service = () => new WebhookService(config as never, { emit } as never);

const joined = (identity: string, metadata = '') => ({
  event: 'participant_joined',
  room: { name: ROOM_ID },
  participant: { identity, name: identity, metadata }
});

const deliver = async (event: unknown) => {
  receive.mockResolvedValueOnce(event);

  await service().handle({ body: '{}', authHeader: 'signed' });
};

describe('WebhookService participant_joined', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isBarredFromRoom.mockResolvedValue(false);
    isMicLocked.mockReturnValue(false);
    removeRoomParticipant.mockResolvedValue(undefined);
    setParticipantMicLock.mockResolvedValue(undefined);
  });

  it('adds a regular participant to presence and announces the join', async () => {
    await deliver(joined('guest-1'));

    expect(addParticipant).toHaveBeenCalledWith(ROOM_ID, { identity: 'guest-1' });
    expect(emit).toHaveBeenCalledWith(DomainEvent.VoiceJoined, {
      roomId: ROOM_ID,
      roomName: 'evening',
      isDm: false,
      participantId: 'guest-1',
      participantName: 'guest-1'
    });
    expect(removeRoomParticipant).not.toHaveBeenCalled();
  });

  it('throws out a participant joining with a token held from before a ban or a dm block', async () => {
    isBarredFromRoom.mockResolvedValueOnce(true);

    await deliver(joined('troll-1'));

    expect(isBarredFromRoom).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: 'troll-1' });
    expect(removeRoomParticipant).toHaveBeenCalledWith({ roomId: ROOM_ID, identity: 'troll-1' });
    expect(addParticipant).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it('re-applies the owner’s mic lock to a participant rejoining the same room', async () => {
    isMicLocked.mockReturnValueOnce(true);

    await deliver(joined('muted-1'));

    expect(isMicLocked).toHaveBeenCalledWith({ roomId: ROOM_ID, userId: 'muted-1' });
    expect(setParticipantMicLock).toHaveBeenCalledWith({
      roomId: ROOM_ID,
      identity: 'muted-1',
      locked: true
    });
  });

  it('leaves the permissions of a participant without a mic lock alone', async () => {
    await deliver(joined('guest-1'));

    expect(setParticipantMicLock).not.toHaveBeenCalled();
  });
});

describe('WebhookService participant_left', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('drops a participant from presence and announces the leave', async () => {
    await deliver({ ...joined('guest-1'), event: 'participant_left' });

    expect(removeParticipant).toHaveBeenCalledWith(ROOM_ID, 'guest-1');
    expect(emit).toHaveBeenCalledWith(DomainEvent.VoiceLeft, {
      roomId: ROOM_ID,
      isDm: false,
      participantId: 'guest-1'
    });
  });

  it('keeps an invisible admin’s leave silent', async () => {
    await deliver({ ...joined('admin-1', 'invisible'), event: 'participant_left' });

    expect(removeParticipant).toHaveBeenCalledWith(ROOM_ID, 'admin-1');
    expect(emit).not.toHaveBeenCalled();
  });
});

describe('WebhookService room_finished', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('drops the room’s mic locks once it empties', async () => {
    await deliver({ event: 'room_finished', room: { name: ROOM_ID } });

    expect(clearRoom).toHaveBeenCalledWith(ROOM_ID);
    expect(clearRoomMicLocks).toHaveBeenCalledWith(ROOM_ID);
  });

  it('announces the empty room with its id so the session message can be closed', async () => {
    await deliver({ event: 'room_finished', room: { name: ROOM_ID } });

    expect(emit).toHaveBeenCalledWith(DomainEvent.VoiceEmptied, {
      roomId: ROOM_ID,
      roomName: 'evening',
      isDm: false
    });
  });
});

describe('WebhookService DM rooms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isBarredFromRoom.mockResolvedValue(false);
    isMicLocked.mockReturnValue(false);
    getRoomLabel.mockResolvedValue({ name: 'dm-1', isDm: true, dmMemberIds: ['ann', 'bob'] });
  });

  it('marks a DM room as private to its two members before adding the joiner', async () => {
    await deliver(joined('ann'));

    expect(markDmRoom).toHaveBeenCalledWith({ roomId: ROOM_ID, memberIds: ['ann', 'bob'] });
    expect(markDmRoom.mock.invocationCallOrder[0]).toBeLessThan(
      addParticipant.mock.invocationCallOrder[0] ?? 0
    );
  });

  it('flags the leave from a DM room so the call can start its reconnect grace', async () => {
    await deliver({ ...joined('ann'), event: 'participant_left' });

    expect(emit).toHaveBeenCalledWith(DomainEvent.VoiceLeft, {
      roomId: ROOM_ID,
      isDm: true,
      participantId: 'ann'
    });
  });
});

describe('WebhookService signature check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tolerates a small clock skew between LiveKit and the API', async () => {
    const { WEBHOOK_CLOCK_TOLERANCE_SECONDS } = await import('../../../config');

    await deliver({ event: 'room_started' });

    expect(receive).toHaveBeenCalledWith('{}', 'signed', false, WEBHOOK_CLOCK_TOLERANCE_SECONDS);
  });
});
