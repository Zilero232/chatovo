import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogHint,
  DialogTitle
} from '@chatovo/ui-kit';
import { ShieldAlert } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ReportAbuseDialogProps } from './ReportAbuseDialog.types';

import { ReportAbuseForm } from './components';

export const ReportAbuseDialog = ({
  target,
  targetId,
  targetName,
  open,
  onOpenChange
}: ReportAbuseDialogProps) => {
  const t = useTranslations('moderation');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<ShieldAlert />} tone='fuchsia'>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {targetName
              ? t('descriptionNamed', { name: targetName })
              : t(`descriptionFor.${target}`)}
          </DialogDescription>
        </DialogHeader>

        <ReportAbuseForm target={target} targetId={targetId} onSent={() => onOpenChange(false)} />

        <DialogHint>{t('hint')}</DialogHint>
      </DialogContent>
    </Dialog>
  );
};
