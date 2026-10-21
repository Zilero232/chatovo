import { Button, CenteredState, IconButtonWithTooltip } from '@chatovo/ui-kit';
import { Radio, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'use-intl';

import type { MusicQueueProps } from './MusicQueue.types';

import { useMusicQueue } from '../../../model/hooks';
import { QueueItem } from '../QueueItem/QueueItem';

import s from './MusicQueue.module.scss';

export const MusicQueue = ({ onOpenRadio }: MusicQueueProps) => {
  const t = useTranslations('room.music');

  const { queue, isEmpty, remove } = useMusicQueue();

  if (isEmpty) {
    return (
      <CenteredState
        action={
          <Button size='sm' variant='secondary' onClick={onOpenRadio}>
            <Radio aria-hidden />
            {t('empty.openRadio')}
          </Button>
        }
        chato='listen'
        description={t('empty.description')}
        size='sm'
        title={t('empty.title')}
      />
    );
  }

  return (
    <section className={s.root}>
      <h3 className={s.heading}>{t('queue.title')}</h3>

      {queue.length === 0 && <p className={s.note}>{t('queue.empty')}</p>}

      <ol className={s.list}>
        <AnimatePresence initial={false}>
          {queue.map((track) => (
            <QueueItem
              key={track.id}
              action={
                <IconButtonWithTooltip
                  icon={<X />}
                  label={t('queue.remove', { title: track.title })}
                  size='icon-xs'
                  tooltipSide='left'
                  onClick={() => remove(track.id)}
                />
              }
              caption={t('nowPlaying.addedBy', { name: track.addedBy.name })}
              track={track}
            />
          ))}
        </AnimatePresence>
      </ol>
    </section>
  );
};
