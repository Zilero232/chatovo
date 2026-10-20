import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { MarketingSection } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_DESKTOP_ICONS, HOME_DESKTOP_KEYS, HOME_PLATFORMS_LINE } from '../../../config';
import { HomeDevices } from '../HomeDevices/HomeDevices';
import { HomeDownloadButton } from '../HomeDownloadButton/HomeDownloadButton';

import s from './HomeDesktop.module.scss';

export const HomeDesktop = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.desktop' });

  return (
    <MarketingSection className={s.root} id='desktop'>
      <RevealOnScroll className={s.copy}>
        <Text as='span' className={s.eyebrow} size='sm' weight='semibold'>
          {t('eyebrow')}
        </Text>
        <h2 className={s.heading}>{t('heading')}</h2>
        <Text size='lg' tone='muted'>
          {t('description')}
        </Text>

        <ul className={s.perks}>
          {HOME_DESKTOP_KEYS.map((key) => {
            const Icon = HOME_DESKTOP_ICONS[key];

            return (
              <li key={key} className={s.perk}>
                <Icon aria-hidden className={s.perkIcon} />
                <span>
                  <span className={s.perkTitle}>{t(`items.${key}.title`)}</span>
                  <span className={s.perkText}>{t(`items.${key}.description`)}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className={s.actions}>
          <HomeDownloadButton label={t('cta')} locale={locale} />
          <Text size='sm' tone='subtle'>
            {HOME_PLATFORMS_LINE}
          </Text>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.08}>
        <HomeDevices desktopAlt={t('desktopAlt')} locale={locale} mobileAlt={t('mobileAlt')} />
      </RevealOnScroll>
    </MarketingSection>
  );
};
