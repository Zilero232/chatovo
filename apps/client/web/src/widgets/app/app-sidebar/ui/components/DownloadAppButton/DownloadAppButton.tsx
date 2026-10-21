import { useBoolean } from '@siberiacancode/reactuse';
import { Download } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { DownloadAppDialog } from '@/features/app/download-app';

import type { DownloadAppButtonProps } from './DownloadAppButton.types';

import { SidebarItem } from '../SidebarItem/SidebarItem';

export const DownloadAppButton = ({ variant }: DownloadAppButtonProps) => {
  const t = useTranslations('appSidebar');
  const [isOpen, toggle] = useBoolean(false);

  return (
    <>
      <SidebarItem
        icon={<Download />}
        label={t('downloadAppLabel')}
        title={t('downloadApp')}
        variant={variant}
        onClick={() => toggle(true)}
      />

      <DownloadAppDialog open={isOpen} onOpenChange={toggle} />
    </>
  );
};
