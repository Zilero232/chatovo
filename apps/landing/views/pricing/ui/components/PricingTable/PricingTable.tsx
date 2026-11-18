import { COSMETIC_KINDS, COSMETIC_PRICES, COSMETIC_RARITIES } from '@chatovo/schemas';
import { getFormatter, getTranslations } from 'next-intl/server';

import { MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { PricingSectionProps } from '../PricingSection.types';

import { PRICE_FORMAT } from '../../../config';

import s from '../../PricingPage.module.scss';

export const PricingTable = async ({ locale }: PricingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'pricing' });
  const format = await getFormatter({ locale });

  return (
    <div className={s.block}>
      <MarketingSectionHead description={t('table.description')} heading={t('table.heading')} />

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope='col'>{t('table.item')}</th>
              {COSMETIC_RARITIES.map((rarity) => (
                <th key={rarity} className={s.rarityHead} data-rarity={rarity} scope='col'>
                  {t(`rarity.${rarity}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COSMETIC_KINDS.map((kind) => (
              <tr key={kind}>
                <th scope='row'>
                  <span className={s.kindName}>{t(`kindNames.${kind}`)}</span>
                  <span className={s.kindHint}>{t(`kindHints.${kind}`)}</span>
                </th>
                {COSMETIC_RARITIES.map((rarity) => (
                  <td key={rarity}>{format.number(COSMETIC_PRICES[rarity][kind], PRICE_FORMAT)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
