import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@chatovo/ui-kit';
import { format } from 'date-fns';
import { ArrowUpCircle } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useDateLocale } from '@/entities/app/locale';

import type { UpdateDialogProps } from './UpdateDialog.types';

import { parseTauriDate } from '../../lib/parse-tauri-date';
import { UpdateProgress } from './UpdateProgress';

import s from './UpdateDialog.module.scss';

export const UpdateDialog = ({
  status,
  currentVersion,
  version,
  date,
  progress,
  onInstall,
  onDismiss
}: UpdateDialogProps) => {
  const t = useTranslations('update');
  const dateLocale = useDateLocale();

  const isBusy = status === 'downloading' || status === 'installing';
  const open =
    status === 'available' ||
    status === 'downloading' ||
    status === 'installing' ||
    status === 'error';

  const parsedDate = parseTauriDate(date);

  const releaseDate = parsedDate ? format(parsedDate, 'd MMM yyyy', { locale: dateLocale }) : date;

  return (
    <Dialog
      disablePointerDismissal={isBusy}
      open={open}
      onOpenChange={(next) => {
        if (!next && isBusy) {
          return;
        }

        if (!next && !isBusy) {
          onDismiss();
        }
      }}
    >
      <DialogContent showCloseButton={!isBusy}>
        <DialogHeader icon={<ArrowUpCircle />} tone='violet'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description', { version: version ?? '' })}</DialogDescription>
        </DialogHeader>

        <div className={s.meta}>
          {currentVersion && (
            <div className={s.metaRow}>
              <span className={s.versionPill}>{currentVersion}</span>
              <span>→</span>
              <span className={s.versionPill}>{version}</span>
            </div>
          )}
          {releaseDate && <span>{t('releasedOn', { date: releaseDate })}</span>}
        </div>

        <UpdateProgress progress={progress} status={status} />

        {!isBusy && (
          <DialogFooter>
            <Button variant='outline' onClick={onDismiss}>
              {t('later')}
            </Button>
            <Button disabled={status === 'error'} onClick={onInstall}>
              {t('install')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
