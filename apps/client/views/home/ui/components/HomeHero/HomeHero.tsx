import { getTranslations } from 'next-intl/server';

import { Text } from '@/ui-kit';
import { MarketingAuthCta } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HomeDownloadButton } from '../HomeDownloadButton/HomeDownloadButton';
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
          <MarketingAuthCta
            openAppLabel={t('ctaOpenApp')}
            signInLabel={t('ctaPrimary')}
            size='lg'
          />
          <HomeDownloadButton label={t('ctaDownload')} />
        </div>

        <Text size='sm' tone='subtle'>
          {t('ctaNote')}
        </Text>
      </div>

      <HomeHeroStage label={t('stageLabel')} />
    </section>
  );
};
