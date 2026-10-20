import { clsx } from 'clsx';
import { useId } from 'react';

import type { CenteredStateProps } from './CenteredState.types';

import { EmptyStatePattern, Text } from '../../primitives';
import { Chato } from '../Chato';
import {
  centeredStateIconBoxVariants,
  centeredStateTitleVariants,
  centeredStateVariants
} from './CenteredState.variants';

import s from './CenteredState.module.scss';

export const CenteredState = ({
  icon,
  title,
  description,
  action,
  chato,
  pattern,
  size = 'md',
  className
}: CenteredStateProps) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <section
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className={centeredStateVariants({ size, className })}
    >
      {pattern && <EmptyStatePattern className={s.pattern} variant={pattern} />}
      {chato && <Chato className={size === 'sm' ? s.chatoSm : s.chatoMd} pose={chato} />}
      {icon && !chato && (
        <div aria-hidden className={clsx('glass', centeredStateIconBoxVariants({ size }))}>
          {icon}
        </div>
      )}
      <h2 className={centeredStateTitleVariants({ size })} id={titleId}>
        {title}
      </h2>
      {description && (
        <Text className={s.description} id={descriptionId} size='sm' tone='muted'>
          {description}
        </Text>
      )}
      {action && <div className={s.action}>{action}</div>}
    </section>
  );
};
