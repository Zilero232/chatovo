import { clsx } from 'clsx';
import { AudioLines } from 'lucide-react';

import type { RoomHeaderProps } from './RoomHeader.types';

import { ConnectionIndicator } from '../ConnectionIndicator/ConnectionIndicator';

import s from './RoomHeader.module.scss';

export const RoomHeader = ({ name }: RoomHeaderProps) => (
  <div className={clsx(s.root, 'surface-bar')}>
    <span aria-hidden className='accent-top-line' />
    <span aria-hidden className={s.icon}>
      <AudioLines className={s.iconGlyph} />
    </span>

    <div className={s.info}>
      <h1 className={s.title}>{name}</h1>
    </div>

    <ConnectionIndicator />
  </div>
);
