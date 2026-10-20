import type { Messages } from '@/shared/i18n';

export type HomeFaqKey = keyof Messages['home']['faq']['items'];

export const HOME_HERO_POINT_KEYS = ['free', 'everywhere'] as const;

export const HOME_SHOWCASE_CHIPS = [
  { key: 'music', position: 'music' },
  { key: 'speaking', position: 'speaking' },
  { key: 'chat', position: 'chat' }
] as const;

export const HOME_SPOTLIGHTS = [
  {
    key: 'music',
    image: 'music',
    width: 1400,
    height: 969,
    points: ['sources', 'ducking', 'share']
  },
  { key: 'voice', image: 'room', width: 1400, height: 1135, points: ['audio', 'screen', 'volume'] }
] as const;

export const HOME_STAT_KEYS = ['free', 'unlimited', 'platforms'] as const;

export const HOME_STEP_KEYS = ['create', 'share', 'talk'] as const;

export const HOME_PLATFORMS_LINE = 'Windows · macOS · Linux · Android';

export const HOME_DESKTOP_KEYS = ['shortcuts', 'ptt', 'platforms'] as const;

export const HOME_FAQ_KEYS = [
  'free',
  'discord',
  'capacity',
  'account',
  'selfHost'
] as const satisfies readonly HomeFaqKey[];

export type HomeShowcaseChip = (typeof HOME_SHOWCASE_CHIPS)[number];

export type HomeSpotlight = (typeof HOME_SPOTLIGHTS)[number];

export type HomeDesktopKey = (typeof HOME_DESKTOP_KEYS)[number];

export type HomeStepKey = (typeof HOME_STEP_KEYS)[number];
