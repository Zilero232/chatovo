import { clsx } from 'clsx';

import type { StatusScreenProps } from './StatusScreen.types';

import { Text } from '../../primitives';

import s from './StatusScreen.module.scss';

export const StatusScreen = ({
  illustration,
  code,
  title,
  description,
  actions,
  className
}: StatusScreenProps) => (
  <section className={clsx(s.root, className)}>
    {illustration}

    {code && <p className={s.code}>{code}</p>}

    <h1 className={s.title}>{title}</h1>
    <Text className={s.description} tone='muted'>
      {description}
    </Text>

    <div className={s.actions}>{actions}</div>
  </section>
);
