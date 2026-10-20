'use client';

import { appEvents } from '@/shared/lib';

import type { SecretClickAreaProps } from './SecretClickArea.types';

import { SECRET_CLICK_COUNT } from '../../config';
import { useSecretClicks } from '../../model/hooks';

import s from './SecretClickArea.module.scss';

export const SecretClickArea = ({ children }: SecretClickAreaProps) => {
  const handleClick = useSecretClicks({
    count: SECRET_CLICK_COUNT,
    onReach: () => appEvents.emit.secretGameOpen()
  });

  return (
    // eslint-disable-next-line siberiacancode-jsx-a11y/no-static-element-interactions, siberiacancode-jsx-a11y/click-events-have-key-events -- a hidden easter egg must stay invisible to assistive tech, not become a focusable control
    <span className={s.root} onClick={handleClick}>
      {children}
    </span>
  );
};
