import { clsx } from 'clsx';

import s from '../../VoiceRoom.module.scss';

export const RoomAmbience = () => (
  <div aria-hidden className={clsx(s.ambience, 'lobby-ambience')}>
    <span className={clsx(s.orbViolet, 'lobby-ambience-orb lobby-ambience-orb-violet')} />
    <span className={clsx(s.orbCyan, 'lobby-ambience-orb lobby-ambience-orb-cyan')} />
  </div>
);
