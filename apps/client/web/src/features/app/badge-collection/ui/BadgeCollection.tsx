import { Button, CenteredState, Spinner } from '@chatovo/ui-kit';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useBadgeCollection } from '../model/hooks';
import { BadgeDetail, BadgeGrid } from './components';

import s from './BadgeCollection.module.scss';

export const BadgeCollection = () => {
  const t = useTranslations('badges');

  const { earned, available, selected, isPending, isError, retry, select } = useBadgeCollection();

  return match({ isPending, isError, selected })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ isError: true }, () => (
      <CenteredState
        action={
          <Button size='sm' type='button' variant='outline' onClick={retry}>
            {t('retry')}
          </Button>
        }
        size='sm'
        title={t('loadFailed')}
      />
    ))
    .with({ selected: P.nonNullable }, ({ selected: badge }) => (
      <div className={s.root}>
        <div className={s.lists}>
          <p className={s.intro}>{t('intro')}</p>

          {earned.length > 0 && (
            <BadgeGrid
              badges={earned}
              selectedId={badge.id}
              title={t('earned')}
              onSelect={select}
            />
          )}

          {available.length > 0 && (
            <BadgeGrid
              badges={available}
              selectedId={badge.id}
              title={t('available')}
              onSelect={select}
            />
          )}
        </div>

        <BadgeDetail badge={badge} />
      </div>
    ))
    .otherwise(() => null);
};
