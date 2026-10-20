'use client';

import { UpdateProfileForm } from '@/features/auth/update-profile';

import s from '../AppSettingsButton.module.scss';

export const ProfileTab = () => (
  <div className={s.profilePanel}>
    <UpdateProfileForm />
  </div>
);
