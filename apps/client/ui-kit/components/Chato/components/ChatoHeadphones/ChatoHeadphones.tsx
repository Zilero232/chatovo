import { CHATO_HEAD_TRANSFORM } from '../../Chato.constants';

import s from '../../Chato.module.scss';

export const ChatoHeadphones = () => (
  <g transform={CHATO_HEAD_TRANSFORM}>
    <path className={s.band} d='M22 50 Q20 14 50 14 Q80 14 78 50' />
    <rect className={s.cup} height='22' rx='6' width='13' x='13' y='44' />
    <rect className={s.cup} height='22' rx='6' width='13' x='74' y='44' />
    <rect className={s.cushion} height='14' rx='3' width='4' x='22' y='48' />
    <rect className={s.cushion} height='14' rx='3' width='4' x='74' y='48' />
  </g>
);
