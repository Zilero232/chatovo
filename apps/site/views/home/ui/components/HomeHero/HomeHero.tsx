import { Text } from '@chatovo/ui-kit';
import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { MarketingAppCta, MarketingScene } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_HERO_POINT_KEYS } from '../../../config';
import { HomeDownloadButton } from '../HomeDownloadButton/HomeDownloadButton';
import { HomeHeroCard } from '../HomeHeroCard/HomeHeroCard';
import { HomeHeroStage } from '../HomeHeroStage/HomeHeroStage';

import s from '../../HomePage.module.scss';

export const HomeHero = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return (
    <section className={s.hero}>
      <div className={s.heroCopy}>
        <Text as='span' className={s.eyebrow} size='sm' weight='medium'>
          <span aria-hidden className={s.eyebrowDot} />
          {t('eyebrow')}
        </Text>

        <h1 className={s.heroTitle}>
          {t('title')} <em className={s.heroAccent}>{t('titleAccent')}</em>
        </h1>

        <Text className={s.heroDescription} size='lg' tone='muted'>
          {t('description')}
        </Text>

        <div className={s.heroActions}>
          <MarketingAppCta label={t('ctaPrimary')} size='lg' />
          <HomeDownloadButton label={t('ctaDownload')} locale={locale} />
        </div>

        <ul className={s.heroPoints}>
          {HOME_HERO_POINT_KEYS.map((key) => (
            <li key={key} className={s.heroPoint}>
              <Check aria-hidden className={s.heroPointIcon} />
              {t(`points.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      <MarketingScene className={s.heroScene} size='lg'>
        <HomeHeroStage label={t('stageLabel')} />
        <HomeHeroCard
          live={t('card.live')}
          room={t('card.room')}
          source={t('card.source')}
          track={t('card.track')}
        />
      </MarketingScene>
    </section>
  );
};
