import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Check, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import { useCopyInviteLink, useCurrentRoomId } from '../../../model/hooks';
import {
  INVITE_ICON_ANIMATE,
  INVITE_ICON_EXIT,
  INVITE_ICON_INITIAL,
  INVITE_ICON_TRANSITION
} from './RoomInviteButton.motion';

import s from './RoomInviteButton.module.scss';

export const RoomInviteButton = () => {
  const t = useTranslations('room.invite');
  const roomId = useCurrentRoomId();
  const { canCopy, copied, copyInviteLink } = useCopyInviteLink(roomId);

  return (
    <Tooltip>
      <Button
        aria-label={copied ? t('linkCopied') : t('copyLink')}
        className={clsx(s.button, copied && s.buttonCopied)}
        disabled={!canCopy}
        size='icon-lg'
        type='button'
        variant='ghost'
        onClick={copyInviteLink}
      >
        <AnimatePresence initial={false} mode='popLayout'>
          <motion.span
            key={copied ? 'copied' : 'idle'}
            animate={INVITE_ICON_ANIMATE}
            className={s.iconSlot}
            exit={INVITE_ICON_EXIT}
            initial={INVITE_ICON_INITIAL}
            transition={INVITE_ICON_TRANSITION}
          >
            {copied ? <Check /> : <Link2 />}
          </motion.span>
        </AnimatePresence>
      </Button>
      <TooltipContent>{copied ? t('linkCopied') : t('tooltip')}</TooltipContent>
    </Tooltip>
  );
};
