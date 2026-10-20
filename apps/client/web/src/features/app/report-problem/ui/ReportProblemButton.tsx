import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { Bug } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ReportProblemDialog } from './ReportProblemDialog/ReportProblemDialog';

export const ReportProblemButton = () => {
  const t = useTranslations('feedback');

  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <>
      <Tooltip>
        <Button
          aria-label={t('title')}
          size='icon'
          type='button'
          variant='ghost'
          onClick={() => toggleOpen(true)}
        >
          <Bug />
        </Button>
        <TooltipContent>{t('title')}</TooltipContent>
      </Tooltip>

      <ReportProblemDialog open={isOpen} onOpenChange={toggleOpen} />
    </>
  );
};
