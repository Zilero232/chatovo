import { Module } from '@nestjs/common';

import { BadgesController } from './badges.controller';
import { BadgesService } from './services';

@Module({
  controllers: [BadgesController],
  providers: [BadgesService]
})
export class BadgesModule {}
