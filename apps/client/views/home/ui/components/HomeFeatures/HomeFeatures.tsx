import { getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';
import { MarketingSection, MarketingSectionHead } from '@/widgets/marketing/marketing-shell';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_FEATURE_ICONS, HOME_FEATURE_KEYS, HOME_ROOM_MOCK_SPEAKER } from '../../../config';
import { HomeMusicMock } from '../HomeMusicMock/HomeMusicMock';
import { HomeRoomMock } from '../HomeRoomMock/HomeRoomMock';

import s from '../../HomePage.module.scss';

export const HomeFeatures = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.features' });

  return (
    <MarketingSection id='features'>
      <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

      <div className={s.bento}>
        <RevealOnScroll as='article' className={s.bentoWide}>
          <HomeRoomMock speakingLabel={t('roomsMock', { name: HOME_ROOM_MOCK_SPEAKER })} />
          <Text as='h3' className={s.bentoTitle} weight='semibold'>
            {t('items.rooms.title')}
          </Text>
          <Text size='sm' tone='muted'>
            {t('items.rooms.description')}
          </Text>
        </RevealOnScroll>

        <RevealOnScroll as='article' className={s.bentoTall} delay={0.06}>
          <HomeMusicMock subtitle={t('musicMock.subtitle')} title={t('musicMock.title')} />
          <Text as='h3' className={s.bentoTitle} weight='semibold'>
            {t('items.music.title')}
          </Text>
          <Text size='sm' tone='muted'>
            {t('items.music.description')}
          </Text>
        </RevealOnScroll>

        {HOME_FEATURE_KEYS.map((key, index) => {
          const Icon = HOME_FEATURE_ICONS[key];

          return (
            <RevealOnScroll key={key} as='article' className={s.bentoCard} delay={index * 0.05}>
              <span aria-hidden className={s.bentoIcon}>
                <Icon />
              </span>
              <Text as='h3' className={s.bentoTitle} weight='semibold'>
                {t(`items.${key}.title`)}
              </Text>
              <Text size='sm' tone='muted'>
                {t(`items.${key}.description`)}
              </Text>
            </RevealOnScroll>
          );
        })}
      </div>
    </MarketingSection>
  );
};
