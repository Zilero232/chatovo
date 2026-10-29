import type { OnApplicationBootstrap } from '@nestjs/common';

import { USER_ROLE } from '@chatovo/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { isNullish } from 'remeda';

import { AppConfigService } from '../../../../config/config.module';
import { PrismaService } from '../../../../core';

@Injectable()
export class OwnerRoleService implements OnApplicationBootstrap {
  private readonly logger = new Logger(OwnerRoleService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.get('OWNER_EMAIL');

    if (isNullish(email)) {
      return;
    }

    const [, promoted] = await this.prisma.$transaction([
      this.prisma.user.updateMany({
        where: { role: USER_ROLE.owner, email: { not: email } },
        data: { role: USER_ROLE.admin }
      }),
      this.prisma.user.updateMany({ where: { email }, data: { role: USER_ROLE.owner } })
    ]);

    if (promoted.count === 0) {
      this.logger.warn('OWNER_EMAIL has no account yet — it becomes the owner on sign-up');
    }
  }
}
