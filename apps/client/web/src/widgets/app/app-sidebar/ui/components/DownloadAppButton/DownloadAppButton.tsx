import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { Download } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { DownloadAppDialog } from '@/features/app/download-app';

export const DownloadAppButton = () => {
  const t = useTranslations('appSidebar');
  const [isOpen, toggle] = useBoolean(false);

  return (
    <>
      <Tooltip>
        <Button
          aria-label={t('downloadAppLabel')}
          size='icon'
          variant='ghost'
          onClick={() => toggle(true)}
        >
          <Download />
        </Button>
        <TooltipContent side='right'>{t('downloadApp')}</TooltipContent>
      </Tooltip>

      <DownloadAppDialog open={isOpen} onOpenChange={toggle} />
    </>
  );
};
