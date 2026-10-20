import { Popover, PopoverContent, PopoverTrigger } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Siren } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { SoundboardButtonProps } from './SoundboardButton.types';

import { SOUNDBOARD_SOUND_EMOJI, SOUNDBOARD_SOUNDS } from '../../../config/sounds';
import { useSoundboard } from '../../../model/hooks';

import s from './SoundboardButton.module.scss';

export const SoundboardButton = ({ className }: SoundboardButtonProps) => {
  const t = useTranslations('room.soundboard');

  const [isOpen, toggleOpen] = useBoolean(false);

  const { isAdmin, play } = useSoundboard();

  if (!isAdmin) {
    return null;
  }

  const pick = (sound: (typeof SOUNDBOARD_SOUNDS)[number]) => {
    play(sound);
    toggleOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger aria-label={t('label')} className={clsx(s.trigger, className)}>
        <Siren />
      </PopoverTrigger>

      <PopoverContent
        align='center'
        className={s.popover}
        initialFocus={false}
        side='top'
        sideOffset={24}
      >
        <div className={s.grid}>
          {SOUNDBOARD_SOUNDS.map((sound) => (
            <button key={sound} className={s.sound} type='button' onClick={() => pick(sound)}>
              <span aria-hidden className={s.emoji}>
                {SOUNDBOARD_SOUND_EMOJI[sound]}
              </span>
              {t(`sounds.${sound}`)}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
