import { CosmeticsShop } from '@/features/app/cosmetics-shop';

import s from '../AppSettingsButton.module.scss';

export const AppearanceTab = () => (
  <div className={s.profilePanel}>
    <CosmeticsShop />
  </div>
);
