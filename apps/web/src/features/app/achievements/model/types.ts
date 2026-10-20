export type AchievementId =
  'konami' | 'muteMaster' | 'nightOwl' | 'quietOne' | 'snake' | 'soloConcert';

export type Achievement = {
  emoji: string;
  id: AchievementId;
};

export type UnlockedToday = {
  day: string;
  ids: AchievementId[];
};
