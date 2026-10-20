import { Text } from '@chatovo/ui-kit';

import type { StatGroupProps } from './StatGroup.types';

import s from './StatGroup.module.scss';

export const StatGroup = ({ title, children }: StatGroupProps) => (
  <section className={s.root}>
    <Text as='h2' className={s.title} size='xs' tone='muted' weight='medium'>
      {title}
    </Text>

    <div className={s.grid}>{children}</div>
  </section>
);
