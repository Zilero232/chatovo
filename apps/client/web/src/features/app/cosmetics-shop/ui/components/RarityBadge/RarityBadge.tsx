import { useTranslations } from 'use-intl';

import type { RarityBadgeProps } from './RarityBadge.types';

import s from '../../CosmeticsShop.module.scss';

export const RarityBadge = ({ rarity, isNew }: RarityBadgeProps) => {
  const t = useTranslations('shop');

  return (
    <span className={s.badges}>
      {isNew && <span className={s.newBadge}>{t('new')}</span>}
      <span className={s.rarityBadge} data-rarity={rarity}>
        {t(`rarity.${rarity}`)}
      </span>
    </span>
  );
};
