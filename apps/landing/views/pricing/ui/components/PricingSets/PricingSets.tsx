import type { CSSProperties } from 'react';

import { COLLECTION_IDS, COLLECTIONS, getBundlePrice, getCollectionTotal } from '@chatovo/schemas';
import { getFormatter, getTranslations } from 'next-intl/server';

import { MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { PricingSectionProps } from '../PricingSection.types';

import { PRICE_FORMAT } from '../../../config';

import s from '../../PricingPage.module.scss';

export const PricingSets = async ({ locale }: PricingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const format = await getFormatter({ locale });

  return (
    <div className={s.block}>
      <MarketingSectionHead description={t('sets.description')} heading={t('sets.heading')} />

      <ul className={s.sets}>
        {COLLECTION_IDS.map((collection) => {
          const { colors, rarity } = COLLECTIONS[collection];
          const fullPrice = getCollectionTotal(collection);
          const swatch = {
            '--swatch': `linear-gradient(135deg, ${colors.join(', ')})`
          } as CSSProperties;

          return (
            <li key={collection} className={s.set} data-rarity={rarity}>
              <span aria-hidden className={s.swatch} style={swatch} />
              <span className={s.setName}>{t(`collections.${collection}`)}</span>
              <span className={s.setRarity}>{t(`rarity.${rarity}`)}</span>
              <span className={s.setPrice}>
                {format.number(getBundlePrice(collection), PRICE_FORMAT)}
                <s className={s.setFullPrice}>{format.number(fullPrice, PRICE_FORMAT)}</s>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
