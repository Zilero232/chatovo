import { getLocale } from 'next-intl/server';

import { DEFAULT_LOCALE, isLocale } from '@/shared/i18n';
import { NotFoundPage } from '@/views/not-found';

const NotFound = async () => {
  const locale = await getLocale();

  return <NotFoundPage locale={isLocale(locale) ? locale : DEFAULT_LOCALE} />;
};

export default NotFound;
