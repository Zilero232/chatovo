'use client';

import { Text } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DownloadAppDialog } from '@/features/app/download-app';

import s from '../AppSettingsButton.module.scss';

export const WebNotice = () => {
  const t = useTranslations('settings.shortcuts');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <>
      <div className={s.webNotice}>
        <Info className={s.webNoticeIcon} />
        <Text className={s.webNoticeText} size='sm' tone='inherit'>
          {t.rich('webNotice', {
            link: (chunks) => (
              <button className={s.webNoticeLink} type='button' onClick={() => toggleOpen(true)}>
                {chunks}
              </button>
            )
          })}
        </Text>
      </div>

      <DownloadAppDialog open={isOpen} onOpenChange={toggleOpen} />
    </>
  );
};
