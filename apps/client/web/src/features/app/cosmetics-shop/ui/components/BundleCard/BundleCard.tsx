import { BUNDLE_DISCOUNT, COSMETICS } from '@chatovo/schemas';
import { SubmitButton } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'use-intl';

import type { BundleCardProps } from './BundleCard.types';

import { RUB_FORMAT } from '../../../config';
import { ItemPreview } from '../ItemPreview/ItemPreview';
import { RarityBadge } from '../RarityBadge/RarityBadge';

import s from '../../CosmeticsShop.module.scss';

export const BundleCard = ({
  bundle,
  isTryingOn,
  canPurchase,
  isBuying,
  onBuy,
  onTryOn
}: BundleCardProps) => {
  const t = useTranslations('shop');
  const format = useFormatter();

  const { key, collection, rarity, isNew, items, priceRub, fullPriceRub } = bundle;

  return (
    <li className={clsx(s.bundle, { [s.cardTrying]: isTryingOn })} data-rarity={rarity}>
      <div className={s.bundleHeader}>
        <div className={s.bundleText}>
          <span className={s.bundleTitle}>{t(`collections.${collection}`)}</span>
          <span className={s.bundleTagline}>{t(`taglines.${collection}`)}</span>
        </div>
        <RarityBadge isNew={isNew} rarity={rarity} />
      </div>

      <button className={s.bundleItems} type='button' onClick={() => onTryOn(key)}>
        {items.map((itemKey) => (
          <span key={itemKey} className={s.bundleItem}>
            <ItemPreview item={COSMETICS[itemKey]} />
          </span>
        ))}
        <span className={s.tryOnHint}>{isTryingOn ? t('trying') : t('tryOnSet')}</span>
      </button>

      <div className={s.bundleFooter}>
        <span className={s.discount}>{t('bundleSave', { percent: BUNDLE_DISCOUNT * 100 })}</span>
        <span className={s.fullPrice}>{format.number(fullPriceRub, RUB_FORMAT)}</span>
        <SubmitButton
          className={s.bundleBuy}
          disabled={!canPurchase}
          isPending={isBuying}
          size='sm'
          type='button'
          onClick={() => onBuy(key)}
        >
          {t('bundleBuy', { price: format.number(priceRub, RUB_FORMAT) })}
        </SubmitButton>
      </div>
    </li>
  );
};
