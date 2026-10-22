import { clsx } from 'clsx';

import type { ChatoSceneProps } from './ChatoScene.types';

import { Chato } from '../Chato';

import s from './ChatoScene.module.scss';

export const ChatoScene = ({ children, pose, size = 'md', className }: ChatoSceneProps) => (
  <div className={clsx(s.root, s[size], className)}>
    <div aria-hidden className={s.arch}>
      <span className={s.moon} />
      <span className={s.floor} />
    </div>

    <div className={s.content}>
      {pose && <Chato className={s.chato} pose={pose} />}
      {children}
    </div>
  </div>
);
