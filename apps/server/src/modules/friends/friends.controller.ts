import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CallIdParamDto,
  DmCallViewDto,
  FriendListDto,
  FriendRequestListDto,
  IncomingFriendCallResponseDto,
  OutgoingFriendCallResponseDto,
  RoomDto,
  SendFriendRequestDto,
  UserBlockEntryDto,
  UserBlockListDto
} from './dto/friends.dto';
import { BlockService, DmRoomService, FriendCallService, FriendshipService } from './services';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendship: FriendshipService,
    private readonly blocks: BlockService,
    private readonly dmRoom: DmRoomService,
    private readonly calls: FriendCallService
  ) {}

  @Get()
  @ZodResponse({ type: FriendListDto })
  listFriends(@CurrentUser() userId: string) {
    return this.friendship.listFriends(userId);
  }

  @Get('requests/incoming')
  @ZodResponse({ type: FriendRequestListDto })
  listIncomingRequests(@CurrentUser() userId: string) {
    return this.friendship.listIncomingRequests(userId);
  }

  @Get('relations/:userId')
  getRelation(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.friendship.getFriendshipRelation({ userId, otherUserId });
  }

  @Get('blocks')
  @ZodResponse({ type: UserBlockListDto })
  listBlockedUsers(@CurrentUser() userId: string) {
    return this.blocks.listBlockedUsers(userId);
  }

  @Post('blocks/:userId')
  @ZodResponse({ type: UserBlockEntryDto })
  blockUser(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.blocks.blockUser({ userId, otherUserId });
  }

  @Delete('blocks/:userId')
  @HttpCode(204)
  unblockUser(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.blocks.unblockUser({ userId, otherUserId });
  }

  @Post('requests')
  sendRequest(@Body() body: SendFriendRequestDto, @CurrentUser() userId: string) {
    return this.friendship.sendFriendRequest({ requesterId: userId, tag: body.tag });
  }

  @Post('requests/:id/accept')
  acceptRequest(@Param('id') friendshipId: string, @CurrentUser() userId: string) {
    return this.friendship.acceptFriendRequest({ userId, friendshipId });
  }

  @Post('requests/:id/decline')
  @HttpCode(204)
  declineRequest(@Param('id') friendshipId: string, @CurrentUser() userId: string) {
    return this.friendship.declineFriendRequest({ userId, friendshipId });
  }

  @Delete(':userId')
  @HttpCode(204)
  removeFriendship(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.friendship.removeFriendship({ userId, otherUserId });
  }

  @Post(':userId/dm-room')
  @ZodResponse({ type: RoomDto })
  getOrCreateDmRoom(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.dmRoom.getOrCreateDmRoom({ userId, otherUserId });
  }

  @Post(':userId/calls')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ZodResponse({ type: DmCallViewDto })
  startCall(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.calls.startCall({ userId, otherUserId });
  }

  @Post(':userId/call')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ZodResponse({ type: RoomDto })
  ringCall(@Param('userId') otherUserId: string, @CurrentUser() userId: string) {
    return this.calls.ringFriendCall({ userId, otherUserId });
  }

  @Post('calls/:callId/accept')
  @ZodResponse({ type: DmCallViewDto })
  acceptCall(@Param() { callId }: CallIdParamDto, @CurrentUser() userId: string) {
    return this.calls.acceptCall({ callId, userId });
  }

  @Post('calls/:callId/decline')
  @HttpCode(204)
  declineCall(@Param() { callId }: CallIdParamDto, @CurrentUser() userId: string) {
    return this.calls.declineCall({ callId, userId });
  }

  @Post('calls/:callId/cancel')
  @HttpCode(204)
  cancelCall(@Param() { callId }: CallIdParamDto, @CurrentUser() userId: string) {
    return this.calls.cancelCall({ callId, userId });
  }

  @Post('calls/:callId/hangup')
  @HttpCode(204)
  hangupCall(@Param() { callId }: CallIdParamDto, @CurrentUser() userId: string) {
    return this.calls.hangupCall({ callId, userId });
  }

  @Get('calls/incoming')
  @ZodResponse({ type: IncomingFriendCallResponseDto })
  getIncomingCall(@CurrentUser() userId: string) {
    return this.calls.getIncomingFriendCall(userId);
  }

  @Post('calls/accept')
  acceptIncomingCall(@CurrentUser() userId: string) {
    return this.calls.acceptIncomingFriendCall(userId);
  }

  @Post('calls/decline')
  @HttpCode(204)
  declineIncomingCall(@CurrentUser() userId: string) {
    return this.calls.declineIncomingFriendCall(userId);
  }

  @Post('calls/cancel')
  @HttpCode(204)
  cancelOutgoingCall(@CurrentUser() userId: string) {
    return this.calls.cancelOutgoingFriendCall(userId);
  }

  @Get('calls/outgoing')
  @ZodResponse({ type: OutgoingFriendCallResponseDto })
  getOutgoingCall(@CurrentUser() userId: string) {
    return this.calls.getOutgoingFriendCall(userId);
  }

  @Post('calls/ack')
  @HttpCode(204)
  ackOutgoingCall(@CurrentUser() userId: string) {
    return this.calls.ackOutgoingFriendCall(userId);
  }
}
