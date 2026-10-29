import { useMount } from '@siberiacancode/reactuse';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useInvisibleGuard } from '@/entities/room/room';

export const InvisibleNoticeController = () => {
  const t = useTranslations('room');

  const { isInvisible, turnOff } = useInvisibleGuard();

  useMount(() => {
    if (isInvisible) {
      toast.info(t('invisibleNotice'), {
        id: 'invisible-notice',
        description: t('invisible.noticeHint'),
        action: { label: t('invisible.turnOff'), onClick: turnOff }
      });
    }
  });

  return null;
};
