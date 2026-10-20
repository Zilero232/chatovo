'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHint,
  DialogTitle
} from '@chatovo/ui-kit';
import { Bug } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ReportProblemDialogProps } from './ReportProblemDialog.types';

import { ReportProblemForm } from './components';

export const ReportProblemDialog = ({ open, onOpenChange }: ReportProblemDialogProps) => {
  const t = useTranslations('feedback');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<Bug />} tone='fuchsia'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <ReportProblemForm onSent={() => onOpenChange(false)} />

        <DialogHint>{t('hint')}</DialogHint>
      </DialogContent>
    </Dialog>
  );
};
