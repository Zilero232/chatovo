'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@chatovo/ui-kit';
import { Download, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRelease } from '@/entities/app/release';
import { EXTERNAL_LINKS } from '@/shared/constants';

import type { DownloadAppDialogProps } from './DownloadAppDialog.types';

import { PlatformGrid } from './components';

import s from './DownloadAppDialog.module.scss';

export const DownloadAppDialog = ({ open, onOpenChange }: DownloadAppDialogProps) => {
  const t = useTranslations('downloadApp');
  const { isLoading, isError, data: release } = useRelease(open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content}>
        <DialogHeader icon={<Download />} tone='cyan'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className={s.description}>{t('description')}</DialogDescription>
        </DialogHeader>

        {isLoading && <Loader2 className={s.spinner} />}

        {isError && (
          <div className={s.fallback}>
            {t('loadFailed')}{' '}
            <a
              className={s.fallbackLink}
              href={EXTERNAL_LINKS.appReleases}
              rel='noopener noreferrer'
              target='_blank'
            >
              {t('openReleases')}
            </a>
          </div>
        )}

        {!isLoading && <PlatformGrid release={release} />}

        {release && (
          <div className={s.meta}>
            <span className={s.version}>{t('version', { version: release.version })}</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
