import { badgeProgressListSchema, earnedBadgeListSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class BadgeProgressListDto extends createZodDto(badgeProgressListSchema) {}

export class EarnedBadgeListDto extends createZodDto(earnedBadgeListSchema) {}
