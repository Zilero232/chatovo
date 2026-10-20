import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { Check } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import type { HomeSpotlightProps } from './HomeSpotlight.types';

import s from './HomeSpotlight.module.scss';

export const HomeSpotlight = async ({ locale, spotlight, isReversed }: HomeSpotlightProps) => {
  const { key, image, width, height, points } = spotlight;

  const t = await getTranslations({ locale, namespace: `home.spotlights.${key}` });

  return (
    <article className={s.root} data-reversed={isReversed} data-tone={key}>
      <RevealOnScroll className={s.copy}>
        <Text as='span' className={s.eyebrow} size='sm' weight='semibold'>
          {t('eyebrow')}
        </Text>
        <h2 className={s.title}>{t('title')}</h2>
        <Text size='lg' tone='muted'>
          {t('description')}
        </Text>

        <ul className={s.points}>
          {points.map((point) => (
            <li key={point} className={s.point}>
              <Check aria-hidden className={s.pointIcon} />
              {t(`points.${point}`)}
            </li>
          ))}
        </ul>
      </RevealOnScroll>

      <RevealOnScroll className={s.visual} delay={0.08}>
        <Image
          alt={t('alt')}
          className={s.shot}
          height={height}
          sizes='(min-width: 1024px) 620px, 100vw'
          src={`/product/${locale}/${image}.webp`}
          width={width}
        />
      </RevealOnScroll>
    </article>
  );
};
