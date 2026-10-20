'use client';

import { PopoverContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { ProfileCardTriggerProps } from './ProfileCardTrigger.types';

import { useProfileCardTrigger } from '../../model/hooks';
import { ProfileCard } from '../ProfileCard/ProfileCard';

import s from './ProfileCardTrigger.module.scss';

export const ProfileCardTrigger = ({
  identity,
  name,
  className,
  children,
  renderFriendActions
}: ProfileCardTriggerProps) => {
  const { triggerRef, isOpen, hasOpened, open, setIsOpen } = useProfileCardTrigger();

  return (
    <>
      <button
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        className={clsx(s.trigger, className)}
        type='button'
        onClick={open}
      >
        {children}
      </button>

      {hasOpened && (
        <PopoverContent
          align='start'
          className={s.content}
          isOpen={isOpen}
          sideOffset={8}
          triggerRef={triggerRef}
          onOpenChange={setIsOpen}
        >
          <ProfileCard identity={identity} name={name} renderFriendActions={renderFriendActions} />
        </PopoverContent>
      )}
    </>
  );
};
