import type { Messages } from '@/shared/i18n';

export type FeaturesGroupKey = keyof Messages['features']['groups'];

export type FeaturesItemKey = keyof Messages['features']['items'];

export const FEATURES_GROUP_KEYS = [
  'voice',
  'music',
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
  music: ['musicLinks', 'musicRadio', 'musicSync', 'musicShare'],
  chat: ['chatInRoom', 'markdown', 'attachments', 'editing', 'reactions'],
  friends: ['friendList', 'requests', 'presence', 'directCalls', 'notifications'],
  rooms: ['publicRooms', 'privateRooms', 'invites', 'recent', 'ownership'],
  apps: ['web', 'desktop', 'tray', 'android', 'safeArea']
};

export const FEATURES_GROUP_IMAGES: Partial<
  Record<
    FeaturesGroupKey,
    { src: string; width: number; height: number; altKey: 'chat' | 'music' | 'voice' }
  >
> = {
  voice: { src: 'room', width: 1400, height: 1135, altKey: 'voice' },
  music: { src: 'music', width: 1400, height: 969, altKey: 'music' },
  chat: { src: 'room-chat', width: 1920, height: 1200, altKey: 'chat' }
};
