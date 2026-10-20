import type { ParticipantMetadata, RoomParticipant } from '@chatovo/schemas';
import type { TrackInfo } from 'livekit-server-sdk';

import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';
import { Logger } from '@nestjs/common';
import { RoomServiceClient, TrackSource } from 'livekit-server-sdk';

import { isInvisibleParticipant } from './lib';
import { toRoomParticipant } from './mappers';
import { replaceRoom } from './presence-store';

export {
  addLobbyConnection,
  addParticipant,
  clearRoom,
  findRoomParticipant,
  getAdminSnapshot,
  getSnapshot,
  hasRoomParticipants,
  patchParticipant,
  removeLobbyConnection,
  removeParticipant
} from './presence-store';

type LivekitCredentials = {
  url: string;
  apiKey: string;
  apiSecret: string;
};

let credentials: LivekitCredentials | null = null;
let client: RoomServiceClient | null = null;

export const bindLivekitCredentials = (next: LivekitCredentials): void => {
  credentials = next;
  client = null;
};

const roomServiceClient = (): RoomServiceClient => {
  if (!credentials) {
    throw new Error('LiveKit credentials are not bound');
  }

  client ??= new RoomServiceClient(credentials.url, credentials.apiKey, credentials.apiSecret);

  return client;
};

const logger = new Logger('LivekitPresence');

const isRoomNotFound = (error: unknown): boolean => {
  const status = (error as { status?: number }).status;
  const code = (error as { code?: string }).code;

  return status === 404 || code === 'not_found';
};

export const parseParticipantMeta = (metadata: string | undefined): ParticipantMetadata => {
  const parsed = participantMetadataSchema.safeParse(safeJsonParse(metadata));

  return parsed.success ? parsed.data : participantMetadataSchema.parse({});
};

export const isMicMuted = (tracks: TrackInfo[] | undefined): boolean => {
  const mic = tracks?.find((track) => track.source === TrackSource.MICROPHONE);

  return !mic || mic.muted;
};

export const syncRoom = async (roomId: string) => {
  try {
    const live = await roomServiceClient().listParticipants(roomId);
    const participants = new Map<string, RoomParticipant>(
      live.map((participant) => [
        participant.identity,
        toRoomParticipant({
          participant,
          invisible:
            Boolean(participant.permission?.hidden) || isInvisibleParticipant(participant.metadata)
        })
      ])
    );

    replaceRoom(roomId, participants);
  } catch (error) {
    if (isRoomNotFound(error)) {
      replaceRoom(roomId, new Map());

      return;
    }

    logger.warn(`Failed to sync presence for room ${roomId}: ${String(error)}`);
  }
};

export const closeLivekitRoom = async (roomId: string): Promise<void> => {
  try {
    await roomServiceClient().deleteRoom(roomId);
  } catch (error) {
    if (isRoomNotFound(error)) {
      return;
    }

    const reason = error instanceof Error ? error.message : 'unknown error';

    logger.warn(`Failed to close room ${roomId}: ${reason}`);
  } finally {
    replaceRoom(roomId, new Map());
  }
};

export const ejectParticipantEverywhere = async (identity: string): Promise<void> => {
  try {
    const service = roomServiceClient();
    const rooms = await service.listRooms();

    await Promise.allSettled(rooms.map((room) => service.removeParticipant(room.name, identity)));
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    logger.warn(`Failed to eject ${identity}: ${reason}`);
  }
};
