import type { ReactNode } from 'react';

import { localizeSitePath } from '@chatovo/config';
import { Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { ROUTES } from '@/shared/constants';

import type { PricingSectionProps } from '../PricingSection.types';

import s from '../../PricingPage.module.scss';

export const PricingPayment = async ({ locale }: PricingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'pricing.payment' });

  const terms = (chunks: ReactNode) => (
    <Link className={s.inlineLink} href={localizeSitePath({ path: ROUTES.terms, locale })}>
      {chunks}
    </Link>
  );

  return (
    <div className={s.facts}>
      <div className={s.fact}>
        <h3 className={s.factTitle}>{t('methodsTitle')}</h3>
        <Text size='sm' tone='muted'>
          {t('methods')}
        </Text>
      </div>

      <div className={s.fact}>
        <h3 className={s.factTitle}>{t('deliveryTitle')}</h3>
        <Text size='sm' tone='muted'>
          {t('delivery')}
        </Text>
      </div>

      <div className={s.fact}>
        <h3 className={s.factTitle}>{t('refundTitle')}</h3>
        <Text size='sm' tone='muted'>
          {t.rich('refund', { terms })}
        </Text>
      </div>
    </div>
  );
};
