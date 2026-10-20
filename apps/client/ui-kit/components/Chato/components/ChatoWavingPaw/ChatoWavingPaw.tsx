import s from '../../Chato.module.scss';

export const ChatoWavingPaw = () => (
  <g className={s.wave}>
    <path className={s.arm} d='M132 132 Q150 112 160 92' />
    <circle className={s.fur} cx='161' cy='87' r='10' />
  </g>
);
