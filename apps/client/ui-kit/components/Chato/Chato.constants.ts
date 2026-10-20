import type { ChatoEyes, ChatoPose } from './Chato.types';

export const CHATO_EYES: Record<ChatoPose, ChatoEyes> = {
  listen: 'happy',
  peek: 'open',
  sleep: 'closed',
  wave: 'open',
  wink: 'wink'
};

export const CHATO_HEAD_TRANSFORM = 'translate(27.5 -22) scale(1.45)';

export const CHATO_PEEK_HEAD_TRANSFORM = 'translate(27.5 40) scale(1.45)';
