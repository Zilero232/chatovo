import { Music, Pause, SkipForward } from 'lucide-react';

import type { HomeHeroCardProps } from './HomeHeroCard.types';

import { HOME_ROOM_MOCK } from '../../../config';

import s from './HomeHeroCard.module.scss';

export const HomeHeroCard = ({ room, live, track, source }: HomeHeroCardProps) => (
  <div aria-hidden className={s.root}>
    <div className={s.header}>
      <span className={s.room}>{room}</span>
      <span className={s.live}>
        <span className={s.liveDot} />
        {live}
      </span>
    </div>

    <div className={s.people}>
      {HOME_ROOM_MOCK.map((member) => (
        <span key={member.id} className={s.person} data-speaking={member.isSpeaking}>
          <span className={s.avatar} data-tone={member.tone}>
            {member.name.charAt(0).toUpperCase()}
          </span>
          <span className={s.name}>{member.name}</span>
        </span>
      ))}
    </div>

    <div className={s.player}>
      <span className={s.art}>
        <Music />
      </span>
      <span className={s.meta}>
        <span className={s.track}>{track}</span>
        <span className={s.source}>{source}</span>
      </span>
      <span className={s.controls}>
        <span className={s.play}>
          <Pause />
        </span>
        <SkipForward />
      </span>
      <span className={s.progress} />
    </div>
  </div>
);
