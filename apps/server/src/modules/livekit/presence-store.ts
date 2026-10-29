import type { RoomParticipant, RoomsParticipantsSnapshot } from '@chatovo/schemas';

import { isDefined, pickBy } from 'remeda';

import type { DmRoomPresence, PresenceSnapshots } from '../realtime';
import type { FindRoomParticipantInput, MarkDmRoomInput, ParticipantPatch } from './livekit.types';

import { emitPresenceSnapshot } from '../realtime';

const rooms = new Map<string, Map<string, RoomParticipant>>();
const dmMembersByRoom = new Map<string, string[]>();

// Lobby presence: per-user connection counter. A user opens N tabs → counter
// goes to N; closing N-1 keeps them online; closing the last evicts them.
const lobbyConnections = new Map<string, number>();

const buildSnapshot = (includeInvisible: boolean): RoomsParticipantsSnapshot => {
  const result: RoomsParticipantsSnapshot['rooms'] = {};

  for (const [roomId, participants] of rooms) {
    if (dmMembersByRoom.has(roomId)) {
      continue;
    }

    const visible = includeInvisible
      ? [...participants.values()]
      : [...participants.values()].filter((participant) => !participant.invisible);

    if (visible.length > 0) {
      result[roomId] = visible;
    }
  }

  return { rooms: result, lobbyOnline: lobbyConnections.size };
};

const buildDmRooms = (): DmRoomPresence[] =>
  [...dmMembersByRoom].flatMap(([roomId, memberIds]) => {
    const participants = rooms.get(roomId);

    return participants ? [{ roomId, memberIds, participants: [...participants.values()] }] : [];
  });

export const getPresenceSnapshots = (): PresenceSnapshots => ({
  public: buildSnapshot(false),
  admin: buildSnapshot(true),
  dmRooms: buildDmRooms()
});

const emit = () => {
  emitPresenceSnapshot(getPresenceSnapshots());
};

export const markDmRoom = ({ roomId, memberIds }: MarkDmRoomInput) => {
  dmMembersByRoom.set(roomId, memberIds);
};

export const getSnapshot = () => buildSnapshot(false);

export const getAdminSnapshot = () => buildSnapshot(true);

export const findRoomParticipant = ({
  roomId,
  identity
}: FindRoomParticipantInput): RoomParticipant | null => rooms.get(roomId)?.get(identity) ?? null;

export const hasRoomParticipants = (roomId: string): boolean => rooms.has(roomId);

export const addLobbyConnection = (userId: string) => {
  const current = lobbyConnections.get(userId) ?? 0;
  const isNewUser = current === 0;

  lobbyConnections.set(userId, current + 1);

  if (isNewUser) {
    emit();
  }
};

export const removeLobbyConnection = (userId: string) => {
  const current = lobbyConnections.get(userId);

  if (!current) {
    return;
  }

  if (current <= 1) {
    lobbyConnections.delete(userId);
    emit();

    return;
  }

  lobbyConnections.set(userId, current - 1);
};

export const addParticipant = (roomId: string, participant: RoomParticipant) => {
  let participants = rooms.get(roomId);

  if (!participants) {
    participants = new Map();
    rooms.set(roomId, participants);
  }

  participants.set(participant.identity, participant);

  emit();
};

// Partial presence update (mic, deafen, ...) — both webhooks and client
// reports flow through here. Only emits when a field actually changes.
export const patchParticipant = (roomId: string, identity: string, patch: ParticipantPatch) => {
  const participants = rooms.get(roomId);
  const current = participants?.get(identity);

  if (!participants || !current) {
    return;
  }

  const next = { ...current, ...pickBy(patch, isDefined) };

  if (
    next.micMuted === current.micMuted &&
    next.deafened === current.deafened &&
    next.activity === current.activity
  ) {
    return;
  }

  participants.set(identity, next);

  emit();
};

export const removeParticipant = (roomId: string, identity: string) => {
  const participants = rooms.get(roomId);

  if (!participants) {
    return;
  }

  participants.delete(identity);

  if (participants.size === 0) {
    rooms.delete(roomId);
    dmMembersByRoom.delete(roomId);
  }

  emit();
};

export const clearRoom = (roomId: string) => {
  dmMembersByRoom.delete(roomId);

  if (rooms.delete(roomId)) {
    emit();
  }
};

// Replaces a room's participants wholesale — used by the LiveKit reconcile path.
export const replaceRoom = (roomId: string, participants: Map<string, RoomParticipant>) => {
  if (participants.size > 0) {
    rooms.set(roomId, participants);
  } else {
    rooms.delete(roomId);
  }

  emit();
};
