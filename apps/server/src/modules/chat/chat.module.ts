import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { CallLogListener } from './listeners';
import { ChatAttachmentService, ChatCallLogService, ChatMessageService } from './services';

@Module({
  controllers: [ChatController],
  providers: [ChatAttachmentService, ChatCallLogService, ChatMessageService, CallLogListener]
})
export class ChatModule {}
