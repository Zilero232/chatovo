import { Module } from '@nestjs/common';

import { FriendsController } from './friends.controller';
import { BlockService, DmRoomService, FriendCallService, FriendshipService } from './services';

@Module({
  controllers: [FriendsController],
  providers: [FriendshipService, BlockService, DmRoomService, FriendCallService],
  exports: [FriendshipService, BlockService, DmRoomService, FriendCallService]
})
export class FriendsModule {}
