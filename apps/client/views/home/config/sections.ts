import type { Messages } from '@/shared/i18n';

export type HomeFaqKey = keyof Messages['home']['faq']['items'];

export const HOME_FEATURE_SPOTLIGHT_KEYS = ['rooms', 'music'] as const;

export const HOME_FEATURE_KEYS = ['quality', 'privacy', 'screen', 'link', 'free'] as const;

export const HOME_STEP_KEYS = ['create', 'share', 'talk'] as const;

export const HOME_DESKTOP_KEYS = ['shortcuts', 'ptt', 'platforms'] as const;

export const HOME_FAQ_KEYS = [
  'free',
  'discord',
  'capacity',
  'account',
  'selfHost'
] as const satisfies readonly HomeFaqKey[];

export type HomeFeatureKey = (typeof HOME_FEATURE_KEYS)[number];

export type HomeDesktopKey = (typeof HOME_DESKTOP_KEYS)[number];
