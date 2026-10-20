import type { ChatoHeadProps } from './ChatoHead.types';

import { ChatoEyes } from '../ChatoEyes/ChatoEyes';

import s from '../../Chato.module.scss';

export const ChatoHead = ({ eyes, transform }: ChatoHeadProps) => (
  <g transform={transform}>
    <path className={s.fur} d='M21 41 Q18 16 35 23 Q43 27 45 40 Z' />
    <path className={s.fur} d='M79 41 Q82 16 65 23 Q57 27 55 40 Z' />
    <path className={s.innerEar} d='M27 37 Q26 24 34 28 Q39 31 40 39 Z' />
    <path className={s.innerEar} d='M73 37 Q74 24 66 28 Q61 31 60 39 Z' />
    <path
      className={s.fur}
      d='M50 30 Q79 30 79 56 Q79 76 64 82 Q57 80 50 82 Q43 80 36 82 Q21 76 21 56 Q21 30 50 30 Z'
    />
    <ellipse className={s.blush} cx='30' cy='64' rx='5' ry='3.2' />
    <ellipse className={s.blush} cx='70' cy='64' rx='5' ry='3.2' />
    <ChatoEyes eyes={eyes} />
    <path className={s.ink} d='M50 61 L45.5 67 H54.5 Z' />
    <path className={s.stroke} d='M42 70 Q50 78 58 70' />
  </g>
);
