import { ChatoScene, Text } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { isTauri } from '@tauri-apps/api/core';
import { useTranslations } from 'use-intl';

import { DownloadAppDialog } from '@/features/app/download-app';

import type { AuthPanelProps } from './AuthPanel.types';

import { AUTH_CHATO_POSE } from '../../../config';

import s from './AuthPanel.module.scss';

export const AuthPanel = ({ mode }: AuthPanelProps) => {
  const t = useTranslations('auth.panel');

  const [isDownloadOpen, toggleDownload] = useBoolean(false);

  const isApp = isTauri();

  return (
    <aside className={s.root}>
      <ChatoScene className={s.scene} pose={AUTH_CHATO_POSE[mode]} size='sm' />

      <h2 className={s.title}>{t('title')}</h2>
      <Text align='center' size='sm' tone='muted'>
        {t('text')}
      </Text>

      {!isApp && (
        <>
          <button className={s.link} type='button' onClick={() => toggleDownload(true)}>
            {t('download')}
          </button>

          <DownloadAppDialog open={isDownloadOpen} onOpenChange={toggleDownload} />
        </>
      )}
    </aside>
  );
};
