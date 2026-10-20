import { useTranslations } from 'use-intl';

import { apiErrorCode } from '@/shared/api';

export const useErrorMessage = () => {
  const t = useTranslations('errors');

  return (error: unknown) => t(apiErrorCode(error));
};
