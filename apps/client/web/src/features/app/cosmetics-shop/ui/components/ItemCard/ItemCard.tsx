import { Button, SubmitButton } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { useFormatter, useTranslations } from 'use-intl';

import type { ItemCardProps } from './ItemCard.types';

import { RUB_FORMAT } from '../../../config';
import { ItemPreview } from '../ItemPreview/ItemPreview';
import { RarityBadge } from '../RarityBadge/RarityBadge';

import s from '../../CosmeticsShop.module.scss';

export const ItemCard = ({
  entry,
  isTryingOn,
  canPurchase,
  showPrice,
  isBuying,
  isEquipping,
  onBuy,
  onToggleEquip,
  onTryOn
}: ItemCardProps) => {
  const t = useTranslations('shop');
  const format = useFormatter();

  const { key, item, owned, equipped } = entry;

  return (
    <li
      className={clsx(s.card, { [s.cardEquipped]: equipped, [s.cardTrying]: isTryingOn })}
      data-rarity={item.rarity}
    >
      <button className={s.cardPreview} type='button' onClick={() => onTryOn(key)}>
        <ItemPreview item={item} />
        <span className={s.tryOnHint}>{isTryingOn ? t('trying') : t('tryOn')}</span>
      </button>

      <RarityBadge isNew={item.isNew && !owned} rarity={item.rarity} />

      <span className={s.cardTitle}>{t(`collections.${item.collection}`)}</span>

      {owned && (
        <Button
          disabled={isEquipping}
          size='sm'
          type='button'
          variant={equipped ? 'secondary' : 'outline'}
          onClick={() => onToggleEquip(key)}
        >
          {equipped && <Check aria-hidden />}
          {equipped ? t('unequip') : t('equip')}
        </Button>
      )}

      {!owned && showPrice && (
        <SubmitButton
          disabled={!canPurchase}
          isPending={isBuying}
          size='sm'
          type='button'
          onClick={() => onBuy(key)}
        >
          {format.number(item.priceRub, RUB_FORMAT)}
        </SubmitButton>
      )}
    </li>
  );
};
