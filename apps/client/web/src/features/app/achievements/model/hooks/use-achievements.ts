import { useLocalStorage } from '@siberiacancode/reactuse';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { AchievementId, UnlockedToday } from '../types';

import { ACHIEVEMENTS, ACHIEVEMENTS_STORAGE_KEY, DAY_KEY_FORMAT } from '../../config';
import { fireConfetti } from '../../lib/fire-confetti';
import { playEggSound } from '../../lib/play-egg-sound';

export const useAchievements = () => {
  const t = useTranslations('easterEggs.achievements');

  const { value: stored, set: setStored } = useLocalStorage<UnlockedToday | null>(
    ACHIEVEMENTS_STORAGE_KEY,
    null
  );

  const unlockedToday = (day: string) => (stored?.day === day ? stored.ids : []);

  const unlock = (id: AchievementId) => {
    const today = format(new Date(), DAY_KEY_FORMAT);
    const unlocked = unlockedToday(today);

    if (unlocked.includes(id)) {
      return;
    }

    setStored({ day: today, ids: [...unlocked, id] });

    toast.success(t(`${id}.title`), {
      id: `achievement-${id}`,
      description: t(`${id}.description`),
      icon: ACHIEVEMENTS[id].emoji,
      duration: 6000
    });

    playEggSound('achievement');
    void fireConfetti();
  };

  return { unlock };
};
