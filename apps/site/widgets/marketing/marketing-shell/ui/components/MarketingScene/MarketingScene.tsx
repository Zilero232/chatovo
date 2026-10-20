import { clsx } from 'clsx';

import type { MarketingSceneProps } from './MarketingScene.types';

import s from './MarketingScene.module.scss';

export const MarketingScene = ({ children, size = 'md', className }: MarketingSceneProps) => (
  <div className={clsx(s.root, s[size], className)}>
    <div aria-hidden className={s.arch}>
      <span className={s.moon} />
      <span className={s.floor} />
    </div>
    <div className={s.content}>{children}</div>
  </div>
);
