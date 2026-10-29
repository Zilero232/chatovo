import { Injectable } from '@nestjs/common';

import type { RegisterDeviceInput, UnregisterDeviceInput } from './push.service.types';

import { PrismaService } from '../../../core';

@Injectable()
export class PushService {
  constructor(private readonly prisma: PrismaService) {}

  async registerPushDevice({ userId, input }: RegisterDeviceInput): Promise<void> {
    const { token, platform, locale } = input;

    await this.prisma.pushDevice.upsert({
      where: { token },
      create: { userId, token, platform, locale },
      update: { userId, platform, ...(locale === undefined ? {} : { locale }) }
    });
  }

  async unregisterPushDevice({ userId, input }: UnregisterDeviceInput): Promise<void> {
    const { token } = input;

    await this.prisma.pushDevice.deleteMany({ where: { userId, token } });
  }
}
