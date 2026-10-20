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
  const normalized = pathname.replace(/\/index\.html$/, '').replace(/(.+)\/$/, '$1');

  return TITLE_KEY_BY_ROUTE[normalized as keyof typeof TITLE_KEY_BY_ROUTE];
};

export const DocumentTitleSync = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const t = useTranslations('pageMeta');

  const { locale, isReady } = useLocale();

  const titleKey = readTitleKey(pathname);

  useEffect(() => {
    if (!isReady || !titleKey) {
      return;
    }

    const site = locale === 'en' ? SITE.en : SITE;
    const title = `${t(titleKey)} · ${SITE.name}`;

    document.documentElement.lang = site.lang;
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.description);

    const applyTitle = () => {
      if (document.title !== title) {
        document.title = title;
      }
    };

    applyTitle();

    const observer = new MutationObserver(applyTitle);

    observer.observe(document.head, { childList: true });

    const titleNode = document.querySelector('title');

    if (titleNode) {
      observer.observe(titleNode, { childList: true, characterData: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [isReady, locale, titleKey, t]);

  return null;
};
