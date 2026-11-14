import type { z } from 'zod';

import type {
  abuseReasonSchema,
  abuseTargetSchema,
  adminReportQuerySchema,
  adminRoomQuerySchema,
  adminUserFilterSchema,
  adminUserMessageQuerySchema,
  adminUserQuerySchema,
  blockUserSchema,
  reportAbuseSchema,
  updateAdminUserSchema
} from './inputs';
import type {
  abuseReportListSchema,
  abuseReportSchema,
  adminRoomListSchema,
  adminRoomMessageListSchema,
  adminRoomMessageSchema,
  adminRoomSchema,
  adminStatsSchema,
  adminUserDetailsSchema,
  adminUserListSchema,
  adminUserMessageListSchema,
  adminUserMessageSchema,
  adminUserSchema,
  blockedUserListSchema,
  blockedUserSchema
} from './outputs';

export type AbuseReason = z.infer<typeof abuseReasonSchema>;
export type AbuseTarget = z.infer<typeof abuseTargetSchema>;

export type ReportAbuseValues = z.infer<typeof reportAbuseSchema>;
/** Form shape before validation — an untouched comment field is still a string. */
export type ReportAbuseFormValues = z.input<typeof reportAbuseSchema>;
export type BlockUserValues = z.infer<typeof blockUserSchema>;

export type AbuseReport = z.infer<typeof abuseReportSchema>;
export type AbuseReportList = z.infer<typeof abuseReportListSchema>;

export type BlockedUser = z.infer<typeof blockedUserSchema>;
export type BlockedUserList = z.infer<typeof blockedUserListSchema>;

export type AdminUser = z.infer<typeof adminUserSchema>;
export type AdminUserList = z.infer<typeof adminUserListSchema>;
export type AdminUserFilter = z.infer<typeof adminUserFilterSchema>;
export type AdminUserQuery = z.infer<typeof adminUserQuerySchema>;
export type UpdateAdminUserValues = z.infer<typeof updateAdminUserSchema>;

export type AdminRoom = z.infer<typeof adminRoomSchema>;
export type AdminRoomList = z.infer<typeof adminRoomListSchema>;
export type AdminRoomQuery = z.infer<typeof adminRoomQuerySchema>;
export type AdminRoomMessage = z.infer<typeof adminRoomMessageSchema>;
export type AdminRoomMessageList = z.infer<typeof adminRoomMessageListSchema>;

export type AdminReportQuery = z.infer<typeof adminReportQuerySchema>;

export type AdminStats = z.infer<typeof adminStatsSchema>;

export type AdminUserDetails = z.infer<typeof adminUserDetailsSchema>;
export type AdminUserMessage = z.infer<typeof adminUserMessageSchema>;
export type AdminUserMessageList = z.infer<typeof adminUserMessageListSchema>;
export type AdminUserMessageQuery = z.infer<typeof adminUserMessageQuerySchema>;
