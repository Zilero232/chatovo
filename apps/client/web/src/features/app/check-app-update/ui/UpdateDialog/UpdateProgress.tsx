import { Progress, Text } from '@chatovo/ui-kit';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { UpdateProgressProps } from './UpdateProgress.types';

import s from './UpdateDialog.module.scss';

export const UpdateProgress = ({ status, progress }: UpdateProgressProps) => {
  const t = useTranslations('update');

  return match(status)
    .with(P.union('downloading', 'installing'), (current) => (
      <div className={s.progressWrap}>
        <Progress value={current === 'installing' ? 100 : progress} />

        <div className={s.progressLabel}>
          <span>
            {current === 'installing' ? t('installing') : t('downloading', { percent: progress })}
          </span>
        </div>
      </div>
    ))
    .with('error', () => (
      <Text size='sm' tone='destructive'>
        {t('failed')}
      </Text>
    ))
    .otherwise(() => null);
};
