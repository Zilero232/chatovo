import type {
  AbuseTarget,
  AdminUserMessageQuery,
  BlockUserValues,
  ReportAbuseValues,
  UpdateAdminUserValues
} from '@chatovo/schemas';

import type { Prisma } from '../../../generated';

export type ReportAbuseInput = {
  input: ReportAbuseValues;
  reporterId: string;
};

export type BlockUserInput = {
  adminId: string;
  input: BlockUserValues;
  userId: string;
};

export type UnblockUserInput = {
  userId: string;
};

export type ResolveReportInput = {
  adminId: string;
  reportId: string;
};

export type ReportAbuseTarget = {
  target: AbuseTarget;
  targetId: string;
  reporterId: string;
};

export type ListOnlineUsersInput = {
  where: Prisma.UserWhereInput;
  page: number;
  perPage: number;
};

export type ListUserMessagesInput = {
  userId: string;
  query: AdminUserMessageQuery;
};

export type ListRoomMessagesInput = {
  roomId: string;
  query: AdminUserMessageQuery;
};

export type UpdateAdminUserInput = {
  adminId: string;
  userId: string;
  input: UpdateAdminUserValues;
};
