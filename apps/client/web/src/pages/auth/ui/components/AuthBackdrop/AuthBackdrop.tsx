import { useRef } from 'react';

import { AUTH_TWINKLES } from '../../../config';
import { usePointerParallax } from '../../../model/hooks';

import s from './AuthBackdrop.module.scss';

export const AuthBackdrop = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  usePointerParallax(rootRef);

  return (
    <div aria-hidden ref={rootRef} className={s.root}>
      <div className={s.sky} />

      <div className={s.twinkles}>
        {AUTH_TWINKLES.map(({ x, y, delay }) => (
          <span
            key={`${x}-${y}`}
            className={s.twinkle}
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <div className={s.city} />
    </div>
  );
};
