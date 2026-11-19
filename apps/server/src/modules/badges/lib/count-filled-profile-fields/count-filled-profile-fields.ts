import type { ProfileFields } from './count-filled-profile-fields.types';

export const countFilledProfileFields = (profile: ProfileFields | null): number => {
  if (!profile) {
    return 0;
  }

  const { displayName, avatarUrl, profileUrl, bannerColor, bio } = profile;

  return [displayName, avatarUrl, profileUrl, bannerColor, bio].filter(
    (field) => typeof field === 'string' && field.trim().length > 0
  ).length;
};
