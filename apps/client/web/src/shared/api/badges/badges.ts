import type { BadgeProgressList, EarnedBadgeList } from '@chatovo/schemas';

import { api } from '../http';

export const getMyBadges = async (): Promise<BadgeProgressList> => {
  const { data } = await api.get('/badges/me');

  return data;
};

export const getUserBadges = async (userId: string): Promise<EarnedBadgeList> => {
  const { data } = await api.get(`/badges/${userId}`);

  return data;
};
