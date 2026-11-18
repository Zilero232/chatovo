import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { AppForbiddenException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config/config.module';
import { isYookassaIp } from '../lib';

@Injectable()
export class YookassaIpGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip ?? request.socket.remoteAddress ?? '';
    const allowLoopback = this.config.get('NODE_ENV') !== 'production';

    if (!isYookassaIp({ ip, allowLoopback })) {
      throw new AppForbiddenException('FORBIDDEN', 'Webhook source not allowed');
    }

    return true;
  }
}
