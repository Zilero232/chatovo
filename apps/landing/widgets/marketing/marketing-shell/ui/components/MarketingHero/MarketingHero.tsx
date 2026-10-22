import { ChatoScene, RevealOnScroll, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { MarketingHeroProps } from './MarketingHero.types';

import { MarketingEyebrow } from '../MarketingEyebrow/MarketingEyebrow';

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
      {eyebrow && <MarketingEyebrow>{eyebrow}</MarketingEyebrow>}

      <h1 className={s.heroTitle}>{title}</h1>

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

    {chato && !visual && <ChatoScene className={s.heroScene} pose={chato} />}
  </section>
);
