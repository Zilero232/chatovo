import { CronExpression } from '@nestjs/schedule';
import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';

import { siteBaseURL } from '../../../config/site';

export const LINK_PREVIEW = {
  siteName: 'Chatovo',
  room: {
    cacheControl: 'public, max-age=60',
    image: {
      url: `${siteBaseURL}/opengraph-image`,
      width: 1200,
      height: 630
    },
    copy: {
      defaultTitle: 'Chatovo — голосовые и видеокомнаты в реальном времени',
      defaultDescription:
        'Голосовые и видеокомнаты прямо в браузере: голос, видео, демонстрация экрана. Без установки.',
      openRoom: 'Голосовая комната в Chatovo. Заходи — без установки, прямо в браузере.',
      privateRoom: 'Закрытая комната в Chatovo. Для входа нужен пароль.',
      liveRoomPrefix: 'Сейчас в голосе'
    }
  },
  unfurl: {
    accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.1',
    htmlMimes: ['text/html', 'application/xhtml+xml'] as string[],
    htmlMaxBytes: 512 * 1024,
    imageMaxBytes: 10 * 1024 * 1024,
    image: {
      folder: 'link-previews',
      maxWidth: 1200,
      quality: 80,
      maxAgeMs: hoursToMilliseconds(24 * 30),
      sweepCron: CronExpression.EVERY_DAY_AT_5AM
    },
    cacheTtlMs: hoursToMilliseconds(6),
    failureCacheTtlMs: minutesToMilliseconds(15),
    cacheMaxEntries: 5000,
    throttle: { limit: 120, ttl: minutesToMilliseconds(1) }
  }
} as const;
