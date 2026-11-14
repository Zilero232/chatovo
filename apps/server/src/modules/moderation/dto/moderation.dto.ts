import {
  abuseReportListSchema,
  abuseReportSchema,
  adminReportQuerySchema,
  adminRoomListSchema,
  adminRoomMessageListSchema,
  adminRoomQuerySchema,
  adminStatsSchema,
  adminUserDetailsSchema,
  adminUserListSchema,
  adminUserMessageListSchema,
  adminUserMessageQuerySchema,
  adminUserQuerySchema,
  adminUserSchema,
  blockedUserListSchema,
  blockUserSchema,
  reportAbuseSchema,
  updateAdminUserSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const okSchema = z.object({ ok: z.boolean() });

export class ReportAbuseDto extends createZodDto(reportAbuseSchema) {}

export class BlockUserDto extends createZodDto(blockUserSchema) {}

export class OkResultDto extends createZodDto(okSchema) {}

export class AbuseReportDto extends createZodDto(abuseReportSchema) {}

export class AbuseReportListDto extends createZodDto(abuseReportListSchema) {}

export class BlockedUserListDto extends createZodDto(blockedUserListSchema) {}

export class AdminReportQueryDto extends createZodDto(adminReportQuerySchema) {}

export class AdminUserQueryDto extends createZodDto(adminUserQuerySchema) {}

export class AdminUserDto extends createZodDto(adminUserSchema) {}

export class AdminUserListDto extends createZodDto(adminUserListSchema) {}

export class UpdateAdminUserDto extends createZodDto(updateAdminUserSchema) {}

export class AdminRoomQueryDto extends createZodDto(adminRoomQuerySchema) {}

export class AdminRoomListDto extends createZodDto(adminRoomListSchema) {}

export class AdminStatsDto extends createZodDto(adminStatsSchema) {}

export class AdminUserDetailsDto extends createZodDto(adminUserDetailsSchema) {}

export class AdminUserMessageQueryDto extends createZodDto(adminUserMessageQuerySchema) {}

export class AdminUserMessageListDto extends createZodDto(adminUserMessageListSchema) {}

export class AdminRoomMessageListDto extends createZodDto(adminRoomMessageListSchema) {}
