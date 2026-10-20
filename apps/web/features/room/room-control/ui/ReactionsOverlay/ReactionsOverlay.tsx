'use client';

import { clsx } from 'clsx';

import { useReactions } from '../../model/contexts';

import s from './ReactionsOverlay.module.scss';

export const ReactionsOverlay = () => {
  const { reactions } = useReactions();

  return (
    <div aria-hidden className={s.root}>
      {reactions.map((reaction) => (
        <span
          key={reaction.id}
          className={clsx(s.item, 'animate-reaction-float')}
          style={{ marginRight: `${reaction.offset}px` }}
        >
          {reaction.emoji}
        </span>
      ))}
    </div>
  );
};
