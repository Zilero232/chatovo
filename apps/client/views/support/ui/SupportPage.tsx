import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import { FaqJsonLd } from '@/shared/seo';
import {
  MarketingHero,
  MarketingSection,
  MarketingShell
} from '@/widgets/marketing/marketing-shell';

import type { SupportPageProps } from './SupportPage.types';

import { SUPPORT_GROUP_ITEMS, SUPPORT_GROUP_KEYS } from '../config';
import { SupportContact, SupportGroup } from './components';

import s from './SupportPage.module.scss';

export const SupportPage = async ({ locale }: SupportPageProps) => {
  const t = await getTranslations({ locale, namespace: 'support' });

  const faqItems = SUPPORT_GROUP_KEYS.flatMap((groupKey) =>
    SUPPORT_GROUP_ITEMS[groupKey].map((itemKey) => ({
      question: t(`items.${itemKey}.question`),
      answer: t(`items.${itemKey}.answer`)
    }))
  );

  return (
    <MarketingShell locale={locale} path={ROUTES.support}>
      <FaqJsonLd items={faqItems} />

      <MarketingHero
        chato='peek'
        description={t('hero.description')}
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
      />

      <MarketingSection>
        <div className={s.groups}>
          {SUPPORT_GROUP_KEYS.map((groupKey) => (
            <SupportGroup key={groupKey} groupKey={groupKey} locale={locale} />
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <SupportContact locale={locale} />
      </MarketingSection>
    </MarketingShell>
  );
};
