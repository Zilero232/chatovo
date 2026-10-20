import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_DESKTOP_ICONS, HOME_DESKTOP_KEYS } from '../../../config';
import { HomeDownloadButton } from '../HomeDownloadButton/HomeDownloadButton';

import s from '../../HomePage.module.scss';

export const HomeDesktop = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.desktop' });

  return (
    <MarketingSection id='desktop'>
      <RevealOnScroll className={s.desktop}>
        <div className={s.desktopCopy}>
          <Text as='span' className={s.eyebrow} size='sm' weight='medium'>
            <span aria-hidden className={s.eyebrowDot} />
            {t('eyebrow')}
          </Text>

          <Text as='h2' className={s.desktopHeading} weight='semibold'>
            {t('heading')}
          </Text>

          <Text size='base' tone='muted'>
            {t('description')}
          </Text>

          <div className={s.desktopActions}>
            <HomeDownloadButton label={t('cta')} />
            <Text size='sm' tone='muted'>
              {t('platforms')}
            </Text>
          </div>
        </div>

        <ul className={s.desktopPerks}>
          {HOME_DESKTOP_KEYS.map((key) => {
            const Icon = HOME_DESKTOP_ICONS[key];

            return (
              <li key={key} className={s.desktopPerk}>
                <span aria-hidden className={s.featureIcon}>
                  <Icon />
                </span>

                <div>
                  <Text as='h3' className={s.desktopPerkTitle} weight='semibold'>
                    {t(`items.${key}.title`)}
                  </Text>
                  <Text size='sm' tone='muted'>
                    {t(`items.${key}.description`)}
                  </Text>
                </div>
              </li>
            );
          })}
        </ul>
      </RevealOnScroll>
    </MarketingSection>
  );
};
