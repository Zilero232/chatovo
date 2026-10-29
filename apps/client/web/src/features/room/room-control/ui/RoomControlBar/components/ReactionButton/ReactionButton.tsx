import { Popover, PopoverContent, PopoverTrigger } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { SmilePlus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useInvisibleGuard } from '@/entities/room/room';

import { QUICK_REACTIONS } from '../../../../config/reactions';
import { useReactions } from '../../../../model/contexts';
import { controlButtonToneClass } from '../ControlButton/control-button-tones';
import { ControlButton } from '../ControlButton/ControlButton';

import s from '../ControlButton/ControlButton.module.scss';
import sReaction from './ReactionButton.module.scss';

export const ReactionButton = () => {
  const t = useTranslations('room.controls');

  const [isOpen, toggleOpen] = useBoolean(false);

  const { send } = useReactions();
  const { isInvisible, notifyBlocked } = useInvisibleGuard();

  if (isInvisible) {
    return (
      <ControlButton
        isLocked
        icon={<SmilePlus />}
        label={t('invisibleLocked')}
        tone='off'
        onClick={notifyBlocked}
      />
    );
  }

  const pick = (emoji: string) => {
    send(emoji);
    toggleOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger
        aria-label={t('react')}
        className={clsx(s.controlButton, controlButtonToneClass.off)}
      >
        <SmilePlus />
      </PopoverTrigger>

      <PopoverContent
        align='center'
        className={sReaction.popover}
        initialFocus={false}
        side='top'
        sideOffset={24}
      >
        <div className={sReaction.row}>
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              aria-label={emoji}
              className={sReaction.emoji}
              type='button'
              onClick={() => pick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
