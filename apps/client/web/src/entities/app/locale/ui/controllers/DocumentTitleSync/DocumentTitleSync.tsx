import { useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslations } from 'use-intl';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

import { useLocale } from '../../../model/hooks';

const TITLE_KEY_BY_ROUTE = {
  [ROUTES.lobby]: 'lobby',
  [ROUTES.room]: 'room',
  [ROUTES.admin]: 'admin',
  [ROUTES.auth]: 'auth',
  [ROUTES.resetPassword]: 'resetPassword',
  [ROUTES.accountDelete]: 'accountDelete'
} as const;

type TitleKey = (typeof TITLE_KEY_BY_ROUTE)[keyof typeof TITLE_KEY_BY_ROUTE];

const readTitleKey = (pathname: string): TitleKey | undefined => {
  const normalized = pathname.replace(/(.+)\/$/, '$1');

  return TITLE_KEY_BY_ROUTE[normalized as keyof typeof TITLE_KEY_BY_ROUTE];
};

export const DocumentTitleSync = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const t = useTranslations('pageMeta');

  const { locale } = useLocale();

  const titleKey = readTitleKey(pathname);

  useEffect(() => {
    if (!titleKey) {
      return;
    }

    const site = locale === 'en' ? SITE.en : SITE;

    document.title = `${t(titleKey)} · ${SITE.name}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.description);
  }, [locale, titleKey, t]);

  return null;
};
