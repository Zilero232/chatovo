import type { Messages } from '@/shared/i18n';

export type FeaturesGroupKey = keyof Messages['features']['groups'];

export type FeaturesItemKey = keyof Messages['features']['items'];

export const FEATURES_GROUP_KEYS = [
  'voice',
  'chat',
  'friends',
  'rooms',
  'apps'
] as const satisfies readonly FeaturesGroupKey[];

export const FEATURES_GROUP_ITEMS: Record<FeaturesGroupKey, readonly FeaturesItemKey[]> = {
  voice: [
    'rooms',
    'background',
    'video',
    'screen',
    'quality',
    'volume',
    'gate',
    'ptt',
    'shortcuts',
    'devices',
    'processing',
    'activity'
  ],
  chat: ['chatInRoom', 'markdown', 'attachments', 'editing', 'reactions'],
  friends: ['friendList', 'requests', 'presence', 'directCalls', 'notifications'],
  rooms: ['publicRooms', 'privateRooms', 'invites', 'recent', 'ownership'],
  apps: ['web', 'desktop', 'tray', 'android', 'safeArea']
};
