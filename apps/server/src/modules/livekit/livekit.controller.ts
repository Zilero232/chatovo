import type { UserSession } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentSession } from '../../common/decorators/current-user.decorator';
import { TokenRequestDto, TokenResponseDto } from './dto/livekit.dto';
import { LivekitService, WebhookService } from './services';

@ApiTags('livekit')
@Controller('livekit')
export class LivekitController {
  constructor(
    private readonly livekit: LivekitService,
    private readonly webhook: WebhookService
  ) {}

  @Post('token')
  @ZodResponse({ type: TokenResponseDto })
  issueToken(@Body() body: TokenRequestDto, @CurrentSession() session: UserSession) {
    return this.livekit.issueRoomToken({
      roomId: body.roomId,
      password: body.password,
      invisible: body.invisible,
      userId: session.user.id
    });
  }

  @Post('webhook')
  @AllowAnonymous()
  async handleWebhook(@Req() req: Request, @Headers('authorization') authHeader?: string) {
    const body = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);

    await this.webhook.handle({ body, authHeader });

    return { ok: true };
  }
}
