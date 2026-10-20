import type { Response } from 'express';

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { extname } from 'node:path';

import { bindDomainEventEmitter } from './common/events/emit-domain-event';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { BlockedUserGuard } from './common/guards';
import { AppConfigModule } from './config/config.module';
import { UPLOADS } from './config/uploads';
import { env, PrismaModule } from './core';
import { AuthModule } from './modules/auth';
import { ChatModule } from './modules/chat';
import { FeedbackModule } from './modules/feedback';
import { FriendsModule } from './modules/friends';
import { GithubModule } from './modules/github';
import { HealthModule } from './modules/health';
import { ImagesModule } from './modules/images';
import { LinkPreviewModule } from './modules/link-preview';
import { LivekitModule } from './modules/livekit';
import { ModerationModule } from './modules/moderation';
import { MusicModule } from './modules/music';
import { NotificationsModule } from './modules/notifications';
import { PushModule } from './modules/push';
import { RealtimeModule } from './modules/realtime';
import { RoomsModule } from './modules/rooms';
import { UPLOADS_DIR } from './modules/uploads';
import { UsersModule } from './modules/users';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          env.NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        autoLogging: false
      }
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 120 }]
    }),
    ServeStaticModule.forRoot({
      rootPath: UPLOADS_DIR,
      serveRoot: UPLOADS.route,
      serveStaticOptions: {
        setHeaders: (res: Response, path: string) => {
          const { download } = res.req.query;

          res.setHeader('Cache-Control', UPLOADS.cacheControl);

          if (typeof download === 'string') {
            res.attachment(download);
            res.setHeader('Content-Security-Policy', UPLOADS.sandboxCsp);

            return;
          }

          if (UPLOADS.inlineImageExtensions.has(extname(path).toLowerCase())) {
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

            return;
          }

          res.setHeader('Content-Disposition', 'attachment');
          res.setHeader('Content-Security-Policy', UPLOADS.sandboxCsp);
        }
      }
    }),
    AuthModule,
    NotificationsModule,
    HealthModule,
    RoomsModule,
    UsersModule,
    ChatModule,
    FriendsModule,
    FeedbackModule,
    GithubModule,
    ImagesModule,
    LinkPreviewModule,
    LivekitModule,
    ModerationModule,
    MusicModule,
    PushModule,
    RealtimeModule
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: BlockedUserGuard }
  ]
})
export class AppModule {
  constructor(eventEmitter: EventEmitter2) {
    bindDomainEventEmitter((event, payload) => {
      eventEmitter.emit(event, payload);
    });
  }
}
