import { Button, Chato, RevealOnScroll } from '@chatovo/ui-kit';

import type { MarketingCtaPanelProps } from './MarketingCtaPanel.types';

import { MarketingAppCta } from '../MarketingAppCta/MarketingAppCta';
import { MarketingSection } from '../MarketingSection/MarketingSection';

import s from './MarketingCtaPanel.module.scss';

export const MarketingCtaPanel = ({
  heading,
  description,
  actionLabel,
  note,
  secondary,
  chato = 'wave'
}: MarketingCtaPanelProps) => (
  <MarketingSection>
    <RevealOnScroll className={s.root}>
      <Chato className={s.chato} pose={chato} />

      <div className={s.copy}>
        <h2 className={s.heading}>{heading}</h2>
        <p className={s.text}>{description}</p>

        <div className={s.actions}>
          <MarketingAppCta className={s.primary} label={actionLabel} size='lg' />
          {secondary && (
            <Button className={s.secondary} href={secondary.href} size='lg' variant='outline'>
              {secondary.label}
            </Button>
          )}
          {note && <span className={s.note}>{note}</span>}
        </div>
      </div>
    </RevealOnScroll>
  </MarketingSection>
);
