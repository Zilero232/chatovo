import { getTranslations } from 'next-intl/server';

import { MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { PricingSectionProps } from '../PricingSection.types';

import { PRICING_STEP_KEYS } from '../../../config';

import s from '../../PricingPage.module.scss';

export const PricingSteps = async ({ locale }: PricingSectionProps) => {
  const t = await getTranslations({ locale, namespace: 'pricing.steps' });

  return (
    <div className={s.block}>
      <MarketingSectionHead description={t('description')} heading={t('heading')} />

      <ol className={s.steps}>
        {PRICING_STEP_KEYS.map((key, index) => (
          <li key={key} className={s.step}>
            <span aria-hidden className={s.stepNumber}>
              {index + 1}
            </span>
            <span className={s.stepTitle}>{t(`items.${key}.title`)}</span>
            <span className={s.stepText}>{t(`items.${key}.text`)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
