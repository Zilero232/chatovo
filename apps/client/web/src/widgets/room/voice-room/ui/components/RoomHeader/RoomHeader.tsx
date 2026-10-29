import { clsx } from 'clsx';
import { AudioLines } from 'lucide-react';

import type { RoomHeaderProps } from './RoomHeader.types';

import { useDmCallLabel } from '../../../model/hooks';
import { ConnectionIndicator } from '../ConnectionIndicator/ConnectionIndicator';

import s from './RoomHeader.module.scss';

export const RoomHeader = ({ name }: RoomHeaderProps) => {
  const { title, duration } = useDmCallLabel(name);

  return (
    <div className={clsx(s.root, 'surface-bar')}>
      <span aria-hidden className='accent-top-line' />
      <span aria-hidden className={s.icon}>
        <AudioLines className={s.iconGlyph} />
      </span>

      <div className={s.info}>
        <h1 className={s.title}>{title}</h1>
        {duration !== null && <span className={s.duration}>{duration}</span>}
      </div>

      <ConnectionIndicator />
    </div>
  );
};
