import type { Messages } from '@/shared/i18n';

export type AboutStoryKey = keyof Messages['about']['story']['items'];

export type AboutStackKey = keyof Messages['about']['stack']['items'];

export type AboutContributeKey = keyof Messages['about']['contribute']['items'];

export const ABOUT_STORY_KEYS = [
  'problem',
  'control',
  'openness'
] as const satisfies readonly AboutStoryKey[];

export const ABOUT_STACK_KEYS = [
  'client',
  'desktop',
  'server',
  'media',
  'schemas',
  'tooling'
] as const satisfies readonly AboutStackKey[];

export const ABOUT_CONTRIBUTE_KEYS = [
  'code',
  'issues',
  'selfHost'
] as const satisfies readonly AboutContributeKey[];
