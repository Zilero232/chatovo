import { Mic, MonitorUp, PhoneOff } from 'lucide-react';

import type { HomeRoomMockProps } from './HomeRoomMock.types';

import { HOME_ROOM_MOCK } from '../../../config';

import s from './HomeRoomMock.module.scss';

export const HomeRoomMock = ({ speakingLabel }: HomeRoomMockProps) => (
  <div aria-hidden className={s.roomMock}>
    <div className={s.roomMockGrid}>
      {HOME_ROOM_MOCK.map((member) => (
        <div key={member.id} className={s.roomMockTile} data-speaking={member.isSpeaking}>
          <span className={s.roomMockAvatar} data-tone={member.tone}>
            {member.name.charAt(0).toUpperCase()}
          </span>
          <span className={s.roomMockName}>{member.name}</span>
        </div>
      ))}
    </div>
    <div className={s.roomMockBar}>
      <span className={s.roomMockCaption}>{speakingLabel}</span>
      <span className={s.roomMockControls}>
        <Mic />
        <MonitorUp />
        <PhoneOff className={s.roomMockLeave} />
      </span>
    </div>
  </div>
);
