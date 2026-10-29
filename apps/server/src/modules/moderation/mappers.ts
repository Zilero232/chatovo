import type {
  AbuseReport as AbuseReportModel,
  AdminRoom,
  AdminUser,
  AdminUserMessage
} from '@chatovo/schemas';

import { toUserRole } from '@chatovo/schemas';

import type { AbuseReport, Prisma } from '../../../generated';

import { hasUserConnection } from '../realtime';

export const adminUserInclude = {
  profile: true,
  _count: { select: { rooms: true, messages: true } }
} satisfies Prisma.UserInclude;

export const adminRoomInclude = {
  owner: { select: { name: true } },
  _count: { select: { messages: true } }
} satisfies Prisma.RoomInclude;

type AdminUserRow = Prisma.UserGetPayload<{ include: typeof adminUserInclude }>;
type AdminRoomRow = Prisma.RoomGetPayload<{ include: typeof adminRoomInclude }>;

type ToAdminRoomInput = {
  room: AdminRoomRow;
  participants: number;
};

export const toAbuseReport = (report: AbuseReport): AbuseReportModel => ({
  id: report.id,
  target: report.target,
  targetId: report.targetId,
  reason: report.reason,
  comment: report.comment,
  roomId: report.roomId,
  roomName: null,
  reporter: null,
  reportedUser: null,
  reportedMessage: null,
  reporterId: report.reporterId,
  handled: report.handled,
  handledAt: report.handledAt?.toISOString() ?? null,
  createdAt: report.createdAt.toISOString()
});

export const toAdminUser = (user: AdminUserRow): AdminUser => ({
  id: user.id,
  name: user.name,
  displayName: user.profile?.displayName ?? null,
  email: user.email,
  friendTag: user.friendTag,
  avatarUrl: user.profile?.avatarUrl ?? null,
  bio: user.profile?.bio ?? null,
  profileUrl: user.profile?.profileUrl ?? null,
  role: toUserRole(user.role),
  verified: user.verified,
  developer: user.developer,
  emailVerified: user.emailVerified,
  blockedAt: user.bannedAt?.toISOString() ?? null,
  blockedReason: user.banReason,
  online: hasUserConnection(user.id),
  roomsCount: user._count.rooms,
  messagesCount: user._count.messages,
  reportsAgainst: 0,
  createdAt: user.createdAt.toISOString()
});

export const toAdminUserMessage = (
  message: Prisma.MessageGetPayload<{ include: { room: { select: { name: true } } } }>
): AdminUserMessage => ({
  id: message.id,
  body: message.deletedAt ? '' : message.body,
  roomId: message.roomId,
  roomName: message.room?.name ?? null,
  createdAt: message.createdAt.toISOString(),
  editedAt: message.editedAt?.toISOString() ?? null,
  deletedAt: message.deletedAt?.toISOString() ?? null
});

export const toAdminRoom = ({ room, participants }: ToAdminRoomInput): AdminRoom => ({
  id: room.id,
  name: room.name,
  kind: room.kind,
  isPrivate: room.isPrivate,
  hasPassword: Boolean(room.password),
  ownerId: room.ownerId,
  ownerName: room.owner?.name ?? null,
  messagesCount: room._count.messages,
  participants,
  createdAt: room.createdAt.toISOString()
});
