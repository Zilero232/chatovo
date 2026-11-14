import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZodResponse } from 'nestjs-zod';

import { AdminOnly } from '../../common/decorators/admin-only';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ABUSE_REPORT_RATE_LIMIT } from './config';
import {
  AbuseReportDto,
  AbuseReportListDto,
  AdminReportQueryDto,
  AdminRoomListDto,
  AdminRoomMessageListDto,
  AdminRoomQueryDto,
  AdminStatsDto,
  AdminUserDetailsDto,
  AdminUserDto,
  AdminUserListDto,
  AdminUserMessageListDto,
  AdminUserMessageQueryDto,
  AdminUserQueryDto,
  BlockedUserListDto,
  BlockUserDto,
  OkResultDto,
  ReportAbuseDto,
  UpdateAdminUserDto
} from './dto/moderation.dto';
import {
  AbuseReportService,
  AdminRoomService,
  AdminStatsService,
  AdminUserService,
  UserBlockService
} from './services';

@ApiTags('moderation')
@Controller('moderation')
export class ModerationController {
  constructor(
    private readonly reports: AbuseReportService,
    private readonly blocks: UserBlockService,
    private readonly users: AdminUserService,
    private readonly rooms: AdminRoomService,
    private readonly stats: AdminStatsService
  ) {}

  @Post('reports')
  @HttpCode(200)
  @Throttle({ default: ABUSE_REPORT_RATE_LIMIT })
  @ZodResponse({ type: AbuseReportDto })
  async report(@Body() body: ReportAbuseDto, @CurrentUser() userId: string) {
    return this.reports.report({ input: body, reporterId: userId });
  }

  @Get('reports')
  @AdminOnly()
  @ZodResponse({ type: AbuseReportListDto })
  async listReports(@Query() query: AdminReportQueryDto) {
    return this.reports.list(query);
  }

  @Post('reports/:reportId/resolve')
  @AdminOnly()
  @HttpCode(200)
  @ZodResponse({ type: AbuseReportDto })
  async resolveReport(@Param('reportId') reportId: string, @CurrentUser() userId: string) {
    return this.reports.resolve({ reportId, adminId: userId });
  }

  @Get('stats')
  @AdminOnly()
  @ZodResponse({ type: AdminStatsDto })
  async readStats() {
    return this.stats.read();
  }

  @Get('users')
  @AdminOnly()
  @ZodResponse({ type: AdminUserListDto })
  async listUsers(@Query() query: AdminUserQueryDto) {
    return this.users.list(query);
  }

  @Get('users/:targetId')
  @AdminOnly()
  @ZodResponse({ type: AdminUserDto })
  async getUser(@Param('targetId') targetId: string) {
    return this.users.get(targetId);
  }

  @Get('users/:targetId/details')
  @AdminOnly()
  @ZodResponse({ type: AdminUserDetailsDto })
  async getUserDetails(@Param('targetId') targetId: string) {
    return this.users.details(targetId);
  }

  @Get('users/:targetId/messages')
  @AdminOnly()
  @ZodResponse({ type: AdminUserMessageListDto })
  async getUserMessages(
    @Param('targetId') targetId: string,
    @Query() query: AdminUserMessageQueryDto
  ) {
    return this.users.messages({ userId: targetId, query });
  }

  @Patch('users/:targetId')
  @AdminOnly()
  @ZodResponse({ type: AdminUserDto })
  async updateUser(
    @Param('targetId') targetId: string,
    @Body() body: UpdateAdminUserDto,
    @CurrentUser() userId: string
  ) {
    return this.users.update({ adminId: userId, userId: targetId, input: body });
  }

  @Get('rooms')
  @AdminOnly()
  @ZodResponse({ type: AdminRoomListDto })
  async listRooms(@Query() query: AdminRoomQueryDto) {
    return this.rooms.list(query);
  }

  @Get('rooms/:roomId/messages')
  @AdminOnly()
  @ZodResponse({ type: AdminRoomMessageListDto })
  async getRoomMessages(@Param('roomId') roomId: string, @Query() query: AdminUserMessageQueryDto) {
    return this.rooms.messages({ roomId, query });
  }

  @Delete('rooms/:roomId')
  @AdminOnly()
  @HttpCode(200)
  @ZodResponse({ type: OkResultDto })
  async deleteRoom(@Param('roomId') roomId: string) {
    await this.rooms.remove(roomId);

    return { ok: true };
  }

  @Get('blocks')
  @AdminOnly()
  @ZodResponse({ type: BlockedUserListDto })
  async listBlocked() {
    return this.blocks.list();
  }

  @Post('blocks/:targetId')
  @AdminOnly()
  @HttpCode(200)
  @ZodResponse({ type: AdminUserDto })
  async block(
    @Param('targetId') targetId: string,
    @Body() body: BlockUserDto,
    @CurrentUser() userId: string
  ) {
    return this.blocks.block({ userId: targetId, adminId: userId, input: body });
  }

  @Post('blocks/:targetId/remove')
  @AdminOnly()
  @HttpCode(200)
  @ZodResponse({ type: AdminUserDto })
  async unblock(@Param('targetId') targetId: string) {
    return this.blocks.unblock({ userId: targetId });
  }
}
