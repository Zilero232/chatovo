import s from '../../Chato.module.scss';

export const ChatoBody = () => (
  <g>
    <ellipse className={s.shadow} cx='100' cy='188' rx='58' ry='7' />
    <path className={s.tail} d='M134 170 Q182 164 174 126 Q170 110 158 116' />
    <path className={s.fur} d='M62 182 Q50 98 100 92 Q150 98 138 182 Q100 190 62 182 Z' />
    <ellipse className={s.belly} cx='100' cy='150' rx='25' ry='24' />
    <ellipse className={s.fur} cx='80' cy='182' rx='15' ry='8' />
    <ellipse className={s.fur} cx='120' cy='182' rx='15' ry='8' />
    <path className={s.toes} d='M76 180 v4 M84 180 v4 M116 180 v4 M124 180 v4' />
  </g>
);
