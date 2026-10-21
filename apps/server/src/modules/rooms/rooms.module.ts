import { Module } from '@nestjs/common';

import { RoomsController } from './rooms.controller';
import { RoomModerationService, RoomsService } from './services';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomModerationService]
})
export class RoomsModule {}
