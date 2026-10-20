import s from '../../Chato.module.scss';

export const ChatoLedge = () => (
  <g>
    <rect className={s.ledge} height='34' rx='12' width='184' x='8' y='160' />
    <ellipse className={s.fur} cx='76' cy='162' rx='14' ry='9' />
    <ellipse className={s.fur} cx='124' cy='162' rx='14' ry='9' />
    <path className={s.toes} d='M71 159 v5 M80 159 v5 M119 159 v5 M128 159 v5' />
  </g>
);
