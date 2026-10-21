import { localizeSitePath } from '@chatovo/config';
import { Button } from '@chatovo/ui-kit';

import { ROUTES } from '@/shared/constants';

import type { HomeDownloadButtonProps } from './HomeDownloadButton.types';

export const HomeDownloadButton = ({ label, locale }: HomeDownloadButtonProps) => (
  <Button href={localizeSitePath({ path: ROUTES.download, locale })} size='lg' variant='outline'>
    {label}
  </Button>
);
