import { Button } from '@chatovo/ui-kit';

import { ROUTES } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';

import type { HomeDownloadButtonProps } from './HomeDownloadButton.types';

export const HomeDownloadButton = ({ label, locale }: HomeDownloadButtonProps) => (
  <Button
    href={localizeMarketingPath({ path: ROUTES.download, locale })}
    size='lg'
    variant='outline'
  >
    {label}
  </Button>
);
