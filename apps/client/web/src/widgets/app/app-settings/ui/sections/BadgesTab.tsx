import { BadgeCollection } from '@/features/app/badge-collection';

import s from '../AppSettingsButton.module.scss';

export const BadgesTab = () => (
  <div className={s.profilePanel}>
    <BadgeCollection />
  </div>
);
