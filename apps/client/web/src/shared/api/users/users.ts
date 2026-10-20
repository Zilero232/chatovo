import type { UpdateProfilePayload, UserProfile } from '@chatovo/schemas';

import { api, UPLOAD_TIMEOUT_MS } from '../http';

export const getUserProfile = async (id: string): Promise<UserProfile> => {
  const { data } = await api.get(`/users/${id}/profile`);

  return data;
};

export const listDevelopers = async (): Promise<UserProfile[]> => {
  const { data } = await api.get('/users/developers');

  return data;
};

export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const fd = new FormData();

  fd.append('displayName', payload.displayName);
  fd.append('profileUrl', payload.profileUrl);
  fd.append('bannerColor', payload.bannerColor ?? '');
  fd.append('bio', payload.bio);

  if (payload.avatar instanceof File) {
    fd.append('avatar', payload.avatar);
  }

  if (payload.avatar === null) {
    fd.append('removeAvatar', 'true');
  }

  const { data } = await api.post('/users/profile', fd, { timeout: UPLOAD_TIMEOUT_MS });

  return data;
};
