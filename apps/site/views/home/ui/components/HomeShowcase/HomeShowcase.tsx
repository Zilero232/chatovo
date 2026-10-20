import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_SHOWCASE_CHIPS, HOME_SHOWCASE_ICONS } from '../../../config';

import s from './HomeShowcase.module.scss';

export const HomeShowcase = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.showcase' });

  return (
    <MarketingSection id='product'>
      <RevealOnScroll className={s.head}>
        <h2 className={s.heading}>{t('heading')}</h2>
        <Text className={s.subheading} size='lg' tone='muted'>
          {t('subheading')}
        </Text>
      </RevealOnScroll>

      <RevealOnScroll className={s.stage} delay={0.08}>
        <div className={s.window}>
          <div aria-hidden className={s.titlebar}>
            <span className={s.dots}>
              <span />
              <span />
              <span />
            </span>
            <span className={s.address}>{t('address')}</span>
          </div>
          <Image
            alt={t('alt')}
            className={s.shot}
            height={1200}
            sizes='(min-width: 1200px) 1112px, 100vw'
            src={`/product/${locale}/room-chat.webp`}
            width={1920}
          />
        </div>

        {HOME_SHOWCASE_CHIPS.map(({ key, position }) => {
          const Icon = HOME_SHOWCASE_ICONS[key];

          return (
            <span key={key} className={s.chip} data-position={position}>
              <Icon aria-hidden className={s.chipIcon} />
              {t(`chips.${key}`)}
            </span>
          );
        })}
      </RevealOnScroll>
    </MarketingSection>
  );
};
