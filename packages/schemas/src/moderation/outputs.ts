import { z } from 'zod';

import { USER_ROLE, userRoleSchema } from '../auth/inputs';
import { abuseReasonSchema, abuseTargetSchema } from './inputs';

const actorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string()
});

export const abuseReportSchema = z.object({
  id: z.string(),
  target: abuseTargetSchema,
  targetId: z.string(),
  reason: abuseReasonSchema,
  comment: z.string().nullable().default(null),
  roomId: z.string().nullable().default(null),
  roomName: z.string().nullable().default(null),
  reporter: actorSchema.nullable().default(null),
  reportedUser: actorSchema.nullable().default(null),
  reportedMessage: z.string().nullable().default(null),
  reporterId: z.string(),
  handled: z.boolean().default(false),
  handledAt: z.string().nullable().default(null),
  createdAt: z.string()
});

export const abuseReportListSchema = z.array(abuseReportSchema);

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string().nullable().default(null),
  email: z.string(),
  friendTag: z.string(),
  avatarUrl: z.string().nullable().default(null),
  bio: z.string().nullable().default(null),
  profileUrl: z.string().nullable().default(null),
  role: userRoleSchema.catch(USER_ROLE.user),
  verified: z.boolean().default(false),
  developer: z.boolean().default(false),
  emailVerified: z.boolean().default(false),
  blockedAt: z.string().nullable().default(null),
  blockedReason: z.string().nullable().default(null),
  online: z.boolean().default(false),
  roomsCount: z.number().default(0),
  messagesCount: z.number().default(0),
  reportsAgainst: z.number().default(0),
  createdAt: z.string()
});

export const adminUserListSchema = z.object({
  items: z.array(adminUserSchema),
  total: z.number()
});

/** Kept as the shape of a block action's result — the admin list is richer. */
export const blockedUserSchema = adminUserSchema;
export const blockedUserListSchema = z.array(adminUserSchema);

export const adminRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),
  isPrivate: z.boolean().default(false),
  hasPassword: z.boolean().default(false),
  ownerId: z.string(),
  ownerName: z.string().nullable().default(null),
  messagesCount: z.number().default(0),
  participants: z.number().default(0),
  createdAt: z.string()
});

export const adminRoomListSchema = z.object({
  items: z.array(adminRoomSchema),
  total: z.number()
});

const seriesPointSchema = z.object({
  date: z.string(),
  count: z.number()
});

export const adminStatsSchema = z.object({
  users: z.object({
    total: z.number(),
    online: z.number(),
    blocked: z.number(),
    staff: z.number(),
    newToday: z.number(),
    newThisWeek: z.number()
  }),
  rooms: z.object({
    total: z.number(),
    group: z.number(),
    dm: z.number(),
    private: z.number(),
    liveNow: z.number()
  }),
  messages: z.object({
    total: z.number(),
    today: z.number(),
    thisWeek: z.number()
  }),
  reports: z.object({
    pending: z.number(),
    handled: z.number()
  }),
  signups: z.array(seriesPointSchema),
  messagesSeries: z.array(seriesPointSchema)
});

export const adminUserMessageSchema = z.object({
  id: z.string(),
  body: z.string(),
  roomId: z.string(),
  roomName: z.string().nullable().default(null),
  createdAt: z.string(),
  editedAt: z.string().nullable().default(null),
  deletedAt: z.string().nullable().default(null)
});

export const adminUserMessageListSchema = z.object({
  items: z.array(adminUserMessageSchema),
  total: z.number()
});

const userRoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),
  createdAt: z.string()
});

export const adminUserDetailsSchema = z.object({
  user: adminUserSchema,
  ownedRooms: z.array(userRoomSchema),
  reportsAgainst: z.array(abuseReportSchema),
  reportsFiled: z.number(),
  sessions: z.number(),
  lastMessageAt: z.string().nullable().default(null)
});
