'use client';

import { X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';

import { CenteredState, IconButtonWithTooltip } from '@/ui-kit';

import { useMusicQueue } from '../../../model/hooks';
import { QueueItem } from '../QueueItem/QueueItem';

import s from './MusicQueue.module.scss';

export const MusicQueue = () => {
  const t = useTranslations('room.music');

  const { queue, isEmpty, remove } = useMusicQueue();

  if (isEmpty) {
    return (
      <CenteredState
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
