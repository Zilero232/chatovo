import type { RoomParticipant, UserRole } from '@chatovo/schemas';
import type { ParticipantInfo } from 'livekit-server-sdk';

import type { Prisma } from '../../../generated';

export type IssueTokenInput = {
  invisible?: boolean;
  password?: string;
  roomId: string;
  userId: string;
};

export type ToRoomParticipantInput = {
  invisible: boolean;
  participant: ParticipantInfo;
};

export type MarkDmRoomInput = {
  memberIds: string[];
  roomId: string;
};

export type FindRoomParticipantInput = {
  roomId: string;
  identity: string;
};

export type RemoveRoomParticipantInput = {
  roomId: string;
  identity: string;
};

export type SetParticipantMicLockInput = {
  roomId: string;
  identity: string;
  locked: boolean;
};

export type RevokeRoomGrantInput = {
  roomId: string;
  userId: string;
};

export type GrantRoomAccessInput = {
  isHidden?: boolean;
  roomId: string;
  userId: string;
};

export type MicLockInput = {
  roomId: string;
  userId: string;
};

export type ParticipantPatch = Partial<Pick<RoomParticipant, 'activity' | 'deafened' | 'micMuted'>>;

export type LoadAccessibleRoomInput = {
  roomId: string;
  userId: string;
};

export type BuildAccessTokenInput = {
  isInvisible: boolean;
  role: UserRole;
  roomId: string;
  user: Prisma.UserGetPayload<{ include: { profile: true } }>;
};
