'use client';

import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { OverlayCloseButtonProps } from './OverlayCloseButton.types';

import { Button } from '../../primitives/Button';

export const OverlayCloseButton = ({ className, onClick, ...props }: OverlayCloseButtonProps) => {
  const t = useTranslations('ui');

  return (
    <Button
      aria-label={t('close')}
      className={className}
      size='icon-xs'
      variant='ghost'
      onClick={onClick}
      {...props}
    >
      <XIcon aria-hidden />
    </Button>
  );
};
