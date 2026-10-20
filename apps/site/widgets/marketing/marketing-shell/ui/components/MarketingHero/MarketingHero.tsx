import { Chato, RevealOnScroll, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { MarketingHeroProps } from './MarketingHero.types';

import { MarketingScene } from '../MarketingScene/MarketingScene';

import s from '../../MarketingShell.module.scss';

export const MarketingHero = ({
  title,
  description,
  eyebrow,
  chato,
  visual,
  children
}: MarketingHeroProps) => (
  <section className={clsx(s.container, s.hero, (chato || visual) && s.heroWithChato)}>
    <div className={s.heroCopy}>
      {eyebrow && (
        <Text as='span' className={s.eyebrow} size='xs' weight='medium'>
          <span aria-hidden className={s.eyebrowDot} />
          {eyebrow}
        </Text>
      )}

      <Text as='h1' className={s.heroTitle} weight='bold'>
        {title}
      </Text>

      <Text className={s.heroDescription} size='lg' tone='muted'>
        {description}
      </Text>

      {children && (
        <RevealOnScroll delay={0.12}>
          <div className={s.heroActions}>{children}</div>
        </RevealOnScroll>
      )}
    </div>

    {visual && <div className={s.heroVisual}>{visual}</div>}

    {chato && !visual && (
      <MarketingScene className={s.heroScene}>
        <Chato className={s.heroChato} pose={chato} />
      </MarketingScene>
    )}
  </section>
);
