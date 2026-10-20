import type { Achievement, AchievementId } from '../model/types';

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  konami: { id: 'konami', emoji: '🎮' },
  nightOwl: { id: 'nightOwl', emoji: '🦉' },
  quietOne: { id: 'quietOne', emoji: '🤫' },
  soloConcert: { id: 'soloConcert', emoji: '🎤' },
  muteMaster: { id: 'muteMaster', emoji: '🔇' },
  snake: { id: 'snake', emoji: '🐍' }
};
