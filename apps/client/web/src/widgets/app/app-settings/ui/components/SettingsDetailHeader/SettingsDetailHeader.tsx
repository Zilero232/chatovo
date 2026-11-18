import { Button, DialogDescription, DialogHeader, DialogTitle } from '@chatovo/ui-kit';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { SettingsDetailHeaderProps } from './SettingsDetailHeader.types';

import s from '../../AppSettingsButton.module.scss';

export const SettingsDetailHeader = ({ activeTab, onBack }: SettingsDetailHeaderProps) => {
  const t = useTranslations('settings');

  return (
    <DialogHeader className={s.mainHeader}>
      <Button
        aria-label={t('back')}
        className={s.backButton}
        size='icon'
        type='button'
        variant='ghost'
        onClick={onBack}
      >
        <ChevronLeft />
      </Button>

      <div className={s.mainHeaderText}>
        <DialogTitle>{t(`tabs.${activeTab}`)}</DialogTitle>
        <DialogDescription>{t(`hints.${activeTab}`)}</DialogDescription>
      </div>
    </DialogHeader>
  );
};
