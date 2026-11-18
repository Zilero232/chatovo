import type { BadgeId } from '@chatovo/schemas';

import { useState } from 'react';

import { useMyBadges } from '@/entities/app/badges';
import { isTauriMobile } from '@/shared/lib';

export const useBadgeCollection = () => {
  const { data: badges, isPending, isError, refetch } = useMyBadges();

  const [selectedId, setSelectedId] = useState<BadgeId | null>(null);

  const isMobileApp = isTauriMobile();
  const list = (badges ?? []).filter(
    ({ id, tier }) => !isMobileApp || id !== 'supporter' || tier > 0
  );
  const earned = list.filter(({ tier }) => tier > 0);
  const available = list.filter(({ tier }) => tier === 0);
  const selected =
    list.find(({ id }) => id === selectedId) ?? earned.at(0) ?? available.at(0) ?? null;

  return {
    earned,
    available,
    selected,
    isPending,
    isError,
    retry: () => refetch(),
    select: setSelectedId
  };
};
