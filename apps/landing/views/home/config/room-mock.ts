import { SITE } from '@/shared/config';

export const HOME_ROOM_MOCK = [
  { id: 'nika', name: 'nika', tone: 'coral', isSpeaking: true },
  { id: 'max', name: 'max', tone: 'sun', isSpeaking: false },
  { id: 'lev', name: 'lev', tone: 'violet', isSpeaking: false },
  { id: 'mira', name: 'mira', tone: 'mint', isSpeaking: false }
] as const;

export const HOME_INVITE_LINK = `${new URL(SITE.url).host}/room?id=evening`;
