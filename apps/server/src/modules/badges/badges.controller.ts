import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BadgeProgressListDto, EarnedBadgeListDto } from './dto/badges.dto';
import { BadgesService } from './services';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badges: BadgesService) {}

  @Get('me')
  @ZodResponse({ type: BadgeProgressListDto })
  getMyProgress(@CurrentUser() userId: string) {
    return this.badges.getProgress(userId);
  }

  @Get(':userId')
  @ZodResponse({ type: EarnedBadgeListDto })
  getEarned(@Param('userId') userId: string) {
    return this.badges.getEarned(userId);
  }
}
