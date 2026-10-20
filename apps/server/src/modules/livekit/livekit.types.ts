import type { RoomParticipant } from '@chatovo/schemas';
import type { ParticipantInfo } from 'livekit-server-sdk';

import type { Prisma } from '../../../generated';

export type IssueTokenInput = {
  isAdmin: boolean;
  invisible?: boolean;
  password?: string;
  roomId: string;
  userId: string;
};

export type ToRoomParticipantInput = {
  invisible: boolean;
  participant: ParticipantInfo;
};

export type FindRoomParticipantInput = {
  roomId: string;
  identity: string;
};

export type ParticipantPatch = Partial<Pick<RoomParticipant, 'activity' | 'deafened' | 'micMuted'>>;

export type LoadAccessibleRoomInput = {
  roomId: string;
  userId: string;
};

export type BuildAccessTokenInput = {
  isAdmin: boolean;
  isInvisible: boolean;
  roomId: string;
  user: Prisma.UserGetPayload<{ include: { profile: true } }>;
};
