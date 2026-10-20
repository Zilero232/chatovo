import { RevealOnScroll, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { MarketingIconGridProps } from './MarketingIconGrid.types';

import { MarketingSection } from '../MarketingSection/MarketingSection';
import { MarketingSectionHead } from '../MarketingSectionHead/MarketingSectionHead';

import s from '../../MarketingShell.module.scss';

const GRID_COLUMN_CLASS = {
  2: s.iconGridTwo,
  3: s.iconGridThree,
  4: s.iconGridFour
};

export const MarketingIconGrid = ({
  items,
  children,
  columns = 3,
  delayStep = 0.05,
  description,
  heading,
  id,
  className
}: MarketingIconGridProps) => {
  const grid = (
    <div className={clsx(s.iconGrid, GRID_COLUMN_CLASS[columns], className)}>
      {items.map(({ description: itemDescription, Icon, key, title }, index) => (
        <RevealOnScroll
          key={key}
          as='article'
          className={s.iconGridCard}
          delay={Math.min(index, 5) * delayStep}
        >
          <span aria-hidden className={s.iconGridIcon}>
            <Icon />
          </span>

          <Text as='h3' className={s.iconGridTitle} weight='semibold'>
            {title}
          </Text>

          <Text className={s.iconGridText} size='sm' tone='muted'>
            {itemDescription}
          </Text>
        </RevealOnScroll>
      ))}
    </div>
  );

  if (!heading) {
    return grid;
  }

  return (
    <MarketingSection id={id}>
      <MarketingSectionHead description={description} heading={heading} />

      {grid}

      {children}
    </MarketingSection>
  );
};
