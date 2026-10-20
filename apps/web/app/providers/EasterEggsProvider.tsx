'use client';

import { useAchievements } from '@/features/app/achievements';
import { useAprilFools } from '@/features/app/april-fools';
import { SecretGamesHost } from '@/features/app/secret-games';

export const EasterEggsProvider = () => {
  const { unlock } = useAchievements();

  useAprilFools();

  return <SecretGamesHost onKonami={() => unlock('konami')} onSecretOpen={() => unlock('snake')} />;
};
