import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateRoomDto, RoomBanListDto, RoomDto, UpdateRoomDto } from './dto/rooms.dto';
import { RoomModerationService, RoomsService } from './services';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly rooms: RoomsService,
    private readonly moderation: RoomModerationService
  ) {}

  @Get()
  @ZodResponse({ type: [RoomDto] })
  listRooms() {
    return this.rooms.listRooms();
  }

  @Get(':id')
  @ZodResponse({ type: RoomDto })
  getRoom(@Param('id') roomId: string, @CurrentUser() userId: string) {
    return this.rooms.getRoom({ roomId, userId });
  }

  @Post()
  @ZodResponse({ status: 201, type: RoomDto })
  createRoom(@Body() body: CreateRoomDto, @CurrentUser() userId: string) {
    return this.rooms.createRoom({ input: body, ownerId: userId });
  }

  @Patch(':id')
  @ZodResponse({ type: RoomDto })
  updateRoom(
    @Param('id') roomId: string,
    @Body() body: UpdateRoomDto,
    @CurrentUser() userId: string
  ) {
    return this.rooms.updateRoom({ roomId, input: body, userId });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteRoom(@Param('id') roomId: string, @CurrentUser() userId: string) {
    return this.rooms.deleteRoom({ roomId, userId });
  }

  @Get(':id/bans')
  @ZodResponse({ type: RoomBanListDto })
  listBans(@Param('id') roomId: string, @CurrentUser() userId: string) {
    return this.moderation.listBans({ roomId, userId });
  }

  @Delete(':id/bans/:userId')
  @HttpCode(204)
  unbanUser(
    @Param('id') roomId: string,
    @Param('userId') targetId: string,
    @CurrentUser() userId: string
  ) {
    return this.moderation.unbanUser({ roomId, userId, targetId });
  }

  @Post(':id/participants/:userId/remove')
  @HttpCode(204)
  removeParticipant(
    @Param('id') roomId: string,
    @Param('userId') targetId: string,
    @CurrentUser() userId: string
  ) {
    return this.moderation.removeParticipant({ roomId, userId, targetId });
  }

  @Post(':id/participants/:userId/ban')
  @HttpCode(204)
  banParticipant(
    @Param('id') roomId: string,
    @Param('userId') targetId: string,
    @CurrentUser() userId: string
  ) {
    return this.moderation.banParticipant({ roomId, userId, targetId });
  }

  @Post(':id/participants/:userId/mute')
  @HttpCode(204)
  muteParticipant(
    @Param('id') roomId: string,
    @Param('userId') targetId: string,
    @CurrentUser() userId: string
  ) {
    return this.moderation.muteParticipant({ roomId, userId, targetId });
  }

  @Post(':id/participants/:userId/unmute')
  @HttpCode(204)
  unmuteParticipant(
    @Param('id') roomId: string,
    @Param('userId') targetId: string,
    @CurrentUser() userId: string
  ) {
    return this.moderation.unmuteParticipant({ roomId, userId, targetId });
  }
}
