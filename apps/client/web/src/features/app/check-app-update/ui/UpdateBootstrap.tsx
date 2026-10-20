import type { ReactNode } from 'react';

import { AppSplash } from '@chatovo/ui-kit';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useCheckAppUpdate } from '../model/hooks';
import { UpdateDialog } from './UpdateDialog/UpdateDialog';

export const UpdateBootstrap = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('update');
  const { install, dismiss, ...info } = useCheckAppUpdate();

  const { status, silent, progress } = info;

  if (silent) {
    return match(status)
      .with('checking', () => <AppSplash message={t('checking')} />)
      .with('available', () => <AppSplash message={t('checking')} />)
      .with('downloading', () => (
        <AppSplash message={t('downloading', { percent: progress })} progress={progress} />
      ))
      .with('installing', () => <AppSplash message={t('installing')} progress={100} />)
      .with('error', () => <AppSplash message={t('failed')} />)
      .with('idle', 'unavailable', () => <>{children}</>)
      .exhaustive();
  }

  return match(status)
    .with('checking', () => <AppSplash message={t('checking')} />)
    .with('available', 'downloading', 'installing', 'error', () => (
      <>
        {children}
        <UpdateDialog {...info} onDismiss={dismiss} onInstall={install} />
      </>
    ))
    .with('idle', 'unavailable', () => <>{children}</>)
    .exhaustive();
};
