import { Module } from '@nestjs/common';

import { PushListener, TelegramListener } from './listeners';
import { TelegramContextService } from './services';

@Module({
  providers: [PushListener, TelegramContextService, TelegramListener]
})
export class NotificationsModule {}
